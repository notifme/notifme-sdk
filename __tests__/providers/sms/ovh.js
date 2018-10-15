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
        type: 'ovh',
        appKey: 'key',
        appSecret: 'secret',
        consumerKey: 'ckey',
        account: 'account',
        host: 'eu.api.ovh.com'
      }]
    }
  }
})

const request = {
  sms: { from: 'Notifme', to: '+15000000001', text: 'Hello John! How are you?' }
}

test('Ovh success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ ids: ['returned-id'] }))
  const now = Math.round(Date.now() / 1000)
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'eu.api.ovh.com',
    method: 'POST',
    path: '/1.0/sms/account/jobs/',
    protocol: 'https:',
    href: 'https://eu.api.ovh.com/1.0/sms/account/jobs/',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      'Content-Length': ['138'],
      'Content-Type': ['application/json charset=utf-8'],
      'X-Ovh-Application': ['key'],
      'X-Ovh-Consumer': ['ckey'],
      'X-Ovh-Signature': [expect.stringContaining('$1$')],
      'X-Ovh-Timestamp': [expect.stringMatching(new RegExp(`^(${now}|${now + 1})$`))],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"sender":"Notifme","message":"Hello John! How are you?","receivers":["+15000000001"],"charset":"UTF-8","class":null,"noStopClause":false}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      sms: { id: 'returned-id', providerId: 'sms-ovh-provider' }
    }
  })
})

test('Ovh success with different message classes.', async () => {
  mockResponse(200, JSON.stringify({ ids: ['returned-id'] }))
  await sdk.send({ sms: { ...request.sms, messageClass: 0 } })
  expect(mockHttp.body).toEqual(
    '{"sender":"Notifme","message":"Hello John! How are you?","receivers":["+15000000001"],"charset":"UTF-8","class":"flash","noStopClause":false}'
  )
  await sdk.send({ sms: { ...request.sms, messageClass: 1 } })
  expect(mockHttp.body).toEqual(
    '{"sender":"Notifme","message":"Hello John! How are you?","receivers":["+15000000001"],"charset":"UTF-8","class":"phoneDisplay","noStopClause":false}'
  )
  await sdk.send({ sms: { ...request.sms, messageClass: 2 } })
  expect(mockHttp.body).toEqual(
    '{"sender":"Notifme","message":"Hello John! How are you?","receivers":["+15000000001"],"charset":"UTF-8","class":"sim","noStopClause":false}'
  )
  await sdk.send({ sms: { ...request.sms, messageClass: 3 } })
  expect(mockHttp.body).toEqual(
    '{"sender":"Notifme","message":"Hello John! How are you?","receivers":["+15000000001"],"charset":"UTF-8","class":"toolkit","noStopClause":false}'
  )
})

test('Ovh success with escaped unicode.', async () => {
  mockResponse(200, JSON.stringify({ ids: ['returned-id'] }))
  await sdk.send({ sms: { ...request.sms, text: 'Hello \u0081!' } })
  expect(mockHttp.body).toEqual(
    '{"sender":"Notifme","message":"Hello \u0081!","receivers":["+15000000001"],"charset":"UTF-8","class":null,"noStopClause":false}'
  )
})

test('Ovh API error.', async () => {
  mockResponse(400, JSON.stringify({ message: 'error!' }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      sms: '400 - error!'
    },
    channels: {
      sms: { id: undefined, providerId: 'sms-ovh-provider' }
    }
  })
})
