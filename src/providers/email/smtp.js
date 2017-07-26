/* @flow */
// Types
import type {EmailRequestType} from '../../model-request'

export default class EmailSmtpProvider {
  name: string

  constructor (config: Object) {
    this.name = 'email-smtp-provider'
  }

  async send (request: EmailRequestType): Promise<boolean> {
    // TODO: implement SMTP
    return true
  }
}
