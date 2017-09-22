/* @flow */
import fetch from 'node-fetch'
import crypto from 'crypto'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsOvhProvider {
  id: string = 'sms-ovh-provider'
  credentials: Object

  constructor ({appKey, appSecret, consumerKey, account, host}: Object) {
    this.credentials = {appKey, appSecret, consumerKey, account, host}
  }

  signRequest (httpMethod: string, url: string, body: string, timestamp: number) {
    const {appSecret, consumerKey} = this.credentials
    const signature = [appSecret, consumerKey, httpMethod, url, body, timestamp]
    return '$1$' + crypto.createHash('sha1').update(signature.join('+')).digest('hex')
  }

  /*
   * Note: read this tutorial to create credentials on Ovh.com:
   * https://www.ovh.com/fr/g1639.envoyer_des_sms_avec_lapi_ovh_en_php
   */
  async send (request: SmsRequestType): Promise<string> {
    const {appKey, consumerKey, account, host} = this.credentials
    const timestamp = Math.round(Date.now() / 1000)

    // Documentation: https://api.ovh.com/console/#/sms/%7BserviceName%7D/jobs#POST
    const {from, to, text, type, ttl, messageClass} = request

    const body = JSON.stringify({
      sender: from,
      message: text,
      receivers: [to],
      charset: 'UTF-8',
      class: messageClass === 0 ? 'flash'
        : (messageClass === 1 ? 'phoneDisplay'
        : (messageClass === 2 ? 'sim'
        : (messageClass === 3 ? 'toolkit'
        : null))),
      noStopClause: type === 'transactional',
      validityPeriod: ttl
    })

    // Escape unicode
    const reqBody = body.replace(/[\u0080-\uFFFF]/g, (m) => {
      return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4)
    })

    const url = `https://${host}/1.0/sms/${account}/jobs/`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Ovh-Timestamp': timestamp,
        'X-Ovh-Signature': this.signRequest('POST', url, reqBody, timestamp),
        'X-Ovh-Consumer': consumerKey,
        'X-Ovh-Application': appKey,
        'Content-Length': reqBody.length,
        'Content-Type': 'application/json charset=utf-8',
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body
    })

    const responseBody = await response.json()
    if (response.ok) {
      return responseBody.ids[0]
    } else {
      throw new Error(`${response.status} - ${responseBody.message}`)
    }
  }
}
