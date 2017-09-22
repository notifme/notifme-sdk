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
        type: 'infobip',
        username: 'username',
        password: 'password'
      }]
    }
  }
})

const request = {
  sms: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('Infobip success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({messages: [{status: {groupId: 1}, messageId: 'returned-id'}]}))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.infobip.com',
    method: 'POST',
    path: '/sms/1/text/single',
    protocol: 'https:',
    url: 'https://api.infobip.com/sms/1/text/single',
    body: '{"from":"Notifme","to":"+15000000001","text":"Hello John! How are you?"}',
    headers: expect.objectContaining({
      accept: ['*/*'],
      authorization: ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
      'content-length': [72],
      'content-type': ['application/json'],
      'user-agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: {id: 'returned-id', providerId: 'sms-infobip-provider'}
    }
  })
})

test('Infobip API error.', async () => {
  mockResponse(400, JSON.stringify({requestError: {serviceException: {code: '32', message: 'error!'}}}))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'code: 32, message: error!'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-infobip-provider'}
    }
  })
})

test('Infobip API error (unknown format).', async () => {
  mockResponse(400, JSON.stringify({error: 'error!'}))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: '{"error":"error!"}'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-infobip-provider'}
    }
  })
})

test('Infobip error.', async () => {
  mockResponse(200, JSON.stringify({messages: [{status: {groupId: 0, message: 'error!'}}]}))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'groupId: 0, message: error!'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-infobip-provider'}
    }
  })
})
