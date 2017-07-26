/* @flow */
import ProviderFactory from '../providers/factory'
import Queue from '../queue'
// Types
import type {OptionsType, NotificationRequestType, NotificationStatusType} from '../index'
import type {QueueType} from '../queue'

export default class Sender {
  providerFactory: ProviderFactory
  requestQueue: ?QueueType<NotificationRequestType>

  constructor (options: OptionsType) {
    this.providerFactory = new ProviderFactory(options.providers, options.multiProviderStrategy)
    if (options.requestQueue) {
      this.requestQueue = typeof options.requestQueue === 'string'
        ? new Queue(options.requestQueue)
        : options.requestQueue
      this.nextRequest()
    }
  }

  nextRequest () {
    if (this.requestQueue) {
      this.requestQueue.dequeue('notifme:request', async (request: NotificationRequestType) => {
        await this.send(request)
        this.nextRequest()
      })
    }
  }

  async handleRequest (request: NotificationRequestType): Promise<NotificationStatusType> {
    if (this.requestQueue) {
      await this.requestQueue.enqueue('notifme:request', request)
      return {status: 'queued'}
    } else {
      return this.send(request)
    }
  }

  async send (request: NotificationRequestType): Promise<NotificationStatusType> {
    await Promise.all(Object.keys(request).map(async (channel: string) => {
      const provider = this.providerFactory.get((channel: any))
      await provider.send(request[channel])
      // TODO: retry request in case of failure
    }))
    return {status: 'sent'}
  }
}
