/* @flow */
import crypto from 'crypto'
import fetch from '../../util/request'
import { parseEmailString } from '../../util/parseEmailString'
// Types
import type { EmailRequestType } from '../../models/notification-request'

export default class EmailMailerSendProvider {
  id: string = 'email-mailersend-provider';
  apiKey: string;

  constructor (config: { apiKey: string }) {
    this.apiKey = config.apiKey
  }

  async send(request: EmailRequestType): Promise<string> {
    const {
      id,
      userId,
      from,
      replyTo,
      subject,
      html,
      text,
      headers,
      to,
      cc,
      bcc,
      attachments,
      messageId // New field for overriding the message ID
    } = request.customize ? (await request.customize(this.id, request)) : request;

    const generatedId = id || crypto.randomBytes(16).toString('hex');
    const parsedFrom = parseEmailString(from);
    const parsedTo = parseEmailString(to);

    const data = {
      from: {
        email: parsedFrom.email,
        ...(parsedFrom.name ? { name: parsedFrom.name } : {})
      },
      to: [{
        email: parsedTo.email,
        ...(parsedTo.name ? { name: parsedTo.name } : {})
      }],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: { email: replyTo } } : {}),
      ...(cc && cc.length ? {
        cc: cc.map(email => {
          const parsed = parseEmailString(email);
          return { email: parsed.email, ...(parsed.name ? { name: parsed.name } : {}) };
        })
      } : {}),
      ...(bcc && bcc.length ? {
        bcc: bcc.map(email => {
          const parsed = parseEmailString(email);
          return { email: parsed.email, ...(parsed.name ? { name: parsed.name } : {}) };
        })
      } : {}),
      ...(attachments && attachments.length ? {
        attachments: attachments.map(({ contentType, filename, content }) => ({
          type: contentType,
          filename,
          content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
        }))
      } : {}),
      headers,
      custom_args: { id: generatedId, userId },
      ...(messageId ? { message_id: messageId } : {}) // Include message_id if provided
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
      const responseBody = await response.json();
      const firstError = Array.isArray(responseBody.errors) ? responseBody.errors[0] : null;
      if (firstError) {
        const message = Object.keys(firstError).map((key) => `${key}: ${firstError[key]}`).join(', ');
        throw new Error(`${response.status} - ${message}`);
      } else {
        throw new Error(`${response.status} - Unknown error`);
      }
    }
  }
}
