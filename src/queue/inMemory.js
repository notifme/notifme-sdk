/* @flow */
import type {CallbackReturnType, CallbackType, JobDataType} from './index'

  jobs: {[type: string]: JobDataType[]} = {}
  consumers: {[type: string]: CallbackType[]} = {}
export default class InMemoryQueue<T> {

  enqueue (type: string, jobData: JobDataType): void {
    if (this.consumers[type] !== undefined && this.consumers[type].length > 0) {
      const callback: CallbackType = this.consumers[type].shift()
      process.nextTick((): CallbackReturnType => callback(jobData))
    } else {
      if (!this.jobs[type]) {
        this.jobs[type] = []
      }
      this.jobs[type].push(jobData)
    }
  }

  dequeue (type: string, callback: CallbackType): void {
    if (this.jobs[type] !== undefined && this.jobs[type].length > 0) {
      const jobData: JobDataType = this.jobs[type].shift()
      process.nextTick((): CallbackReturnType => callback(jobData))
    } else {
      if (!this.consumers[type]) {
        this.consumers[type] = []
      }
      this.consumers[type].push(callback)
    }
  }
}
