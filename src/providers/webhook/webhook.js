/* @flow */
import fetch from '../../util/request'
// Types
import type {WebhookRequestType} from '../../models/notification-request'

export default class WebhookProvider {
  id: string = 'webhook-provider'

  async send ({url, ...request}: WebhookRequestType): Promise<string> {
    const apiRequest = {
      method: 'POST',
      body: JSON.stringify({
        event: request.event,
        data: request.data
      })
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
