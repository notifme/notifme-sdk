/* @flow */
import nodemailer from 'nodemailer'
// Types
import type {EmailRequestType} from '../../model-request'

export default class EmailSmtpProvider {
  name: string
  transporter: Object

  constructor (config: Object) {
    this.name = 'email-smtp-provider'
    this.transporter = nodemailer.createTransport(config)
  }

  async send (request: EmailRequestType): Promise<string> {
    const result = await this.transporter.sendMail(request)
    return result.messageId
  }
}
