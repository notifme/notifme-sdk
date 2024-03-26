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
        type: 'seven',
        apiKey: 'apiKey'
      }]
    }
  }
})

const request = {
  sms: {
    from: 'Notifme',
    to: '+15000000001',
    text: 'Hello John! How are you?'
  }
}

const apiResponse = {
  balance: 46.748,
  debug: 'false',
  messages: [
    {
      encoding: 'gsm',
      error: null,
      error_text: null,
      id: 'returned-id',
      is_binary: false,
      label: null,
      parts: 1,
      price: 0.075,
      recipient: '491716992343',
      sender: '491716992343',
      success: true,
      text: 'text',
      udh: null
    }
  ],
  sms_type: 'direct',
  success: '100',
  total_price: 0.075
}

test('seven success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify(apiResponse))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'gateway.seven.io',
    method: 'POST',
    path: '/api/sms',
    protocol: 'https:',
    href: 'https://gateway.seven.io/api/sms',
    headers: expect.objectContaining({
      Accept: ['application/json'],
      'Content-Length': ['94'],
      'Content-Type': ['application/json'],
      SentWith: ['Notifme'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'],
      'X-Api-Key': ['apiKey']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"flash":0,"from":"Notifme","text":"Hello John! How are you?","to":"+15000000001","unicode":0}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-seven-provider' }
    }
  })
})

test('seven should customize requests.', async () => {
  mockResponse(200, JSON.stringify(apiResponse))
  await sdk.send({
    sms: {
      ...request.sms,
      customize: async (provider, request) => ({
        ...request,
        text: 'a totally new message',
        messageClass: 0,
        type: 'unicode'
      })
    }
  })
  expect(mockHttp.body).toEqual(
    '{"flash":1,"from":"Notifme","text":"a totally new message","to":"+15000000001","unicode":1}'
  )
})

test('seven error.', async () => {
  mockResponse(400, 'error!')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-seven-provider' }
    }
  })
})
