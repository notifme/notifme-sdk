/* @flow */
import type {CallbackReturnType, CallbackType} from './index'

export default class InMemoryQueue<T> {
  jobs: {[type: string]: T[]} = {}
  consumers: {[type: string]: CallbackType<T>[]} = {}

  async enqueue (type: string, jobData: T): Promise<void> {
    if (!this.jobs[type]) {
      this.jobs[type] = []
    }
    this.jobs[type].push(jobData)
    this.notifyAllConsumers(type)
  }

  dequeue (type: string, callback: CallbackType<T>): void {
    if (!this.consumers[type]) {
      this.consumers[type] = []
    }
    this.consumers[type].push(callback)
    this.notifyAllConsumers(type)
  }

  notifyAllConsumers (type: string): void {
    if (this.consumers[type] !== undefined && this.consumers[type].length > 0) {
      if (this.jobs[type] !== undefined && this.jobs[type].length > 0) {
        const jobData: T = this.jobs[type].shift()
        this.consumers[type].forEach((callback) => {
          process.nextTick((): CallbackReturnType => callback(jobData))
        })
      }
    }
  }
}
