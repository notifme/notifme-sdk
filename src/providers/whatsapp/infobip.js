/* @flow */
import fetch from '../../util/request'
// Types
import type { WhatsappRequestType } from '../../models/notification-request'

export default class WhatsappInfobipProvider {
  id: string = 'whatsapp-infobip-provider'
  baseUrl: string
  apiKey: string

  constructor ({ baseUrl, apiKey }: Object) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async send (request: WhatsappRequestType): Promise<string> {
    const { from, to, type, messageId, text, mediaUrl, templateName, templateData, ...rest } = request.customize ? (await request.customize(this.id, request)) : request

    // Construct the payload
    const payload = {
      from: (from || '').replace('+', ''),
      to: (to || '').replace('+', ''),
      messageId,
      content: {
        text,
        mediaUrl,
        templateName,
        templateData
      },
      ...rest
    }

    const response = await fetch(`${this.baseUrl}/whatsapp/1/message/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${this.apiKey}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify(type === 'template' ? [payload] : payload)
    })

    const responseBody = await response.json()
    if (response.ok) {
      // Handle the potential array or single object response
      const [message] = Array.isArray(responseBody.messages) ? responseBody.messages : [responseBody]
      return message.messageId
    } else {
      if (responseBody.requestError && responseBody.requestError.serviceException) {
        const error = responseBody.requestError.serviceException
        const message = Object.keys(error).map((key) => `${key}: ${error[key]}`).join(', ')
        throw new Error(message)
      } else {
        throw new Error(JSON.stringify(responseBody))
      }
    }
  }
}
