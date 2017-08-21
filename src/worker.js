/* @flow */
import Queue from './queue'
import Sender from './sender'
// Types
import type {ProvidersType} from './providers'
import type {NotificationRequestType} from './index'
import type {QueueType} from './queue'

export default class Worker {
  requestQueue: QueueType<NotificationRequestType>
  sender: Sender

  constructor (channels: string[], providers: ProvidersType, strategies: any, requestQueue: any) {
    if (requestQueue) {
      this.requestQueue = typeof requestQueue === 'string' ? new Queue(requestQueue) : requestQueue
      this.sender = new Sender(channels, providers, strategies, requestQueue)
    } else {
      throw new Error('Notif.me worker needs a queue to work.')
    }
  }

  run () {
    this.requestQueue.dequeue('notifme:request', async (request: NotificationRequestType) => {
      await this.sender.send(request)
    })
  }
}
