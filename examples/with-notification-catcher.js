/* @flow */
import NotifmeSdk from '../src'
// Types
import type {NotificationRequestType} from '../src'

/*
 * Note: Notification catcher must be running locally.
 * Run `yarn add --dev notification-catcher && yarn run notification-catcher`
 */

const notifmeSdk = new NotifmeSdk({
  useNotificationCatcher: true
})

const notificationRequest: NotificationRequestType = {
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

const run = async () => {
  console.log(await notifmeSdk.send(notificationRequest))
}
run()
