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
        type: 'mandrill',
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

test('Mandrill success with minimal parameters.', async () => {
  mockResponse(200, JSON.stringify([{ _id: 'returned-id', status: 'sent', email: 'john@example.com' }]))
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'mandrillapp.com',
    method: 'POST',
    path: '/api/1.0/messages/send.json',
    protocol: 'https:',
    href: 'https://mandrillapp.com/api/1.0/messages/send.json',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      'Content-Length': ['198'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toContain(
    '{"key":"key","message":{"from_email":"me@example.com","to":[{"email":"john@example.com","type":"to"}],"subject":"Hi John","text":"Hello John! How are you?","headers":{},"metadata":{}},"async":false}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: expect.stringMatching(/\w*/), providerId: 'email-mandrill-provider' }
    }
  })
})

test('Mandrill success with all parameters.', async () => {
  mockResponse(200, JSON.stringify([{ _id: 'returned-id', status: 'sent', email: 'john@example.com' }]))
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
    hostname: 'mandrillapp.com',
    method: 'POST',
    path: '/api/1.0/messages/send.json',
    protocol: 'https:',
    href: 'https://mandrillapp.com/api/1.0/messages/send.json',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      'Content-Length': ['488'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"key":"key","message":{"from_email":"from@example.com","to":[{"email":"to@example.com","type":"to"},{"email":"cc1@example.com","type":"cc"},{"email":"cc2@example.com","type":"cc"},{"email":"bcc@example.com","type":"bcc"}],"subject":"Hi John","html":"<b>Hello John! How are you?</b>","headers":{"Reply-To":"replyto@example.com","My-Custom-Header":"my-value"},"attachments":[{"type":"text/plain","name":"test.txt","content":"aGVsbG8h"}],"metadata":{"id":"24","userId":"36"}},"async":false}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-mandrill-provider' }
    }
  })
})

test('Mandrill success with buffered attachment.', async () => {
  mockResponse(200, JSON.stringify([{ _id: 'returned-id', status: 'sent', email: 'john@example.com' }]))
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
    hostname: 'mandrillapp.com',
    method: 'POST',
    path: '/api/1.0/messages/send.json',
    protocol: 'https:',
    href: 'https://mandrillapp.com/api/1.0/messages/send.json',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      'Content-Length': ['291'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"key":"key","message":{"from_email":"from@example.com","to":[{"email":"to@example.com","type":"to"}],"subject":"Hi John","html":"<b>Hello John! How are you?</b>","headers":{},"attachments":[{"type":"text/plain","name":"test.txt","content":"aGVsbG8h"}],"metadata":{"id":"24"}},"async":false}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-mandrill-provider' }
    }
  })
})

test('Mandrill API error.', async () => {
  mockResponse(400, JSON.stringify({ status: 'error', code: 12, name: 'Error', message: 'error!' }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      email: '400 - status: error, code: 12, name: Error, message: error!'
    },
    channels: {
      email: { id: undefined, providerId: 'email-mandrill-provider' }
    }
  })
})
