/* @flow */
import fetch from 'node-fetch'
import qs from 'querystring'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class Sms46elksProvider {
  id: string
  credentials: Object

  constructor (config: Object) {
    this.id = 'sms-46elks-provider'
    this.credentials = {
      username: config.apiUsername,
      password: config.apiPassword
    }
  }

  async send (request: SmsRequestType): Promise<string> {
    const {username, password} = this.credentials
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64')
    const data = {
      from: request.from,
      to: request.to,
      message: (request: any).text
    }
    try {
      const response = await fetch('https://api.46elks.com/a1/sms', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + basicAuth
        },
        body: qs.stringify(data)
      })

      if (response.ok) {
        const responseBody = await response.json()
        return responseBody.id
      } else {
        throw new Error(await response.text())
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
