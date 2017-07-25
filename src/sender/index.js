/* @flow */
import Queue from '../queue'
// Types
import type {OptionsType, NotificationRequestType, NotificationStatusType} from '../index'

export default class Sender {
  requestQueue: ?Queue<NotificationRequestType>

  constructor (options: OptionsType) {
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
    // TODO: get and call provider
    // TODO: retry request in case of failure
    return {status: 'sent'}
  }
}
