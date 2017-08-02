/* @flow */
import Request from 'request-promise-native'
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
        // $FlowIgnore
        return this.sendTextSms(request.text, request)

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
    try {
      const result = await Request
        .post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages`)
        .auth(accountSid, authToken, false)
        .form({
          From: request.from,
          To: request.to,
          Body: text
        })
      return result.match(/<Sid>(.*)<\/Sid>/)[1]
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
