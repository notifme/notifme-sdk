/* @flow */
/* global jest, test, expect */
import Sender from '../src/sender'
import strategyNoFallback from '../src/strategies/providers/no-fallback'
import logger from '../src/util/logger'

jest.mock('../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}))

const providers = {
  email: [{id: 'email-provider', send: jest.fn()}],
  sms: [{id: 'sms-provider', send: async () => '24'}],
  push: [], // no push provider
  webpush: [{id: 'webpush-provider', send: () => { throw new Error('webpush test error') }}]
}
const strategies = {
  email: strategyNoFallback,
  sms: strategyNoFallback,
  push: strategyNoFallback,
  webpush: strategyNoFallback
}

const sender = new Sender(['email', 'sms', 'push', 'webpush'], providers, strategies)

test('Sender should send all notifications.', async () => {
  const metadata = {id: '24'}
  const request = {
    metadata,
    email: {from: 'me@example.com', to: 'john@example.com', subject: 'Hi John', html: '<b>Hello John! How are you?</b>'},
    sms: {from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?'},
    push: {registrationToken: 'xxxxx', title: 'Hi John', body: 'Hello John! How are you?'},
    webpush: {subscription: {keys: {auth: 'xxxxx', p256dh: 'xxxxx'}, endpoint: 'xxxxx'}, title: 'Hi John', body: 'Hello John! How are you?'}
  }

  const result = await sender.send(request)
  expect(providers.email[0].send).toBeCalledWith({...metadata, ...request.email})
  expect(logger.warn).toBeCalledWith('No provider registered for channel "push". Using logger.')
  expect(logger.info).toBeCalledWith('[PUSH] Sent by "push-logger-provider":')
  expect(logger.info).toBeCalledWith({id: '24', registrationToken: 'xxxxx', title: 'Hi John', body: 'Hello John! How are you?'})
  expect(logger.warn).toBeCalledWith('webpush-provider', new Error('webpush test error'))
  expect(result).toEqual({
    status: 'error',
    channels: {
      email: {id: undefined, providerId: 'email-provider'},
      sms: {id: '24', providerId: 'sms-provider'},
      push: {id: (result.channels: any).push.id, providerId: 'push-logger-provider'},
      webpush: {id: undefined, providerId: 'webpush-provider'}
    },
    errors: {
      webpush: 'webpush test error'
    }
  })

  expect(await sender.send({sms: request.sms})).toEqual({
    status: 'success',
    channels: {
      sms: {id: '24', providerId: 'sms-provider'}
    }
  })
})
