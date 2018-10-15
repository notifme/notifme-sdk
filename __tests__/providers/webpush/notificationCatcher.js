/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

const mockSend = jest.fn()
jest.mock('../../../src/providers/email/smtp', () => () => ({
  send: mockSend
}))

const sdk = new NotifmeSdk({
  useNotificationCatcher: true
})

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

test('webpush notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send(request)
  expect(mockSend).lastCalledWith({
    from: '-',
    headers: {
      'X-payload': '{"title":"Hi John","body":"Hello John! How are you?","icon":"https://notifme.github.io/notifme-sdk/img/icon.png"}',
      'X-to': '[webpush] ',
      'X-type': 'webpush'
    },
    subject: 'Hi John',
    to: 'user@webpush'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      webpush: { id: undefined, providerId: 'webpush-notificationcatcher-provider' }
    }
  })
})

test('webpush notification catcher provider should use SMTP provider (with userId).', async () => {
  const result = await sdk.send({ metadata: { userId: '24' }, ...request })
  expect(mockSend).lastCalledWith({
    from: '-',
    headers: {
      'X-payload': '{"title":"Hi John","userId":"24","body":"Hello John! How are you?","icon":"https://notifme.github.io/notifme-sdk/img/icon.png"}',
      'X-to': '[webpush] 24',
      'X-type': 'webpush'
    },
    subject: 'Hi John',
    to: '24@webpush'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      webpush: { id: undefined, providerId: 'webpush-notificationcatcher-provider' }
    }
  })
})
