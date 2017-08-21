/* @flow */
import logger from './util/logger'
import ProviderLogger from './providers/logger'
import Registry from './util/registry'
// Types
import type {NotificationRequestType, NotificationStatusType, ChannelType} from './index'
import type {ProvidersType} from './providers'
import type {StrategiesType} from './strategies/providers'
import type {QueueType} from './queue'

export default class Sender {
  providers: ProvidersType
  strategies: StrategiesType
  senders: {[ChannelType]: (request: any) => Promise<{providerId: string, id: string}>}
  requestQueue: QueueType<NotificationRequestType> | false

  constructor (providers: ProvidersType, strategies: StrategiesType, requestQueue: any) {
    this.providers = providers
    this.strategies = strategies

    // note : we can do this memoization because we do not allow to add new provider
    this.senders = Object.keys(strategies).reduce((acc, channel: any) => {
      acc[channel] = this.providers[channel].length > 0
        ? strategies[channel](this.providers[channel])
        : async (request) => {
          logger.warn(`No provider registered for channel "${channel}". Using logger.`)
          const provider = Registry.getInstance(`${channel}-logger-default`,
            () => new ProviderLogger({}, channel))

          return {
            success: true,
            channel,
            providerId: provider.id,
            id: await provider.send(request)
          }
        }

      return acc
    }, {})

    if (requestQueue) {
      this.requestQueue = requestQueue
    }
  }

  async handleRequest (request: NotificationRequestType): Promise<NotificationStatusType> {
    if (this.requestQueue) {
      try {
        const info = await this.requestQueue.enqueue('notifme:request', request)
        return {status: 'queued', info}
      } catch (error) {
        const errorResult = {status: 'error', errors: {queue: error}}
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

    return result
  }

  async sendOnEachChannel (request: NotificationRequestType): Promise<Object[]> {
    return Promise.all(Object.keys(request).map(async (channel: any) => {
      try {
        return {
          success: true,
          channel,
          ...await this.senders[channel](request[channel])
        }
      } catch (error) {
        return {channel, success: false, error: error, providerId: error.providerId}
      }
    }))
  }
}
