/* @flow */
import Queue from './queue'
// Types
import type {OptionsType, NotificationRequestType, NotificationStatusType} from './index'

/*
TODO:
  - dequeue notifications and send it to providers
  - retry request in case of failure
*/
class Sender {
  options: OptionsType
  requestQueue: ?Queue

  constructor (options: OptionsType) {
    this.options = options
    if (options.requestQueue) {
      this.requestQueue = new Queue(options.requestQueue)
    }
  }

  handleRequest (request: NotificationRequestType): NotificationStatusType {
    if (this.requestQueue) {
      this.requestQueue.enqueue('request', request)
      return {status: 'queued'}
    } else {
      return this.send(request)
    }
  }

  send (request: NotificationRequestType): NotificationStatusType {
    // TODO: get and call provider
    return {status: 'sent'}
  }
}

module.exports = Sender
