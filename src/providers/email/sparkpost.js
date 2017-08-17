/* @flow */
import SparkPost from 'sparkpost'
// types
import type {EmailRequestType} from '../../models/notification-request'

export default class EmailSparkPostProvider {
  id: string
  client: Object

  constructor (config: Object) {
    this.id='email-sparkpost-provider'
    this.client = new SparkPost(config.apiKey, {
      stackIdentity: 'notifme'
    })
  }

  send (request: EmailRequestType): Promise<string> {
    let txBody = {
      options: {
        transactional: true
      },
      content: {
        from: request.from,
        reply_to: request.replyTo,
        subject: request.subject,
        html: request.html,
        text: request.text,
        headers: request.headers
      },
      recipients: [
        {address: request.to}
      ],
      cc: request.cc,
      bcc: request.bcc
      //TODO: attachments
    };
    return this.client.transmissions.send(txBody)
      .then((data) => data.results.id)
  }
}
