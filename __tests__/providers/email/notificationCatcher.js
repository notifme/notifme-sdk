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

const request = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>',
    text: 'Hello John! How are you?',
    replyTo: 'contact@example.com'
  }
}

test('email notification catcher provider should use SMTP provider.', async () => {
  const result = await sdk.send(request)
  const {to, from, html, text, subject, replyTo} = request.email
  expect(mockSend).lastCalledWith({
    to, from, html, text, subject, replyTo, headers: {'X-to': `[email] ${to}`}
  })
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: {id: undefined, providerId: 'email-notificationcatcher-provider'}
    }
  })
})
