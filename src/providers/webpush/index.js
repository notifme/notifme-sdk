/* @flow */
import WebpushLoggerProvider from './logger'
// Types
import type {WebpushRequestType} from '../../model-request'

export interface WebpushProviderType {
  send(request: WebpushRequestType): Promise<boolean>
}

export default class WebpushProvider {
  name: string
  provider: WebpushProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'logger':
        this.provider = new WebpushLoggerProvider('webpush')
        break
      default:
        throw new Error(`Unknown webpush provider "${type}".`)
    }
    this.name = this.provider.name
  }

  send (request: WebpushRequestType): Promise<boolean> {
    return this.provider.send(request)
  }
}
