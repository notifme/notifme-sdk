/* @flow */
import fetch from '../../util/request'
// Types
import type {SlackRequestType} from '../../models/notification-request'

export default class SlackProvider {
  id: string = 'slack-provider'
  webhookUrl: string

  constructor (config: Object) {
    this.webhookUrl = config.webhookUrl
  }

  async send (request: SlackRequestType): Promise<string> {
    const body = JSON.stringify({
      text: request.text
    })
    const apiRequest = {
      method: 'POST',
      body
    }

    const response = await fetch(this.webhookUrl, apiRequest)

    const responseText = await response.text()
    if (response.ok) {
      return '' // Slack only returns 'ok'
    } else {
      throw new Error(`${response.status} - ${responseText}`)
    }
  }
}
