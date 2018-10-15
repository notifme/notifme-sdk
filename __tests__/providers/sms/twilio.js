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
        type: 'twilio',
        accountSid: 'account',
        authToken: 'token'
      }]
    }
  }
})

const request = {
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?' }
}

test('Twilio success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ sid: 'returned-id' }))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.twilio.com',
    method: 'POST',
    path: '/2010-04-01/Accounts/account/Messages.json',
    protocol: 'https:',
    href: 'https://api.twilio.com/2010-04-01/Accounts/account/Messages.json',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic YWNjb3VudDp0b2tlbg=='],
      'Content-Length': ['406'],
      'Content-Type': [expect.stringContaining('multipart/form-data;boundary=')],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-twilio-provider' }
    }
  })
})

test('Twilio success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({ sid: 'returned-id' }))
  const completeRequest = {
    metadata: { id: '24' },
    sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?', type: 'unicode', nature: 'marketing', ttl: 3600, messageClass: 1 }
  }
  const result = await sdk.send(completeRequest)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.twilio.com',
    method: 'POST',
    path: '/2010-04-01/Accounts/account/Messages.json',
    protocol: 'https:',
    href: 'https://api.twilio.com/2010-04-01/Accounts/account/Messages.json',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Basic YWNjb3VudDp0b2tlbg=='],
      'Content-Length': ['523'],
      'Content-Type': [expect.stringContaining('multipart/form-data;boundary=')],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-twilio-provider' }
    }
  })
})

test('Twilio API error.', async () => {
  mockResponse(400, JSON.stringify({ message: 'error!' }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: '400 - error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-twilio-provider' }
    }
  })
})
