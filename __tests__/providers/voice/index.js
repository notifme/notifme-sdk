/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  voice: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('voice unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      voice: {
        providers: [{
          type: 'custom',
          id: 'my-custom-voice-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      voice: {id: 'custom-returned-id', providerId: 'my-custom-voice-provider'}
    }
  })
})

test('voice custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      voice: {
        providers: [{
          type: 'unknown'
        }]
      }
    }})
  )).toThrow('Unknown voice provider "unknown".')
})

test('voice logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      voice: {
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
      voice: {id: expect.stringContaining('id-'), providerId: 'voice-logger-provider'}
    }
  })
})
