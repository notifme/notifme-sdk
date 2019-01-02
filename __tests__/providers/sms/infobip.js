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
        type: 'infobip',
        username: 'username',
        password: 'password'
      }]
    }
  }
})

const request = {
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?' }
}

test('Infobip success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ messages: [{ status: { groupId: 1 }, messageId: 'returned-id' }] }))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.infobip.com',
    method: 'POST',
    path: '/sms/1/text/single',
    protocol: 'https:',
    href: 'https://api.infobip.com/sms/1/text/single',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
      'Content-Length': ['72'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"from":"Notifme","to":"+15000000001","text":"Hello John! How are you?"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-infobip-provider' }
    }
  })
})

test('Infobip success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({ messages: [{ status: { groupId: 1 }, messageId: 'returned-id' }] }))
  const result = await sdk.send({
    sms: {
      from: 'Notifme',
      to: '+15000000001',
      text: 'Hello John! How are you?',
      customize: async (provider, request) => ({ ...request, text: 'Hello John! How are you??' })
    }
  })
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.infobip.com',
    method: 'POST',
    path: '/sms/1/text/single',
    protocol: 'https:',
    href: 'https://api.infobip.com/sms/1/text/single',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic dXNlcm5hbWU6cGFzc3dvcmQ='],
      'Content-Length': ['73'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"from":"Notifme","to":"+15000000001","text":"Hello John! How are you??"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-infobip-provider' }
    }
  })
})

test('Infobip API error.', async () => {
  mockResponse(400, JSON.stringify({ requestError: { serviceException: { code: '32', message: 'error!' } } }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'code: 32, message: error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-infobip-provider' }
    }
  })
})

test('Infobip API error (unknown format).', async () => {
  mockResponse(400, JSON.stringify({ error: 'error!' }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: '{"error":"error!"}'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-infobip-provider' }
    }
  })
})

test('Infobip error.', async () => {
  mockResponse(200, JSON.stringify({ messages: [{ status: { groupId: 0, message: 'error!' } }] }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'groupId: 0, message: error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-infobip-provider' }
    }
  })
})
