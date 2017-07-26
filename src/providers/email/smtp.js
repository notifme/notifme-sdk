/* @flow */
import nodemailer from 'nodemailer'
// Types
import type {EmailRequestType} from '../../models/notification-request'

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
