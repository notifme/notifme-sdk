/* @flow */
import WebpushGcmProvider from './gcm'
import WebpushLoggerProvider from './logger'
import WebpushNotificationCatcherProvider from './notificationCatcher'
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
        this.provider = new WebpushGcmProvider(config)
        break
      case 'notificationcatcher':
        this.provider = new WebpushNotificationCatcherProvider('webpush')
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
