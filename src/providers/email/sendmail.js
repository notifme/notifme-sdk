/* @flow */
import nodemailer from 'nodemailer'
// Types
import type {EmailRequestType} from '../../models/notification-request'

export default class EmailSendmailProvider {
  id: string = 'email-sendmail-provider'
  transporter: Object

  constructor (config: Object) {
    this.transporter = nodemailer.createTransport(config)
  }

  async send (request: EmailRequestType): Promise<string> {
    const result = await this.transporter.sendMail(request)
    return result.messageId
  }
}
