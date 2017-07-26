/* @flow */
import nodemailer from 'nodemailer'
// Types
import type {EmailRequestType} from '../../model-request'

export default class EmailSmtpProvider {
  id: string
  transporter: Object

  constructor (config: Object) {
    this.id = 'email-smtp-provider'
    this.transporter = nodemailer.createTransport(config)
  }

  async send (request: EmailRequestType): Promise<string> {
    const result = await this.transporter.sendMail(request)
    return result.messageId
  }
}
