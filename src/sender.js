/* @flow */
import ProviderFactory from './providers/factory'
import logger from './util/logger'
// Types
import type {ChannelType, OptionsType, NotificationRequestType, NotificationStatusType} from './index'
import type {ProviderType} from './providers/factory'
import type {QueueType} from './queue'

export default class Sender {
  providerFactory: ProviderFactory
  requestQueue: QueueType<NotificationRequestType> | false
  onSuccess: ?(NotificationStatusType, NotificationRequestType) => any
  onError: ?(NotificationStatusType, NotificationRequestType) => any

  constructor (options: OptionsType) {
    this.providerFactory = new ProviderFactory(options.channels)
    if (options.requestQueue) {
      this.requestQueue = (options.requestQueue: any)
    }
    this.onSuccess = options.onSuccess
    this.onError = options.onError
  }

  async handleRequest (request: NotificationRequestType): Promise<NotificationStatusType> {
    if (this.requestQueue) {
      try {
        const info = await this.requestQueue.enqueue('notifme:request', request)
        return {status: 'queued', info}
      } catch (error) {
        const errorResult = {status: 'error', errors: {queue: error}}
        if (this.onError) {
          this.onError(errorResult, request)
        }
        return errorResult
      }
    } else {
      return this.send(request)
    }
  }

  async send (request: NotificationRequestType): Promise<NotificationStatusType> {
    const resultsByChannel = await this.sendOnEachChannel(request)

    const result = resultsByChannel.reduce((acc, {success, channel, providerId, ...rest}) => ({
      ...acc,
      channels: {
        ...(acc.channels || null),
        [channel]: {id: rest.id, providerId}
      },
      ...(!success
        ? {status: 'error', errors: {...acc.errors || null, [channel]: rest.error.message}}
        : null
      )
    }), {status: 'success'})

    if (this.onSuccess && result.status === 'success') {
      this.onSuccess(result, request)
    } else if (this.onError && result.status === 'error') {
      this.onError(result, request)
    }

    return result
  }

  async sendOnEachChannel (request: NotificationRequestType): Promise<Object[]> {
    return Promise.all(Object.keys(request).map(async (channel: any) => {
      const provider = this.providerFactory.get(channel, {})
      if (provider) {
        return this.sendWithProvider(provider, channel, request, 1)
      } else { // should never happen
        return this.handleError(channel, request, new Error(`No provider for channel "${channel}"`), 1)
      }
    }))
  }

  async sendWithProvider (provider: ProviderType, channel: ChannelType, request: NotificationRequestType, attempt: number) {
    try {
      const id = await provider.send((request[channel]: any))
      return {channel, providerId: provider.id, id, success: true}
    } catch (error) {
      return this.handleError(channel, request, error, attempt, provider)
    }
  }

  async handleError (channel: ChannelType, request: NotificationRequestType, error: Error, attempt: number, provider?: ProviderType) {
    logger.warn(error)
    if (provider && attempt <= 1) {
      const multiProviderStrategy = this.providerFactory.getMultiProviderStrategy(channel)
      if (multiProviderStrategy !== 'no-fallback') {
        return this.tryWithFallbackProviders(channel, request, 1)
      }
    }
    return {channel, providerId: provider ? provider.id : null, success: false, error}
  }

  async tryWithFallbackProviders (channel: ChannelType, request: NotificationRequestType, attempt: number) {
    let result = {}
    let currentAttempt = attempt + 1
    let fallbackProvider
    do {
      fallbackProvider = this.providerFactory.get(channel, {attempt: currentAttempt})
      if (fallbackProvider) {
        result = this.sendWithProvider(fallbackProvider, channel, request, currentAttempt)
      }
      currentAttempt++
    } while (fallbackProvider && !result.success)
    return result
  }
}
