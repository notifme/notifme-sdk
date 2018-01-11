/* @flow */
import crypto from 'crypto'
import fetch from '../../util/request'
// Types
import type {EmailRequestType} from '../../models/notification-request'

export default class EmailSendGridProvider {
  id: string = 'email-sendgrid-provider'
  apiKey: string

  constructor (config: Object) {
    this.apiKey = config.apiKey
  }

  async send (request: EmailRequestType): Promise<string> {
    const {id, userId, from, fromName, replyTo, subject, html, text, headers, to, cc, bcc, attachments} = request
    const generatedId = id || crypto.randomBytes(16).toString('hex')
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{email: to}],
          ...(cc && cc.length > 0 ? {cc: cc.map((email) => ({email}))} : null),
          ...(bcc && bcc.length > 0 ? {bcc: bcc.map((email) => ({email}))} : null)
        }],
        from: {email: from, ...(fromName ? {name: fromName} : null)},
        ...(replyTo ? {reply_to: {email: replyTo}} : null),
        subject,
        content: [
          ...(text ? [{type: 'text/plain', value: text}] : []),
          ...(html ? [{type: 'text/html', value: html}] : [])
        ],
        headers,
        custom_args: {id: generatedId, userId},
        ...(attachments && attachments.length > 0 ? {
          attachments: attachments.map(({contentType, filename, content}) =>
            ({
              type: contentType,
              filename,
              content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
            }))
        } : null)
      })
    })

    if (response.ok) {
      return generatedId
    } else {
      const responseBody = await response.json()
      const [firstError] = responseBody.errors
      const message = Object.keys(firstError).map((key) => `${key}: ${firstError[key]}`).join(', ')
      throw new Error(`${response.status} - ${message}`)
    }
  }
}
