/* @flow */
const NotifmeSdk = require('../src').default // notifme-sdk

const notifmeSdk = new NotifmeSdk({})

const notificationRequest = {
  email: {
    from: 'from@example.com',
    to: 'to@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>',
    replyTo: 'replyto@example.com',
    text: 'Hello John! How are you?',
    headers: {'My-Custom-Header': 'my-value'},
    cc: ['cc1@example.com', 'cc2@example.com'],
    bcc: ['bcc@example.com'],
    attachments: [{
      contentType: 'text/plain',
      filename: 'test.txt',
      content: 'hello!'
    }]
  }
}

notifmeSdk.send(notificationRequest).then(console.log)
