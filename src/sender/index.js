/* @flow */
import ProviderFactory from '../providers/factory'
import Queue from '../queue'
// Types
import type {OptionsType, NotificationRequestType, NotificationStatusType} from '../index'

export default class Sender {
  providerFactory: ProviderFactory
  requestQueue: ?Queue<NotificationRequestType>

  constructor (options: OptionsType) {
    this.providerFactory = new ProviderFactory(options.providers, options.multiProviderStrategy)
    if (options.requestQueueType) {
      this.requestQueue = new Queue(options.requestQueueType)
      this.nextRequest()
    }
  }

  nextRequest () {
    if (this.requestQueue) {
      this.requestQueue.dequeue('request', async (request: NotificationRequestType) => {
        await this.send(request)
        this.nextRequest()
      })
    }
  }

  async handleRequest (request: NotificationRequestType): Promise<NotificationStatusType> {
    if (this.requestQueue) {
      await this.requestQueue.enqueue('request', request)
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
