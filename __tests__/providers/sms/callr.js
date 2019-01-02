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
        type: 'callr',
        login: 'login',
        password: 'password'
      }]
    }
  }
})

const request = {
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?' }
}

test('Callr success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ data: 'returned-id' }))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.callr.com',
    method: 'POST',
    path: '/rest/v1.1/sms',
    protocol: 'https:',
    href: 'https://api.callr.com/rest/v1.1/sms',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic bG9naW46cGFzc3dvcmQ='],
      'Content-Length': ['127'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"from":"Notifme","to":"+15000000001","body":"Hello John! How are you?","options":{"force_encoding":"GSM","nature":"ALERTING"}}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-callr-provider' }
    }
  })
})

test('Callr success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({ data: 'returned-id' }))
  const completeRequest = {
    metadata: { id: '24' },
    sms: {
      from: 'Notifme',
      to: '+15000000001',
      text: 'Hello John! How are you?',
      type: 'unicode',
      nature: 'marketing',
      ttl: 3600,
      messageClass: 1,
      customize: async (provider, request) => ({ ...request, text: 'Hello John! How are you??' })
    }
  }
  const result = await sdk.send(completeRequest)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.callr.com',
    method: 'POST',
    path: '/rest/v1.1/sms',
    protocol: 'https:',
    href: 'https://api.callr.com/rest/v1.1/sms',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic bG9naW46cGFzc3dvcmQ='],
      'Content-Length': ['150'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"from":"Notifme","to":"+15000000001","body":"Hello John! How are you??","options":{"force_encoding":"UNICODE","nature":"MARKETING","user_data":"24"}}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-callr-provider' }
    }
  })
})

test('Callr error.', async () => {
  mockResponse(400, JSON.stringify({ data: { code: '400', message: 'error!' } }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'code: 400, message: error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-callr-provider' }
    }
  })
})
