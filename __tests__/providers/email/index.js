/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  }
}

test('email unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      email: {
        providers: [{
          type: 'custom',
          id: 'my-custom-email-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'custom-returned-id', providerId: 'my-custom-email-provider' }
    }
  })
})

test('email custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      email: {
        providers: [{
          type: 'unknown'
        }]
      }
    } })
  )).toThrow('Unknown email provider "unknown".')
})

test('email logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      email: {
        providers: [{
          type: 'logger'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: expect.stringContaining('id-'), providerId: 'email-logger-provider' }
    }
  })
})
