/* @flow */
import PushLoggerProvider from './logger'
// Types
import type {PushRequestType} from '../../model-request'

export interface PushProviderType {
  send(request: PushRequestType): Promise<boolean>
}

export default class PushProvider {
  name: string
  provider: PushProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'logger':
        this.provider = new PushLoggerProvider('push')
        break
      default:
        throw new Error(`Unknown push provider "${type}".`)
    }
    this.name = this.provider.name
  }

  send (request: PushRequestType): Promise<boolean> {
    return this.provider.send(request)
  }
}
