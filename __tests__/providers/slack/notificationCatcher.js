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
  slack: {
    text: 'Hello John! How are you?'
  }
}

test('slack notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send(request)
  expect(mockSend).lastCalledWith({
    from: '-',
    subject: 'Webhook',
    to: 'webhook@slack',
    text: 'Hello John! How are you?'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      slack: {id: undefined, providerId: 'slack-notificationcatcher-provider'}
    }
  })
})
