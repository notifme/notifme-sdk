/* @flow */
const NotifmeSdk = require('../src').default // notifme-sdk

const notifmeSdk = new NotifmeSdk({
  channels: {
    slack: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})

const notificationRequest = {
  metadata: {
    id: '24'
  },
  slack: {
    text: 'Test Slack webhook :)'
  }
}

notifmeSdk.send(notificationRequest).then(console.log)
