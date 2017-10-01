/* @flow */
import SlackWebhook from 'slack-webhook'
// Types
import type {SlackRequestType} from '../../models/notification-request'

export default class SlackProvider {
  id: string = 'slack-provider'
  slack: SlackWebhook

  constructor (config: Object) {
    this.slack = new SlackWebhook(config.webhookUrl)
  }

  async send (request: SlackRequestType): Promise<string> {
    try {
      return await this.slack.send(request.text)
    } catch (e) {
      throw new Error(e)
    }
  }
}
