/* @flow */
/* global jest, test, expect */
import strategyRoundrobin from '../../../src/strategies/providers/roundrobin'
import logger from '../../../src/util/logger'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

const request = {
  sms: {from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?'}
}

test('Roundrobin strategy should call all providers in turns.', async () => {
  const strategy = strategyRoundrobin([
    {
      id: 'sms-provider-1',
      send: async () => '24'
    }, {
      id: 'sms-provider-2',
      send: async () => '24'
    }, {
      id: 'sms-provider-3',
      send: async () => { throw new Error('error provider 3') }
    }, {
      id: 'sms-provider-4',
      send: async () => '24'
    }
  ])

  // First call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-1', id: '24'})
  // Second call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-2', id: '24'})
  // Third call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-4', id: '24'})
  expect(logger.warn).toBeCalledWith('sms-provider-3', new Error('error provider 3'))
  // Fourth call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-4', id: '24'})
  // Fifth call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-1', id: '24'})
  // Sixth call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-2', id: '24'})
  // Seventh call
  expect(await strategy(request)).toEqual({providerId: 'sms-provider-4', id: '24'})
  expect(logger.warn).toBeCalledWith('sms-provider-3', new Error('error provider 3'))
})

test('Roundrobin strategy should throw an error if all providers failed.', async () => {
  const strategy = strategyRoundrobin([
    {
      id: 'sms-provider-1',
      send: async () => { throw new Error('error provider 1') }
    }, {
      id: 'sms-provider-2',
      send: async () => { throw new Error('error provider 2') }
    }, {
      id: 'sms-provider-3',
      send: async () => { throw new Error('error provider 3') }
    }
  ])

  let error
  try {
    await strategy(request)
  } catch (e) {
    error = e
  }
  expect(logger.warn).toBeCalledWith('sms-provider-1', new Error('error provider 1'))
  expect(logger.warn).toBeCalledWith('sms-provider-2', new Error('error provider 2'))
  expect(logger.warn).toBeCalledWith('sms-provider-3', new Error('error provider 3'))
  expect(error).toEqual(new Error('error provider 3'))
})
