/* @flow */
import fetch from '../../util/request'
import crypto from 'crypto'
// Types
import type { TelegramRequestType } from '../../models/notification-request'

export default class TelegramProvider {
  id: string = 'telegram-provider'
  bot_token: string
  base_url: string

  constructor(config: Object) {
    this.base_url = config.base_url
    this.bot_token = config.bot_token
  }

  async send(request: TelegramRequestType): Promise<string> {
    const { chat_id, message, parse_mode, ...rest } = request.customize ? (await request.customize(this.id, request)) : request
    const apiRequest = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        chat_id,
        text: message,
        parse_mode: parse_mode || 'html'
      })
    }
    const response = await fetch(`${this.base_url}/${this.bot_token}/sendMessage`, apiRequest)

    if (response.ok) {
      try {
        let result = await response.json()
        return result.result.message_id // Telegram API only returns 'ok'
      } catch (error) {
        return crypto.randomBytes(16).toString('hex')
      }
    } else {
      const responseText = await response.text()
      throw new Error(`${response.status} - ${responseText}`)
    }
  }
}
