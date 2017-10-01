/* @flow */
import SlackWebhook from 'slack-webhook'
// Types
import type {SlackRequestType} from '../../models/notification-request'

export default class SlackProvider {
  id: string = 'slack-provider'

  async send (request: SlackRequestType): Promise<string> {
    const slack = new SlackWebhook(request.webhookUrl);
    try {
      return await slack.send(request.text)
    } catch (e) {
      throw new Error(e)
    }
  }
}
