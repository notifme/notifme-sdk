/* @flow */
import ProviderFactory from '../providers/factory'
import Queue from '../queue'
// Types
import type {OptionsType, NotificationRequestType, NotificationStatusType} from '../index'
import type {QueueType} from '../queue'

export default class Sender {
  providerFactory: ProviderFactory
  requestQueue: ?QueueType<NotificationRequestType>
  onError: ?(NotificationStatusType, NotificationRequestType) => any

  constructor (options: OptionsType) {
    this.providerFactory = new ProviderFactory(options.providers, options.multiProviderStrategy)
    if (options.requestQueue) {
      this.requestQueue = typeof options.requestQueue === 'string'
        ? new Queue(options.requestQueue)
        : options.requestQueue
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

  async send (request: NotificationRequestType): Promise<NotificationStatusType> {
    const results = await Promise.all(Object.keys(request).map(async (channel: string) => {
      const provider = this.providerFactory.get((channel: any))
      try {
        await provider.send(request[channel])
        return {channel, success: true}
      } catch (error) {
        return {channel, success: false, error}
      }
    }))
    return results.reduce((acc, {success, channel, ...rest}) => ({
      ...acc,
      ...(!success
        ? {status: 'error', errors: {...acc.errors || null, [channel]: rest.error.message}}
        : null
      )
    }), {status: 'success'})
  }

  handleError (result: NotificationStatusType, request: NotificationRequestType): NotificationStatusType {
    if (this.onError && result.status === 'error') {
      this.onError(result, request)
    }
    return result
  }
}
