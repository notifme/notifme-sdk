/* @flow */
const NotifmeSdk = require('../src').default // notifme-sdk

const notifmeSdk = new NotifmeSdk({})

const notificationRequest = {
  metadata: {
    id: '24'
  },
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  },
  sms: {
    from: '+15000000000',
    to: '+15000000001',
    text: 'Hello John! How are you?'
  },
  push: {
    registrationToken: 'xxxxx',
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  },
  webpush: {
    subscription: {
      keys: {
        auth: 'xxxxx',
        p256dh: 'xxxxx'
      },
      endpoint: 'xxxxx'
    },
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  }
}

notifmeSdk.send(notificationRequest).then(console.log)
