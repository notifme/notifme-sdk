/* @flow */
/* global jest, test, expect */
import strategyFallback from '../../../strategies/providers/fallback'
import logger from '../../../util/logger'

jest.mock('../../../util/logger', () => ({
  warn: jest.fn()
}))

const failingProviders = [
  {
    id: 'sms-provider-1',
    send: async () => { throw new Error('error provider 1') }
  }, {
    id: 'sms-provider-2',
    send: async () => { throw new Error('error provider 2') }
  }
]

test('Fallback strategy should call all providers and return success if one succeeded.', async () => {
  const strategy = strategyFallback([
    ...failingProviders,
    {
      id: 'sms-provider-3',
      send: async () => '24'
    }
  ])
  const result = await strategy({
    sms: {from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?'}
  })

  expect(logger.warn).toBeCalledWith('sms-provider-1', new Error('error provider 1'))
  expect(logger.warn).toBeCalledWith('sms-provider-2', new Error('error provider 2'))
  expect(result).toEqual({providerId: 'sms-provider-3', id: '24'})
})

test('Fallback strategy should call all providers and throw error if all failed.', async () => {
  const strategy = strategyFallback(failingProviders)

  let error
  try {
    await strategy({
      sms: {from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?'}
    })
  } catch (e) {
    error = e
  }
  expect(logger.warn).toBeCalledWith('sms-provider-1', new Error('error provider 1'))
  expect(logger.warn).toBeCalledWith('sms-provider-2', new Error('error provider 2'))
  expect(error).toEqual(new Error('error provider 2'))
})
