/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, { mockResponse } from '../mockHttp'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'sparkpost',
        apiKey: 'key'
      }]
    }
  }
})

const request = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    text: 'Hello John! How are you?'
  }
}

test('Sparkpost success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify({ results: { id: 'returned-id' } }))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.sparkpost.com',
    method: 'POST',
    path: '/api/v1/transmissions',
    protocol: 'https:',
    href: 'https://api.sparkpost.com/api/v1/transmissions',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['key'],
      'Content-Length': ['224'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"options":{"transactional":true},"content":{"from":"me@example.com","subject":"Hi John","text":"Hello John! How are you?","headers":{},"attachments":[]},"recipients":[{"address":{"email":"john@example.com"}}],"metadata":{}}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-sparkpost-provider' }
    }
  })
})

test('Sparkpost success with all parameters.', async () => {
  mockResponse(200, JSON.stringify({ results: { id: 'returned-id' } }))
  const completeRequest = {
    metadata: {
      id: '24',
      userId: '36'
    },
    email: {
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'Hi John',
      html: '<b>Hello John! How are you?</b>',
      replyTo: 'replyto@example.com',
      headers: { 'My-Custom-Header': 'my-value' },
      cc: ['cc1@example.com', 'cc2@example.com'],
      bcc: ['bcc@example.com'],
      attachments: [{
        contentType: 'text/plain',
        filename: 'test.txt',
        content: 'hello!'
      }]
    }
  }
  const result = await sdk.send(completeRequest)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.sparkpost.com',
    method: 'POST',
    path: '/api/v1/transmissions',
    protocol: 'https:',
    href: 'https://api.sparkpost.com/api/v1/transmissions',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['key'],
      'Content-Length': ['619'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"options":{"transactional":true},"content":{"from":"from@example.com","reply_to":"replyto@example.com","subject":"Hi John","html":"<b>Hello John! How are you?</b>","headers":{"My-Custom-Header":"my-value","CC":"cc1@example.com,cc2@example.com"},"attachments":[{"type":"text/plain","name":"test.txt","data":"aGVsbG8h"}]},"recipients":[{"address":{"email":"to@example.com"}},{"address":{"email":"cc1@example.com","header_to":"to@example.com"}},{"address":{"email":"cc2@example.com","header_to":"to@example.com"}},{"address":{"email":"bcc@example.com","header_to":"to@example.com"}}],"metadata":{"id":"24","userId":"36"}}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-sparkpost-provider' }
    }
  })
})

test('Sparkpost success with buffered attachment.', async () => {
  mockResponse(200, JSON.stringify({ results: { id: 'returned-id' } }))
  const completeRequest = {
    metadata: {
      id: '24'
    },
    email: {
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'Hi John',
      html: '<b>Hello John! How are you?</b>',
      attachments: [{
        contentType: 'text/plain',
        filename: 'test.txt',
        content: Buffer.from('hello!')
      }]
    }
  }
  const result = await sdk.send(completeRequest)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.sparkpost.com',
    method: 'POST',
    path: '/api/v1/transmissions',
    protocol: 'https:',
    href: 'https://api.sparkpost.com/api/v1/transmissions',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['key'],
      'Content-Length': ['297'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"options":{"transactional":true},"content":{"from":"from@example.com","subject":"Hi John","html":"<b>Hello John! How are you?</b>","headers":{},"attachments":[{"type":"text/plain","name":"test.txt","data":"aGVsbG8h"}]},"recipients":[{"address":{"email":"to@example.com"}}],"metadata":{"id":"24"}}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-sparkpost-provider' }
    }
  })
})

test('Sparkpost API error.', async () => {
  mockResponse(400, JSON.stringify({ errors: [{ code: '24', message: 'error!' }] }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      email: '400 - code: 24, message: error!'
    },
    channels: {
      email: { id: undefined, providerId: 'email-sparkpost-provider' }
    }
  })
})
