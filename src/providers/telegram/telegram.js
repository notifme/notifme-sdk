/* @flow */
import fetch from '../../util/request'
import crypto from 'crypto'
// Types
import type { TelegramRequestType } from '../../models/notification-request'

export default class TelegramProvider {
  id: string = 'telegram-provider'
  botToken: string
  baseUrl: string

  constructor (config: Object) {
    this.baseUrl = config.baseUrl || 'https://api.telegram.org'
    this.botToken = config.botToken
  }

  async send (request: TelegramRequestType): Promise<string> {
    const { chatId, message, parseMode } = request.customize ? (await request.customize(this.id, request)) : request
    const apiRequest = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        chatId,
        text: message,
        parseMode: parseMode || 'html'
      })
    }
    const response = await fetch(`${this.baseUrl}/${this.botToken}/sendMessage`, apiRequest)

    if (response.ok) {
      try {
        const result = await response.json()
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
