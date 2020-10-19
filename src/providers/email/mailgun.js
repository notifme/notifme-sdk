/* @flow */
import fetch from '../../util/request'
import FormData from 'form-data'
// types
import type { EmailRequestType } from '../../models/notification-request'

export default class EmailMailgunProvider {
  id: string = 'email-mailgun-provider'
  apiKeyBase64: string
  domainName: string
  apiBasePath: string

  constructor (config: Object) {
    this.apiKeyBase64 = Buffer.from(`api:${config.apiKey}`).toString('base64')
    this.domainName = config.domainName
    this.apiBasePath = config?.apiBasePath ?? 'https://api.mailgun.net/v3';
  }

  async send (request: EmailRequestType): Promise<string> {
    const { id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments } =
      request.customize ? (await request.customize(this.id, request)) : request
    const form = new FormData()
    form.append('from', from)
    form.append('to', to)
    form.append('subject', subject)
    if (text) form.append('text', text)
    if (html) form.append('html', html)
    if (replyTo) form.append('h:Reply-To', replyTo)
    if (cc && cc.length > 0) cc.forEach((email) => form.append('cc', email))
    if (bcc && bcc.length > 0) bcc.forEach((email) => form.append('bcc', email))
    if (attachments && attachments.length > 0) {
      attachments.forEach(({ contentType, filename, content }) => {
        form.append('attachment', content, { filename, contentType })
      })
    }
    if (headers) Object.keys(headers).forEach((header) => form.append(`h:${header}`, headers[header]))
    if (id) form.append('v:Notification-Id', id)
    if (userId) form.append('v:User-Id', userId)

    const response = await fetch(`${this.apiBasePath}/${this.domainName}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.apiKeyBase64}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: form
    })

    const responseBody = await response.json()
    if (response.ok) {
      return responseBody.id
    } else {
      throw new Error(`${response.status} - ${responseBody.message}`)
    }
  }
}
