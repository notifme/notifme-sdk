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
        type: 'ses',
        region: 'eu-west-1',
        accessKeyId: 'key',
        secretAccessKey: 'secret'
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

test('SES success with minimal parameters.', async () => {
  mockResponse(200, '<MessageId>returned-id</MessageId>')
  const result = await sdk.send(request)
  const datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[:-]|\.\d{3}/g, '')
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'email.eu-west-1.amazonaws.com',
    method: 'POST',
    path: '/',
    protocol: 'https:',
    href: 'https://email.eu-west-1.amazonaws.com/',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: [expect.stringContaining(`AWS4-HMAC-SHA256 Credential=key/${datetime.substring(0, 8)}/eu-west-1/ses/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=`)],
      Host: 'email.eu-west-1.amazonaws.com',
      'X-Amz-Content-Sha256': [expect.stringMatching(/\w*/)],
      'X-Amz-Date': [datetime],
      'Content-Length': ['425'],
      'Content-Type': ['application/x-www-form-urlencoded; charset=utf-8'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toContain(
    'Action=SendRawEmail&Version=2010-12-01&RawMessage.Data='
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-ses-provider' }
    }
  })
})

test('SES success with all parameters.', async () => {
  mockResponse(200, '<MessageId>returned-id</MessageId>')
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
      }],
      customize: async (provider, request) => ({ ...request, subject: 'Hi John!' })
    }
  }
  const result = await sdk.send(completeRequest)
  const datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[:-]|\.\d{3}/g, '')
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    hostname: 'email.eu-west-1.amazonaws.com',
    method: 'POST',
    path: '/',
    protocol: 'https:',
    href: 'https://email.eu-west-1.amazonaws.com/',
    headers: expect.objectContaining({
      Accept: ['*/*'],
      Authorization: [expect.stringContaining(`AWS4-HMAC-SHA256 Credential=key/${datetime.substring(0, 8)}/eu-west-1/ses/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=`)],
      Host: 'email.eu-west-1.amazonaws.com',
      'X-Amz-Content-Sha256': [expect.stringMatching(/\w*/)],
      'X-Amz-Date': [datetime],
      'Content-Length': ['1017'],
      'Content-Type': ['application/x-www-form-urlencoded; charset=utf-8'],
      'User-Agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(mockHttp.body).toContain(
    'Action=SendRawEmail&Version=2010-12-01&RawMessage.Data='
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: { id: 'returned-id', providerId: 'email-ses-provider' }
    }
  })
})

test('SES should return an error if a parameter is not of the right type.', async () => {
  // $FlowIgnore
  const result = await sdk.send({ email: { text: [] } })
  expect(result).toEqual({
    status: 'error',
    errors: {
      email: 'The "chunk" argument must be one of type string or Buffer. Received type object'
    },
    channels: {
      email: { id: undefined, providerId: 'email-ses-provider' }
    }
  })
})

test('SES API error.', async () => {
  mockResponse(400, 'error!')
  const result = await sdk.send(request)
  expect(result).toEqual({
    status: 'error',
    errors: {
      email: '400 - error!'
    },
    channels: {
      email: { id: undefined, providerId: 'email-ses-provider' }
    }
  })
})
