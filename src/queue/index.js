/* @flow */
import Registry from '../util/registry'
import InMemoryQueue from './inMemory'

export type CallbackReturnType = void | Promise<void>
export type CallbackType<T> = (jobData: T) => CallbackReturnType

export interface QueueType<T> {
  enqueue(type: string, jobData: T): Promise<void>;
  dequeue(type: string, callback: CallbackType<T>): void;
}

export default class Queue<T> {
  innerQueue: QueueType<T>

  constructor (type: string) {
    switch (type) {
      case 'in-memory':
        this.innerQueue = Registry.getInstance(`queue:${type}`, () => new InMemoryQueue())
        break
      default:
        throw new Error(`Unknown queue provider "${type}".`)
    }
  }

  async enqueue (type: string, jobData: T): Promise<void> {
    return this.innerQueue.enqueue(type, jobData)
  }

  dequeue (type: string, callback: CallbackType<T>): void {
    this.innerQueue.dequeue(type, callback)
  }
}
