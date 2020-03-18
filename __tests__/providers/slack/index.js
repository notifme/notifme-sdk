/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  slack: {
    text: 'Hello John! How are you?'
  }
}

test('slack unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      slack: {
        providers: [{
          type: 'custom',
          id: 'my-custom-slack-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      slack: { id: 'custom-returned-id', providerId: 'my-custom-slack-provider' }
    }
  })
})

test('slack custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      slack: {
        providers: [{
          type: 'unknown'
        }]
      }
    }
  })
  )).toThrow('Unknown slack provider "unknown".')
})

test('slack logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      slack: {
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
      slack: { id: expect.stringContaining('id-'), providerId: 'slack-logger-provider' }
    }
  })
})
