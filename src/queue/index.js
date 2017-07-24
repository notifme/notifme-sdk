/* @flow */
import InMemoryQueue from './inMemory'

export type CallbackReturnType = void | Promise<void>
export type CallbackType<T> = (jobData: T) => CallbackReturnType

interface QueueType<T> {
  enqueue(type: string, jobData: T): Promise<void>;
  dequeue(type: string, callback: CallbackType<T>): void;
}

export default class Queue<T> {
  innerQueue: QueueType<T>

  constructor (type: string) {
    switch (type) {
      case 'in-memory':
      default:
        this.innerQueue = new InMemoryQueue()
        break
    }
  }

  async enqueue (type: string, jobData: T): Promise<void> {
    return this.innerQueue.enqueue(type, jobData)
  }

  dequeue (type: string, callback: CallbackType<T>): void {
    this.innerQueue.dequeue(type, callback)
  }
}
