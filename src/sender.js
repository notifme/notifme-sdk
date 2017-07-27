/* @flow */
import ProviderFactory from './providers/factory'
import logger from './util/logger'
// Types
import type {ChannelType, OptionsType, NotificationRequestType, NotificationStatusType} from './index'
import type {QueueType} from './queue'

export default class Sender {
  providerFactory: ProviderFactory
  requestQueue: QueueType<NotificationRequestType> | false
  onError: ?(NotificationStatusType, NotificationRequestType) => any

  constructor (options: OptionsType) {
    this.providerFactory = new ProviderFactory(options.channels)
    if (options.requestQueue) {
      this.requestQueue = (options.requestQueue: any)
      this.nextRequest()
    }
    this.onError = options.onError
  }

  nextRequest () {
    if (this.requestQueue) {
      this.requestQueue.dequeue('notifme:request', async (request: NotificationRequestType) => {
        this.handleError(await this.send(request), request)
        this.nextRequest()
      })
    }
  }

  async handleRequest (request: NotificationRequestType): Promise<NotificationStatusType> {
    if (this.requestQueue) {
      await this.requestQueue.enqueue('notifme:request', request)
      return {status: 'queued'}
    } else {
      return this.handleError(await this.send(request), request)
    }
  }

  async send (request: NotificationRequestType, attempt: number = 1): Promise<NotificationStatusType> {
    const results = await Promise.all(Object.keys(request).map(async (channel: string) => {
      const provider = this.providerFactory.get((channel: any), {attempt})
      if (provider) {
        const info = {channel, providerId: provider.id}
        try {
          const id = await provider.send(request[channel])
          return {...info, id, success: true}
        } catch (error) {
          logger.warn(error)
          const multiProviderStrategy = this.providerFactory.getMultiProviderStrategy((channel: any))
          if (multiProviderStrategy !== 'no-fallback') {
            return this.tryWithFallbackProviders((channel: any), request, attempt)
          } else {
            return {...info, success: false, error}
          }
        }
      } else { // should never happen
        return {channel, providerId: null, success: false, error: new Error(`No provider for channel "${channel}"`)}
      }
    }))
    return results.reduce((acc, {success, channel, providerId, ...rest}) => ({
      ...acc,
      [channel]: {id: rest.id, providerId},
      ...(!success
        ? {status: 'error', errors: {...acc.errors || null, [channel]: rest.error.message}}
        : null
      )
    }), {status: 'success'})
  }

  async tryWithFallbackProviders (channel: ChannelType, request: NotificationRequestType, attempt: number) {
    let resultError = {}
    let currentAttempt = attempt + 1
    let fallbackProvider
    do {
      fallbackProvider = this.providerFactory.get((channel: any), {attempt: currentAttempt})
      if (fallbackProvider) {
        const info = {channel, providerId: fallbackProvider.id}
        try {
          const id = await fallbackProvider.send((request[channel]: any))
          return {...info, id, success: true}
        } catch (err) {
          logger.warn(err)
          resultError = {...info, success: false, error: err}
        }
      }
      currentAttempt++
    } while (fallbackProvider)
    return resultError
  }

  handleError (result: NotificationStatusType, request: NotificationRequestType): NotificationStatusType {
    if (this.onError && result.status === 'error') {
      this.onError(result, request)
    }
    return result
  }
}
