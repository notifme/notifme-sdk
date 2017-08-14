/* @flow */
import Queue from './queue'
import Sender from './sender'
// Types
import type {OptionsType, NotificationRequestType} from './index'
import type {QueueType} from './queue'

export default class Worker {
  requestQueue: QueueType<NotificationRequestType>
  sender: Sender

  constructor ({requestQueue, ...options}: OptionsType) {
    if (requestQueue) {
      this.requestQueue = typeof requestQueue === 'string' ? new Queue(requestQueue) : requestQueue
      this.sender = new Sender({requestQueue, ...options})
    } else {
      throw new Error('Notif.me worker needs a queue to work.')
    }
  }

  run () {
    this.nextRequest()
  }

  nextRequest () {
    this.requestQueue.dequeue('notifme:request', async (request: NotificationRequestType) => {
      await this.sender.send(request)
      this.nextRequest()
    })
  }
}
