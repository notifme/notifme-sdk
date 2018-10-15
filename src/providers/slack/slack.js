/* @flow */
import fetch from '../../util/request'
// Types
import type { SlackRequestType } from '../../models/notification-request'

export default class SlackProvider {
  id: string = 'slack-provider'
  webhookUrl: string

  constructor (config: Object) {
    this.webhookUrl = config.webhookUrl
  }

  async send ({ webhookUrl, ...request }: SlackRequestType): Promise<string> {
    const apiRequest = {
      method: 'POST',
      body: JSON.stringify(request)
    }
    const response = await fetch(webhookUrl || this.webhookUrl, apiRequest)

    if (response.ok) {
      return '' // Slack API only returns 'ok'
    } else {
      const responseText = await response.text()
      throw new Error(`${response.status} - ${responseText}`)
    }
  }
}
