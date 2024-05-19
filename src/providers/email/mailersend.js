/* @flow */
import crypto from 'crypto'
import fetch from '../../util/request'
// Types
import type { EmailRequestType } from '../../models/notification-request'

export default class EmailMailerSendProvider {
  id: string = 'email-mailersend-provider'
  apiKey: string

  constructor (config: Object) {
    this.apiKey = config.apiKey
  }

  async send (request: EmailRequestType): Promise<string> {
    const { id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments } =
      request.customize ? (await request.customize(this.id, request)) : request
    const generatedId = id || crypto.randomBytes(16).toString('hex')
    const parsedFrom = this.parseEmailString(from)
    const parsedTo = this.parseEmailString(to)

    const data = {
      from: {
        email: parsedFrom.email,
        name: parsedFrom.name
      },
      to: [{
        email: parsedTo.email,
        name: parsedTo.name
      }],
      subject,
      html,
      text,
      reply_to: replyTo ? [{ email: replyTo }] : undefined,
      cc: cc && cc.length ? cc.map(email => this.parseEmailString(email)) : undefined,
      bcc: bcc && bcc.length ? bcc.map(email => this.parseEmailString(email)) : undefined,
      attachments: attachments && attachments.length > 0 ? attachments.map(({ contentType, filename, content }) => ({
        type: contentType,
        filename,
        content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
      })) : undefined,
      headers,
      custom_args: { id: generatedId, userId }
    };

    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const responseHeaders = response.headers;
      const messageId = responseHeaders.get('x-message-id');
      if (!messageId) {
        throw new Error('Failed to send email: No ID returned in response.');
      }
      return messageId;
    } else {
      const responseBody = await response.json()
      const [firstError] = responseBody.errors
      const message = Object.keys(firstError).map((key) => `${key}: ${firstError[key]}`).join(', ')
      throw new Error(`${response.status} - ${message}`)
    }
  }

  parseEmailString(emailString: string): { name: string, email: string } {
    const match = emailString.match(/^(.*?)(?:\s*<(.+?)>)?$/)
    return {
      name: match[1] ? match[1].trim() : '',
      email: match[2] ? match[2].trim() : emailString.trim()
    }
  }
}
