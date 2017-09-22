/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, {mockResponse} from '../mockHttp'

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
    url: 'https://email.eu-west-1.amazonaws.com/',
    body: expect.stringContaining('Action=SendRawEmail&Version=2010-12-01&RawMessage.Data='),
    headers: expect.objectContaining({
      accept: ['*/*'],
      authorization: [expect.stringContaining(`AWS4-HMAC-SHA256 Credential=key/${datetime.substring(0, 8)}/eu-west-1/ses/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=`)],
      host: 'email.eu-west-1.amazonaws.com',
      'x-amz-content-sha256': [expect.stringMatching(/\w*/)],
      'x-amz-date': [datetime],
      'content-length': [425],
      'content-type': ['application/x-www-form-urlencoded; charset=utf-8'],
      'user-agent': ['notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)']
    })
  }))
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: {id: 'returned-id', providerId: 'email-ses-provider'}
    }
  })
})

test('SES should return an error if a parameter is not of the right type.', async () => {
  // $FlowIgnore
  const result = await sdk.send({email: {text: []}})
  expect(result).toEqual({
    status: 'error',
    errors: {
      email: 'Invalid non-string/buffer chunk'
    },
    channels: {
      email: {id: undefined, providerId: 'email-ses-provider'}
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
      email: {id: undefined, providerId: 'email-ses-provider'}
    }
  })
})
