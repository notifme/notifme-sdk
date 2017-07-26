/* @flow */
import PushAdmProvider from './adm'
import PushApnProvider from './apn'
import PushFcmProvider from './fcm'
import PushLoggerProvider from './logger'
import PushWnsProvider from './wns'
// Types
import type {PushRequestType} from '../../model-request'

export interface PushProviderType {
  send(request: PushRequestType): Promise<string>
}

export default class PushProvider {
  id: string
  provider: PushProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'adm':
        this.provider = new PushAdmProvider('push', config)
        break
      case 'apn':
        this.provider = new PushApnProvider('push', config)
        break
      case 'fcm':
        this.provider = new PushFcmProvider('push', config)
        break
      case 'logger':
        this.provider = new PushLoggerProvider('push')
        break
      case 'wns':
        this.provider = new PushWnsProvider('push', config)
        break
      default:
        throw new Error(`Unknown push provider "${type}".`)
    }
    this.id = this.provider.id
  }

  send (request: PushRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
