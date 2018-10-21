/* @flow */
import fetch from '../../util/request'
// types
import type { EmailRequestType } from '../../models/notification-request'

export default class EmailMandrillProvider {
  id: string = 'email-mandrill-provider'
  apiKey: string

  constructor (config: Object) {
    this.apiKey = config.apiKey
  }

  async send (request: EmailRequestType): Promise<string> {
    const { id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments } = request
    const response = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
      method: 'POST',
      headers: {
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: this.apiKey,
        message: {
          from_email: from,
          to: [
            { email: to, type: 'to' },
            ...(cc && cc.length ? cc.map(email => ({ email, type: 'cc' })) : []),
            ...(bcc && bcc.length ? bcc.map(email => ({ email, type: 'bcc' })) : [])
          ],
          subject,
          text,
          html,
          headers: {
            ...(replyTo ? { 'Reply-To': replyTo } : null),
            ...headers
          },
          ...(attachments && attachments.length ? {
            attachments: attachments.map(({ contentType, filename, content }) => {
              return {
                type: contentType,
                name: filename,
                content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
              }
            })
          } : null),
          metadata: {
            id,
            userId
          }
        },
        async: false
      })
    })

    const responseBody = await response.json()
    if (response.ok && responseBody.length > 0) {
      return responseBody[0]._id
    } else {
      const message = Object.keys(responseBody).map((key) => `${key}: ${responseBody[key]}`).join(', ')
      throw new Error(`${response.status} - ${message}`)
    }
  }
}
