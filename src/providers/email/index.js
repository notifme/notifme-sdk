/* @flow */
import EmailLoggerProvider from './logger'
import EmailSmtpProvider from './smtp'
// Types
import type {EmailRequestType} from '../../model-request'

export interface EmailProviderType {
  send(request: EmailRequestType): Promise<boolean>
}

export default class EmailProvider {
  name: string
  provider: EmailProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'logger':
        this.provider = new EmailLoggerProvider('email')
        break
      case 'smtp':
        this.provider = new EmailSmtpProvider(config)
        break
      default:
        throw new Error(`Unknown email provider "${type}".`)
    }
    this.name = this.provider.name
  }

  send (request: EmailRequestType): Promise<boolean> {
    return this.provider.send(request)
  }
}
