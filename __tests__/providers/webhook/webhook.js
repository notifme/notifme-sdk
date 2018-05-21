/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, {mockResponse} from '../mockHttp'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    webhook: {
      providers: [{
        type: 'webhook'
      }]
    }
  }
})

const request = {
  webhook: {
    event: 'custom-event',
    data: {key: 'value'},
    url: 'https://google.fr'
  }
}

test('Webhook success.', async () => {
  mockResponse(200, 'ok')
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    method: 'POST',
    url: 'https://google.fr',
    body: expect.stringContaining(JSON.stringify({event: 'custom-event', data: {key: 'value'}}))
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      webhook: {id: '', providerId: 'webhook-provider'}
    }
  })
})

test('Webhook with no message.', async () => {
  mockResponse(500, 'custom_webhook_error')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      webhook: '500 - custom_webhook_error'
    },
    channels: {
      webhook: {id: undefined, providerId: 'webhook-provider'}
    }
  })
})
