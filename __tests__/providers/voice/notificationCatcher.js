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
  voice: { from: 'Notifme', to: '+15000000001', url: 'https://notifme.github.io' }
}

test('voice notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send(request)
  expect(mockSend).lastCalledWith({
    from: 'Notifme',
    headers: {
      'X-to': '[voice] +15000000001',
      'X-type': 'voice'
    },
    subject: '+15000000001@voice',
    to: '+15000000001@voice',
    text: 'https://notifme.github.io'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      voice: { id: undefined, providerId: 'voice-notificationcatcher-provider' }
    }
  })
})
