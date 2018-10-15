/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import webpush from 'web-push'

jest.mock('web-push')
jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))
webpush.sendNotification.mockReturnValue({ headers: { location: 'returned-id' } })

const request = {
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

test('GCM with API key.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      webpush: {
        providers: [{
          type: 'gcm',
          gcmAPIKey: 'xxxxx'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(webpush.setGCMAPIKey).lastCalledWith('xxxxx')
  expect(webpush.sendNotification).lastCalledWith(
    request.webpush.subscription,
    '{"title":"Hi John","body":"Hello John! How are you?","icon":"https://notifme.github.io/notifme-sdk/img/icon.png"}',
    { TTL: undefined, headers: undefined }
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      webpush: { id: 'returned-id', providerId: 'webpush-gcm-provider' }
    }
  })
})

test('GCM with vapid.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      webpush: {
        providers: [{
          type: 'gcm',
          vapidDetails: { subject: 'xxxx', publicKey: 'xxxxx', privateKey: 'xxxxxx' }
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(webpush.setVapidDetails).lastCalledWith('xxxx', 'xxxxx', 'xxxxxx')
  expect(webpush.sendNotification).lastCalledWith(
    request.webpush.subscription,
    '{"title":"Hi John","body":"Hello John! How are you?","icon":"https://notifme.github.io/notifme-sdk/img/icon.png"}',
    { TTL: undefined, headers: undefined }
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      webpush: { id: 'returned-id', providerId: 'webpush-gcm-provider' }
    }
  })
})
