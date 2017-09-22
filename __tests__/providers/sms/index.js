/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  sms: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('sms unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      sms: {
        providers: [{
          type: 'custom',
          id: 'my-custom-sms-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: {id: 'custom-returned-id', providerId: 'my-custom-sms-provider'}
    }
  })
})

test('sms custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      sms: {
        providers: [{
          type: 'unknown'
        }]
      }
    }})
  )).toThrow('Unknown sms provider "unknown".')
})

test('sms logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      sms: {
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
      sms: {id: expect.stringContaining('id-'), providerId: 'sms-logger-provider'}
    }
  })
})
