/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  whatsapp: {
    from: 'me',
    to: 'you',
    type: 'text',
    text: 'Hello John! How are you?'
  }
}

test('whatsapp unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      whatsapp: {
        providers: [{
          type: 'custom',
          id: 'my-custom-whatsapp-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      whatsapp: { id: 'custom-returned-id', providerId: 'my-custom-whatsapp-provider' }
    }
  })
})

test('whatsapp custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      whatsapp: {
        providers: [{
          type: 'unknown'
        }]
      }
    }
  })
  )).toThrow('Unknown whatsapp provider "unknown".')
})

test('whatsapp logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      whatsapp: {
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
      whatsapp: { id: expect.stringContaining('id-'), providerId: 'whatsapp-logger-provider' }
    }
  })
})
