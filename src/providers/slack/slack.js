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
    const webhookUrl = request.webhookUrl || this.webhookUrl

    delete request.webhookUrl
    const body = JSON.stringify(request)
    const apiRequest = {
      method: 'POST',
      body
    }

    const response = await fetch(webhookUrl, apiRequest)

    if (response.ok) {
      return '' // Slack only returns 'ok'
    } else {
      const responseText = await response.text()
      throw new Error(`${response.status} - ${responseText}`)
    }
  }
}
