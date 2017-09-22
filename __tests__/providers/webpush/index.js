/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

jest.mock('../../../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const request = {
  webpush: {
    subscription: {
      keys: {
        auth: 'xxxxx',
        p256dh: 'xxxxx'
      },
      endpoint: 'xxxxx'
    },
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  }
}

test('webpush unknown provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      webpush: {
        providers: [{
          type: 'custom',
          id: 'my-custom-webpush-provider',
          send: async () => 'custom-returned-id'
        }]
      }
    }
  })
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'success',
    channels: {
      webpush: {id: 'custom-returned-id', providerId: 'my-custom-webpush-provider'}
    }
  })
})

test('webpush custom provider.', async () => {
  // $FlowIgnore
  expect(() => (new NotifmeSdk({
    channels: {
      webpush: {
        providers: [{
          type: 'unknown'
        }]
      }
    }})
  )).toThrow('Unknown webpush provider "unknown".')
})

test('webpush logger provider.', async () => {
  const sdk = new NotifmeSdk({
    channels: {
      webpush: {
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
      webpush: {id: expect.stringContaining('id-'), providerId: 'webpush-logger-provider'}
    }
  })
})
