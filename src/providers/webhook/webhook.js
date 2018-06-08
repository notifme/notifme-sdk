/* @flow */
import fetch from '../../util/request'
// Types
import type {WebhookRequestType} from '../../models/notification-request'

export default class WebhookProvider {
  id: string = 'webhook-provider'

  async send ({ url, event, data }: WebhookRequestType): Promise<string> {
    const apiRequest = {
      method: 'POST',
      body: JSON.stringify({
        event, data
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(url, apiRequest)

    if (response.ok) {
      return ''
    } else {
      const responseText = await response.text()
      throw new Error(`${response.status} - ${responseText}`)
    }
  }
}
