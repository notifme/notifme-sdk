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

  async send(request: WhatsappRequestType): Promise<string> {
    const { from, to, content, messageId, mediaType, callbackData, notifyUrl } = request.customize ? (await request.customize(this.id, request)) : request

    // Construct the payload
    const payload = {
      from: from.replace('+', ''),
      to: to.replace('+', ''),
      messageId,
      callbackData,
      notifyUrl,
      content,
    }

    const response = await fetch(`${this.baseUrl}/whatsapp/1/message/${mediaType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${this.apiKey}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({ messages: [payload] })  // Ensure the payload is correctly wrapped
    })

    const responseBody = await response.json()
    if (response.ok) {
      // Handle the potential array or single object response
      const messages = Array.isArray(responseBody.messages) ? responseBody.messages : [responseBody];
      const message = messages[0]
      if (['PENDING', 'DELIVERED'].includes(message.status.groupName)) {
        return message.messageId
      } else {
        const error = message.status
        throw new Error(Object.keys(error).map((key) => `${key}: ${error[key]}`).join(', '))
      }
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
