/* @flow */
/* global jest, test, expect */
import NotifmeSdk from '../../../src'

const mockSendMail = jest.fn()
mockSendMail.mockReturnValue({messageId: 'returned-id'})
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: mockSendMail
  })
}))
jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const sdk = new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'sendmail',
        sendmail: true,
        path: 'sendmail',
        newline: 'unix'
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

test('Sendmail should use nodemailer.', async () => {
  const result = await sdk.send(request)
  expect(mockSendMail).lastCalledWith(request.email)
  expect(result).toEqual({
    status: 'success',
    channels: {
      email: {id: 'returned-id', providerId: 'email-sendmail-provider'}
    }
  })
})
