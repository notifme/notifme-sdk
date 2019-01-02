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
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John!' }
}

test('sms notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send(request)
  expect(mockSend).lastCalledWith({
    from: 'Notifme',
    headers: {
      'X-to': '[sms] +15000000001',
      'X-type': 'sms'
    },
    subject: 'Hello John!',
    to: '+15000000001@sms',
    text: 'Hello John!'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: undefined, providerId: 'sms-notificationcatcher-provider' }
    }
  })
})

test('sms notification catcher provider should use SMTP provider (long message).', async () => {
  const result = await sdk.send({
    sms: {
      ...request.sms,
      customize: async (provider, request) => ({ ...request, text: 'very very very very very very very very long' })
    }
  })
  expect(mockSend).lastCalledWith({
    from: 'Notifme',
    headers: {
      'X-to': '[sms] +15000000001',
      'X-type': 'sms'
    },
    subject: 'very very very very ...',
    to: '+15000000001@sms',
    text: 'very very very very very very very very long'
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: undefined, providerId: 'sms-notificationcatcher-provider' }
    }
  })
})
