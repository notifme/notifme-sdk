/* @flow */
import fetch from '../../util/request'
import FormData from 'form-data'
// Types
import type {VoiceRequestType} from '../../models/notification-request'

export default class VoiceTwilioProvider {
  id: string = 'voice-twilio-provider'
  accountSid: string
  apiKey: string

  constructor ({accountSid, authToken}: Object) {
    this.accountSid = accountSid
    this.apiKey = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  }

  async send (request: VoiceRequestType): Promise<string> {
    const {
      from,
      to,
      url,
      method,
      fallbackUrl,
      fallbackMethod,
      statusCallback,
      statusCallbackEvent,
      sendDigits,
      machineDetection,
      machineDetectionTimeout,
      timeout
    } = request
    const form = new FormData()
    form.append('From', from)
    form.append('To', to)
    form.append('Url', url)
    if (method) form.append('Method', method)
    if (fallbackUrl) form.append('FallbackUrl', fallbackUrl)
    if (fallbackMethod) form.append('FallbackMethod', fallbackMethod)
    if (statusCallback) form.append('StatusCallback', statusCallback)
    if (statusCallbackEvent) {
      statusCallbackEvent.forEach((event) => form.append('StatusCallbackEvent', event))
    }
    if (sendDigits) form.append('SendDigits', sendDigits)
    if (machineDetection) form.append('MachineDetection', machineDetection)
    if (machineDetectionTimeout) form.append('MachineDetectionTimeout', machineDetectionTimeout)
    if (timeout) form.append('Timeout', timeout)

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.apiKey}`,
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
