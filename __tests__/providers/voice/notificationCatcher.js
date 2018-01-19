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
  voice: {from: 'Notifme', to: '+15000000001', text: 'Hello John!'}
}

test('voice notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send(request)
  expect(mockSend).lastCalledWith({
    from: 'Notifme',
    headers: {
      'X-to': '[voice] +15000000001',
      'X-type': 'voice'
    },
    subject: 'Hello John!',
    to: '+15000000001@voice',
    text: 'Hello John!'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      voice: {id: undefined, providerId: 'voice-notificationcatcher-provider'}
    }
  })
})

test('voice notification catcher provider should use SMTP provider (long message).', async () => {
  const result = await sdk.send({voice: {...request.voice, text: 'very very very very very very very very long'}})
  expect(mockSend).lastCalledWith({
    from: 'Notifme',
    headers: {
      'X-to': '[voice] +15000000001',
      'X-type': 'voice'
    },
    subject: 'very very very very ...',
    to: '+15000000001@voice',
    text: 'very very very very very very very very long'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      voice: {id: undefined, providerId: 'voice-notificationcatcher-provider'}
    }
  })
})
