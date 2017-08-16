/* @flow */
import fetch from 'node-fetch'
import FormData from 'form-data'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsTwilioProvider {
  id: string
  credentials: Object

  constructor (config: Object) {
    this.id = 'sms-twilio-provider'
    this.credentials = {accountSid: config.accountSid, authToken: config.authToken}
  }

  async send (request: SmsRequestType): Promise<string> {
    switch (request.type) {
      case 'text':
      case 'unicode':
      case undefined:
        return this.sendTextSms((request: any).text, request)

      case 'binary':
      case 'wappush':
      case 'vcal':
      case 'vcard':
      default:
        throw new Error(`[Twilio] Unsupported type: ${request.type ? request.type : ''}}`)
    }
  }

  async sendTextSms (text: string, request: SmsRequestType): Promise<string> {
    const {accountSid, authToken} = this.credentials
    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
    try {
      const form = new FormData()
      form.append('From', request.from)
      form.append('To', request.to)
      form.append('Body', (request: any).text)
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + basicAuth
        },
        body: form
      })

      const responseBody = await response.json()

      if (response.ok) {
        return responseBody.sid
      } else {
        throw new Error(`${response.status} - ${responseBody.message}`)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
