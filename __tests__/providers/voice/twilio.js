/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, {mockResponse} from '../mockHttp'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    voice: {
      providers: [{
        type: 'twilio',
        accountSid: 'account',
        authToken: 'token'
      }]
    }
  }
})

const request = {
  voice: {from: 'Notifme', to: '+15000000001', url: 'https://notifme.github.io'}
}

test('Twilio success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({sid: 'returned-id'}))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.twilio.com',
    method: 'POST',
    path: '/2010-04-01/Accounts/account/Calls.json',
    protocol: 'https:',
    url: 'https://api.twilio.com/2010-04-01/Accounts/account/Calls.json',
    headers: expect.objectContaining({
      accept: ['*/*'],
      authorization: ['Basic YWNjb3VudDp0b2tlbg=='],
      'content-type': [expect.stringContaining('multipart/form-data; boundary=')],
      'user-agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      voice: {id: 'returned-id', providerId: 'voice-twilio-provider'}
    }
  })
})

test('Twilio success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({sid: 'returned-id'}))
  const result = await sdk.send({voice: {
    from: 'Notifme',
    to: '+15000000001',
    url: 'https://notifme.github.io',
    method: 'POST',
    fallbackUrl: 'http://example.com',
    fallbackMethod: 'POST',
    statusCallback: 'http://example.com',
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    sendDigits: 'ww1234',
    machineDetection: 'Enable',
    machineDetectionTimeout: 30,
    timeout: 60
  }})
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.twilio.com',
    method: 'POST',
    path: '/2010-04-01/Accounts/account/Calls.json',
    protocol: 'https:',
    url: 'https://api.twilio.com/2010-04-01/Accounts/account/Calls.json',
    headers: expect.objectContaining({
      accept: ['*/*'],
      authorization: ['Basic YWNjb3VudDp0b2tlbg=='],
      'content-type': [expect.stringContaining('multipart/form-data; boundary=')],
      'user-agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      voice: {id: 'returned-id', providerId: 'voice-twilio-provider'}
    }
  })
})

test('Twilio API error.', async () => {
  mockResponse(400, JSON.stringify({message: 'error!'}))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      voice: '400 - error!'
    },
    channels: {
      voice: {id: undefined, providerId: 'voice-twilio-provider'}
    }
  })
})
