/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

const mockSend = jest.fn()
jest.mock('../../../src/providers/email/smtp', () => () => ({
  send: mockSend
}))

const sdk = new NotifmeSdk({
  useNotificationCatcher: true
})

test('whatsapp notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send({
    whatsapp: {
      from: 'me',
      to: 'you',
      type: 'text',
      text: 'Hello John!'
    }
  })
  expect(mockSend).lastCalledWith({
    to: 'you@whatsapp',
    from: 'me',
    subject: 'Hello John!',
    text: JSON.stringify({ text: 'Hello John!', type: 'text' }, null, 2),
    headers: {
      'X-type': 'whatsapp',
      'X-to': '[whatsapp] you'
    }
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      whatsapp: { id: '', providerId: 'whatsapp-notificationcatcher-provider' }
    }
  })
})

test('whatsapp notification catcher provider should use SMTP provider (template).', async () => {
  const result = await sdk.send({
    whatsapp: {
      from: 'me',
      to: 'you',
      type: 'template',
      templateName: 'template-name',
      templateData: { body: { placeholders: ['John'] } }
    }
  })
  expect(mockSend).lastCalledWith({
    to: 'you@whatsapp',
    from: 'me',
    subject: '',
    text: JSON.stringify({ type: 'template', templateName: 'template-name', templateData: { body: { placeholders: ['John'] } } }, null, 2),
    headers: {
      'X-type': 'whatsapp',
      'X-to': '[whatsapp] you'
    }
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      whatsapp: { id: '', providerId: 'whatsapp-notificationcatcher-provider' }
    }
  })
})

test('whatsapp notification catcher provider should use SMTP provider (long message).', async () => {
  const result = await sdk.send({
    whatsapp: {
      from: 'me',
      to: 'you',
      type: 'text',
      text: 'Hello John! How are you?'
    }
  })
  expect(mockSend).lastCalledWith({
    to: 'you@whatsapp',
    from: 'me',
    subject: 'Hello John! How are ...',
    text: JSON.stringify({ text: 'Hello John! How are you?', type: 'text' }, null, 2),
    headers: {
      'X-type': 'whatsapp',
      'X-to': '[whatsapp] you'
    }
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      whatsapp: { id: '', providerId: 'whatsapp-notificationcatcher-provider' }
    }
  })
})

test('whatsapp customized success.', async () => {
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
  expect(mockSend).lastCalledWith({
    to: 'you@whatsapp',
    from: 'me',
    subject: 'Hello John! How are ...',
    text: JSON.stringify({ text: 'Hello John! How are you?', type: 'text' }, null, 2),
    headers: {
      'X-type': 'whatsapp',
      'X-to': '[whatsapp] you'
    }
  })
})
