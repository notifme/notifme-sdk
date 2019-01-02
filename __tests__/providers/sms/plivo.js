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
        type: 'plivo',
        authId: 'id',
        authToken: 'token'
      }]
    }
  }
})

const request = {
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?' }
}

test('Plivo success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ message_uuid: ['returned-id'] }))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.plivo.com',
    method: 'POST',
    path: '/v1/Account/id/Message/',
    protocol: 'https:',
    href: 'https://api.plivo.com/v1/Account/id/Message/',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic aWQ6dG9rZW4='],
      'Content-Length': ['72'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"src":"Notifme","dst":"+15000000001","text":"Hello John! How are you?"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-plivo-provider' }
    }
  })
})

test('Plivo success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({ message_uuid: ['returned-id'] }))
  const result = await sdk.send({
    sms: {
      from: 'Notifme',
      to: '+15000000001',
      text: '',
      customize: async (provider, request) => ({ ...request, text: 'Hello John! How are you??' })
    }
  })
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.plivo.com',
    method: 'POST',
    path: '/v1/Account/id/Message/',
    protocol: 'https:',
    href: 'https://api.plivo.com/v1/Account/id/Message/',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic aWQ6dG9rZW4='],
      'Content-Length': ['73'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"src":"Notifme","dst":"+15000000001","text":"Hello John! How are you??"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-plivo-provider' }
    }
  })
})

test('Plivo API unauthorized error.', async () => {
  mockResponse(401, 'unauthorized')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'unauthorized'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-plivo-provider' }
    }
  })
})

test('Plivo API error.', async () => {
  mockResponse(400, JSON.stringify({ error: 'error!' }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-plivo-provider' }
    }
  })
})
