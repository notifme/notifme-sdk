/* @flow */

class Registry {
  map: {[key: string]: any} = {}

  getInstance<T> (key: string, getValueIfUndefined: () => T): T {
    if (!this.map[key]) {
      this.map[key] = getValueIfUndefined()
    }
    return this.map[key]
  }
}

export default new Registry()
