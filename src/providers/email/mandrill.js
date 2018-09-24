/* @flow */
import crypto from 'crypto'
import fetch from '../../util/request'
// types
import type {EmailRequestType} from '../../models/notification-request'

export default class EmailMandrillProvider {
  id: string = 'email-mandrill-provider'
  apiKey: string

  constructor (config: Object) {
    this.apiKey = config.apiKey
  }

  async send (request: EmailRequestType): Promise<string> {
    const {id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments} = request
    const generatedId = id || crypto.randomBytes(16).toString('hex')
    const response = await fetch(`https://mandrillapp.com/api/1.0/messages/send.json`, {
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
            ...(cc && cc.length ? cc.map(recipient => { return { email: recipient, type: 'cc' } }) : {}),
            ...(bcc && bcc.length ? bcc.map(recipient => { return { email: recipient, type: 'bcc' } }) : {}),
          ],
          subject,
          text,
          html,
          headers: {
            ...(replyTo ? { "Reply-To": replyTo } : null),
            ...headers
          },
          ...(attachments && attachments.length ? {
            attachments: attachments.map(({ contentType, filename, content }) => {
              return { type: contentType, name: filename, content: content }
            })
          } : null),
          metadata: {
            id,
            userId
          }
        },
        async: false,
      })
    })

    const responseBody = await response.json()
    if (response.ok) {
      return generatedId
    } else {
      throw new Error(`${response.status} - ${responseBody.message}`)
    }
  }
}
