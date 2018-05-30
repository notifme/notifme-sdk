/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, {mockResponse} from '../mockHttp'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    slack: {
      providers: [{
        type: 'webhook',
        webhookUrl: 'https://hooks.slack.com/services/Txxxxxxxx/Bxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx'
      }]
    }
  }
})

const request = {
  slack: {
    text: 'Hello John! How are you?'
  }
}

test('Slack success.', async () => {
  mockResponse(200, 'ok')
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(expect.objectContaining({
    method: 'POST',
    href: 'https://hooks.slack.com/services/Txxxxxxxx/Bxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx'
  }))
  expect(mockHttp.body).toContain(
    '{"text":"Hello John! How are you?"}'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      slack: {id: '', providerId: 'slack-provider'}
    }
  })
})

test('Slack with no message.', async () => {
  mockResponse(500, 'missing_text_or_fallback_or_attachments')
  // $FlowIgnore
  const result = await sdk.send({slack: {text: []}})
  expect(result).toEqual({
    status: 'error',
    errors: {
      slack: '500 - missing_text_or_fallback_or_attachments'
    },
    channels: {
      slack: {id: undefined, providerId: 'slack-provider'}
    }
  })
})
