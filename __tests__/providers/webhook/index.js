/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  webhook: {
    event: 'custom-event',
    data: {key: 'value'},
    url: 'http://fake.url'
  }
}

test('webhook unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      webhook: {
        providers: [{
          type: 'custom',
          id: 'my-custom-webhook-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      webhook: {id: 'custom-returned-id', providerId: 'my-custom-webhook-provider'}
    }
  })
})

test('webhook custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      webhook: {
        providers: [{
          type: 'unknown'
        }]
      }
    }})
  )).toThrow('Unknown webhook provider "unknown".')
})

test('webhook logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      webhook: {
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
      webhook: {id: expect.stringContaining('id-'), providerId: 'webhook-logger-provider'}
    }
  })
})
