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
        type: 'clickatell',
        apiKey: 'my-key'
      }]
    }
  }
})

const request = {
  sms: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('Clickatell success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({messages: [{apiMessageId: 'returned-id'}]}))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'platform.clickatell.com',
    method: 'POST',
    path: '/messages',
    protocol: 'https:',
    href: 'https://platform.clickatell.com/messages',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['my-key'],
      'Content-Length': ['78'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"to":["+15000000001"],"content":"Hello John! How are you?","charset":"UTF-8"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: {id: 'returned-id', providerId: 'sms-clickatell-provider'}
    }
  })
})

test('Clickatell success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({messages: [{apiMessageId: 'returned-id'}]}))
  const completeRequest = {
    metadata: {id: '24'},
    sms: {from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?', type: 'unicode', nature: 'marketing', ttl: 3600, messageClass: 1}
  }
  const result = await sdk.send(completeRequest)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'platform.clickatell.com',
    method: 'POST',
    path: '/messages',
    protocol: 'https:',
    href: 'https://platform.clickatell.com/messages',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['my-key'],
      'Content-Length': ['125'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"to":["+15000000001"],"content":"Hello John! How are you?","charset":"UCS2-BE","validityPeriod":3600,"clientMessageId":"24"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: {id: 'returned-id', providerId: 'sms-clickatell-provider'}
    }
  })
})

test('Clickatell API error.', async () => {
  mockResponse(400, 'error!')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'error!'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-clickatell-provider'}
    }
  })
})

test('Clickatell error.', async () => {
  mockResponse(200, JSON.stringify({error: 'error!'}))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: 'error!'
    },
    channels: {
      sms: {id: undefined, providerId: 'sms-clickatell-provider'}
    }
  })
})
