/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, {mockResponse} from '../mockHttp'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'nexmo',
        apiKey: 'key',
        apiSecret: 'secret'
      }]
    }
  }
})

const request = {
  sms: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('Nexmo success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({messages: [{status: '0', 'message-id': 'returned-id'}]}))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'rest.nexmo.com',
    method: 'POST',
    path: '/sms/json',
    protocol: 'https:',
    url: 'https://rest.nexmo.com/sms/json',
    body: '{"api_key":"key","api_secret":"secret","from":"Notifme","to":"+15000000001","text":"Hello John! How are you?"}',
    headers: expect.objectContaining({
      accept: ['*/*'],
      'content-length': [110],
      'content-type': ['application/json'],
      'user-agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: {id: 'returned-id', providerId: 'sms-nexmo-provider'}
    }
  })
})

test('Nexmo API error.', async () => {
  mockResponse(400, '')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: '400'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-nexmo-provider'}
    }
  })
})

test('Nexmo error.', async () => {
  mockResponse(200, JSON.stringify({messages: [{status: '1', 'error-text': 'error!'}]}))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'status: 1, error: error!'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-nexmo-provider'}
    }
  })
})
