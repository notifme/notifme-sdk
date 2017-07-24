/* @flow */
import type {CallbackReturnType, CallbackType} from './index'

export default class InMemoryQueue<T> {
  jobs: {[type: string]: T[]} = {}
  consumers: {[type: string]: CallbackType<T>[]} = {}

  async enqueue (type: string, jobData: T): Promise<void> {
    if (this.consumers[type] !== undefined && this.consumers[type].length > 0) {
      const callback: CallbackType<T> = this.consumers[type].shift()
      process.nextTick((): CallbackReturnType => callback(jobData))
    } else {
      if (!this.jobs[type]) {
        this.jobs[type] = []
      }
      this.jobs[type].push(jobData)
    }
  }

  dequeue (type: string, callback: CallbackType<T>): void {
    if (this.jobs[type] !== undefined && this.jobs[type].length > 0) {
      const jobData: T = this.jobs[type].shift()
      process.nextTick((): CallbackReturnType => callback(jobData))
    } else {
      if (!this.consumers[type]) {
        this.consumers[type] = []
      }
      this.consumers[type].push(callback)
    }
  }
}
