/* @flow */
import nodemailer from 'nodemailer'
import mandrillTransport from 'nodemailer-mandrill-transport'
// const mandrillTransport = require('nodemailer-mandrill-transport')
// Types
import type {EmailRequestType} from '../../models/notification-request'

export default class EmailSmtpProvider {
  id: string = 'email-mandrill-provider'
  transporter: Object

  constructor (config: Object | string) {
    this.transporter = nodemailer.createTransport(mandrillTransport(config))
  }

  async send (request: EmailRequestType): Promise<string> {
    const result = await this.transporter.sendMail(request)
    return result.messageId
  }
}
