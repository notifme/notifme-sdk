/* @flow */
import fetch from 'node-fetch'
// types
import type {EmailRequestType} from '../../models/notification-request'

export default class EmailSparkPostProvider {
  id: string = 'email-sparkpost-provider'
  apiKey: string

  constructor (config: Object) {
    this.apiKey = config.apiKey
  }

  async send (request: EmailRequestType): Promise<string> {
    const {id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments} = request
    const response = await fetch('https://api.sparkpost.com/api/v1/transmissions', {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        options: {
          transactional: true
        },
        content: {
          from,
          reply_to: replyTo,
          subject,
          html,
          text,
          headers: {
            ...headers,
            ...(cc && cc.length > 0 ? {CC: cc.join(',')} : null)
          },
          attachments: (attachments || []).map(({contentType, filename, content}) =>
            ({
              type: contentType,
              name: filename,
              data: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
            }))
        },
        recipients: [
          {address: {email: to}},
          ...(cc || []).map((email) => ({address: {email, header_to: to}})),
          ...(bcc || []).map((email) => ({address: {email, header_to: to}}))
        ],
        metadata: {id, userId}
      })
    })

    const responseBody = await response.json()
    if (response.ok) {
      return responseBody.results.id
    } else {
      const [firstError] = responseBody.errors
      const message = Object.keys(firstError).map((key) => `${key}: ${firstError[key]}`).join(', ')
      throw new Error(`${response.status} - ${message}`)
    }
  }
}
