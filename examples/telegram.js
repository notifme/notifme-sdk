/* @flow */
const NotifmeSdk = require('../src').default // notifme-sdk

const notifmeSdk = new NotifmeSdk({
  channels: {
    telegram: {
      providers: [{
        type: 'webhook',
        botToken: 'bot_token',
        baseUrl: 'base_url'
      }]
    }
  }
})

const notificationRequest = {
  telegram: {
    chatId: 'chatId',
    message: 'message'
  }
}

notifmeSdk.send(notificationRequest).then(console.log)
