/* @flow */
import WebpushGcmProvider from './gcm'
import WebpushLoggerProvider from './logger'
// Types
import type {WebpushRequestType} from '../../models/notification-request'

export interface WebpushProviderType {
  send(request: WebpushRequestType): Promise<string>
}

export default class WebpushProvider {
  id: string
  provider: WebpushProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'gcm':
        this.provider = new WebpushGcmProvider(config, 'webpush')
        break
      case 'logger':
        this.provider = new WebpushLoggerProvider(config, 'webpush')
        break
      default:
        throw new Error(`Unknown webpush provider "${type}".`)
    }
    this.id = this.provider.id
  }

  send (request: WebpushRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
