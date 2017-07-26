/* @flow */
import NotifmeSdk from '../src'
// Types
import type {NotificationRequestType} from '../src'

const notifmeSdk = new NotifmeSdk({})

const notificationRequest: NotificationRequestType = {
  email: {
    from: 'me@example.com',
    to: 'you@example.com',
    subject: 'Hi',
    text: '...'
  },
  push: {
    title: 'Hi',
    body: '...'
  },
  sms: {
    from: 'Notif.me',
    to: '+10000000000',
    text: '...'
  },
  webpush: {
    title: 'Hi',
    body: '...'
  }
}
notifmeSdk.send(notificationRequest).then(console.log)
