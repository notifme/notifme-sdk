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
        type: 'mailersend',
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

test('MailerSend success with minimal parameters.', async () => {
  mockResponse(202, '', { 'x-message-id': '12345' })
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.mailersend.com',
    method: 'POST',
    path: '/v1/email',
    protocol: 'https:',
    href: 'https://api.mailersend.com/v1/email',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Bearer key'],
      'Content-Length': ['239'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toContain(
    '{"from":{"email":"me@example.com","name":""},"to":[{"email":"john@example.com","name":""}],"subject":"Hi John","text":"Hello John! How are you?","custom_args":{"id":"'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: '12345', providerId: 'email-mailersend-provider' }
    }
  })
})

test('MailerSend success with all parameters.', async () => {
  mockResponse(202, '', { 'x-message-id': '12345' })
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
      text: 'Hello John! How are you?',
      replyTo: 'replyto@example.com',
      headers: { 'My-Custom-Header': 'my-value' },
      cc: ['cc1@example.com', 'cc2@example.com'],
      bcc: ['bcc@example.com'],
      attachments: [{
        contentType: 'text/plain',
        filename: 'test.txt',
        content: 'hello!'
      }],
      customize: async (provider, request) => ({ ...request, subject: 'Hi John!' })
    }
  }
  const result = await sdk.send(completeRequest)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'api.mailersend.com',
    method: 'POST',
    path: '/v1/email',
    protocol: 'https:',
    href: 'https://api.mailersend.com/v1/email',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Bearer key'],
      'Content-Length': ['639'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"from":{"email":"from@example.com","name":""},"to":[{"email":"to@example.com","name":""}],"subject":"Hi John!","html":"<b>Hello John! How are you?</b>","text":"Hello John! How are you?","reply_to":[{"email":"replyto@example.com"}],"cc":[{"email":"cc1@example.com","name":""},{"email":"cc2@example.com","name":""}],"bcc":[{"email":"bcc@example.com","name":""}],"headers":{"My-Custom-Header":"my-value"},"custom_args":{"id":"24","userId":"36"},"attachments":[{"type":"text/plain","filename":"test.txt","content":"aGVsbG8h"}]}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: '12345', providerId: 'email-mailersend-provider' }
    }
  })
})

test('MailerSend success with buffered attachment.', async () => {
  mockResponse(202, '', { 'x-message-id': '12345' })
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
    hostname: 'api.mailersend.com',
    method: 'POST',
    path: '/v1/email',
    protocol: 'https:',
    href: 'https://api.mailersend.com/v1/email',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: ['Bearer key'],
      'Content-Length': ['394'],
      'Content-Type': ['application/json'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toEqual(
    '{"from":{"email":"from@example.com","name":""},"to":[{"email":"to@example.com","name":""}],"subject":"Hi John","html":"<b>Hello John! How are you?</b>","custom_args":{"id":"24"},"attachments":[{"type":"text/plain","filename":"test.txt","content":"aGVsbG8h"}]}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: '12345', providerId: 'email-mailersend-provider' }
    }
  })
})

test('MailerSend API error.', async () => {
  mockResponse(400, JSON.stringify({ errors: [{ message: 'error!' }] }))
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      email: '400 - message: error!'
    },
    channels: {
      email: { id: undefined, providerId: 'email-mailersend-provider' }
    }
  })
})
