/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, { mockResponse } from '../mockHttp'

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
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?' }
}

test('46Elks success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ id: 'returned-id' }))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.46elks.com',
    method: 'POST',
    path: '/a1/sms',
    protocol: 'https:',
    href: 'https://api.46elks.com/a1/sms',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
      'Content-Length': ['73'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    'from=Notifme&to=%2B15000000001&message=Hello%20John!%20How%20are%20you%3F'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-46elks-provider' }
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
      sms: { id: undefined, providerId: 'sms-46elks-provider' }
    }
  })
})
