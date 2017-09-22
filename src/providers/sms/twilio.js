/* @flow */
import fetch from 'node-fetch'
import FormData from 'form-data'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsTwilioProvider {
  id: string = 'sms-twilio-provider'
  credentials: Object

  constructor (config: Object) {
    this.credentials = {accountSid: config.accountSid, authToken: config.authToken}
  }

  /*
   * Note: 'type', 'nature', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {accountSid, authToken} = this.credentials
    const {from, to, text, ttl} = request
    const form = new FormData()
    form.append('From', from)
    form.append('To', to)
    form.append('Body', text)
    if (ttl) form.append('ValidityPeriod', ttl)
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: form
    })

    const responseBody = await response.json()
    if (response.ok) {
      return responseBody.sid
    } else {
      throw new Error(`${response.status} - ${responseBody.message}`)
    }
  }
}
