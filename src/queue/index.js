/* @flow */
import InMemoryQueue from './inMemory'

export type CallbackReturnType = void | Promise<void>
export type CallbackType = (jobData: Object) => CallbackReturnType
export type JobDataType = Object

interface QueueType {
  enqueue(type: string, jobData: JobDataType): void;
  dequeue(type: string, callback: CallbackType): void;
}

  innerQueue: QueueType
export default class Queue<T> {

  constructor (type: string) {
    switch (type) {
      case 'in-memory':
      default:
        this.innerQueue = InMemoryQueue
        break
    }
  }

  enqueue (type: string, jobData: JobDataType): void {
    this.innerQueue.enqueue(type, jobData)
  }

  dequeue (type: string, callback: CallbackType): void {
    this.innerQueue.dequeue(type, callback)
  }
}
