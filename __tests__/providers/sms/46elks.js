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
        type: '46elks',
        apiUsername: 'username',
        apiPassword: 'password'
      }]
    }
  }
})

const request = {
  sms: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('46Elks success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({id: 'returned-id'}))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.46elks.com',
    method: 'POST',
    path: '/a1/sms',
    protocol: 'https:',
    url: 'https://api.46elks.com/a1/sms',
    body: 'from=Notifme&to=%2B15000000001&message=Hello%20John!%20How%20are%20you%3F',
    headers: expect.objectContaining({
      accept: ['*/*'],
      authorization: ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
      'content-length': [73],
      'user-agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: {id: 'returned-id', providerId: 'sms-46elks-provider'}
    }
  })
})

test('46Elks error.', async () => {
  mockResponse(400, 'error!')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'error!'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-46elks-provider'}
    }
  })
})
