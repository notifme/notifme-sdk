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

test('slack notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send({
    slack: {
      text: 'Hello John!'
    }
  })
  expect(mockSend).lastCalledWith({
    to: 'public.channel@slack',
    from: '-',
    subject: 'Hello John!',
    text: 'Hello John!',
    headers: {
      'X-type': 'slack',
      'X-to': '[slack public channel]'
    }
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      slack: {id: '', providerId: 'slack-notificationcatcher-provider'}
    }
  })
})

test('slack notification catcher provider should use SMTP provider (long message).', async () => {
  const result = await sdk.send({
    slack: {
      text: 'Hello John! How are you?'
    }
  })
  expect(mockSend).lastCalledWith({
    to: 'public.channel@slack',
    from: '-',
    subject: 'Hello John! How are ...',
    text: 'Hello John! How are you?',
    headers: {
      'X-type': 'slack',
      'X-to': '[slack public channel]'
    }
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      slack: {id: '', providerId: 'slack-notificationcatcher-provider'}
    }
  })
})
