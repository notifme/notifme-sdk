/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'
import mockHttp, { mockResponse } from '../mockHttp'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    whatsapp: {
      providers: [
        {
          type: 'infobip',
          baseUrl: 'https://xxxxxx.api.infobip.com',
          apiKey: 'xxx'
        }
      ]
    }
  }
})

const request = {
  whatsapp: {
    from: 'me',
    to: 'you',
    type: 'text',
    text: 'Hello John! How are you?'
  }
}

test('Infobip text message success.', async () => {
  mockResponse(
    200,
    JSON.stringify({
      to: 'you',
      messageCount: 1,
      messageId: '...',
      status: {
        groupId: 1,
        groupName: 'PENDING',
        id: 1,
        name: 'PENDING_ENROUTE',
        description: 'Message sent to next instance'
      }
    })
  )
  const result = await sdk.send(request)
  expect(mockHttp).lastCalledWith(
    expect.objectContaining({
      method: 'POST',
      href: 'https://xxxxxx.api.infobip.com/whatsapp/1/message/text'
    })
  )
  expect(mockHttp.body).toContain('{"text":"Hello John! How are you?"}')
  expect(result).toEqual({
    status: 'success',
    channels: {
      whatsapp: { id: '...', providerId: 'whatsapp-infobip-provider' }
    }
  })
})

test('Infobip text template success.', async () => {
  mockResponse(
    200,
    JSON.stringify({
      messages: [
        {
          to: 'you',
          messageCount: 1,
          messageId: '...',
          status: {
            groupId: 1,
            groupName: 'PENDING',
            id: 1,
            name: 'PENDING_ENROUTE',
            description: 'Message sent to next instance'
          }
        }
      ]
    })
  )
  const result = await sdk.send({
    whatsapp: {
      from: 'me',
      to: 'you',
      type: 'template',
      templateName: 'template-name',
      templateData: { body: { placeholders: ['John'] } }
    }
  })
  expect(mockHttp).lastCalledWith(
    expect.objectContaining({
      method: 'POST',
      href: 'https://xxxxxx.api.infobip.com/whatsapp/1/message/template'
    })
  )
  expect(mockHttp.body).toContain(
    '[{"from":"me","to":"you","content":{"templateName":"template-name","templateData":{"body":{"placeholders":["John"]}}}}]'
  )
  expect(result).toEqual({
    status: 'success',
    channels: {
      whatsapp: { id: '...', providerId: 'whatsapp-infobip-provider' }
    }
  })
})

test('Infobip customized success.', async () => {
  mockResponse(
    200,
    JSON.stringify({
      to: 'you',
      messageCount: 1,
      messageId: '...',
      status: {
        groupId: 1,
        groupName: 'PENDING',
        id: 1,
        name: 'PENDING_ENROUTE',
        description: 'Message sent to next instance'
      }
    })
  )
  await sdk.send({
    whatsapp: {
      from: 'me',
      to: 'you',
      type: 'text',
      text: '',
      customize: async (provider, request) => ({
        from: 'me',
        to: 'you',
        type: 'text',
        text: 'Hello John! How are you?'
      })
    }
  })
  expect(mockHttp.body).toContain('{"text":"Hello John! How are you?"}')
})

test('Infobip with error (no text).', async () => {
  mockResponse(
    400,
    JSON.stringify({
      requestError: {
        serviceException: {
          messageId: 'BAD_REQUEST',
          text: 'Bad request'
        }
      }
    })
  )
  // $FlowIgnore
  const result = await sdk.send({ whatsapp: {} })
  expect(result).toEqual({
    status: 'error',
    errors: {
      whatsapp: 'messageId: BAD_REQUEST, text: Bad request'
    },
    channels: {
      whatsapp: { id: undefined, providerId: 'whatsapp-infobip-provider' }
    }
  })
})

test('Infobip with unknown error.', async () => {
  mockResponse(500, JSON.stringify({ error: 'KO' }))
  // $FlowIgnore
  const result = await sdk.send({ whatsapp: {} })
  expect(result).toEqual({
    status: 'error',
    errors: {
      whatsapp: '{"error":"KO"}'
    },
    channels: {
      whatsapp: { id: undefined, providerId: 'whatsapp-infobip-provider' }
    }
  })
})
