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

test('webhook notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send({
    webhook: {
      event: 'custom-event',
      data: {key: 'value'},
      url: 'http://fake.url'
    }
  })
  expect(mockSend).lastCalledWith({
    to: 'http://fake.url',
    from: '-',
    subject: 'custom-event',
    text: JSON.stringify({key: 'value'}),
    headers: {
      'X-type': 'webhook',
      'X-to': 'http://fake.url'
    }
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      webhook: {id: '', providerId: 'webhook-notificationcatcher-provider'}
    }
  })
})
