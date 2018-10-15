/* @flow */
/* global jest, test, expect */
import strategyNoFallback from '../../../src/strategies/providers/no-fallback'
import logger from '../../../src/util/logger'

jest.mock('../../../src/util/logger', () => ({
  warn: jest.fn()
}))

test('No-Fallback strategy should call first provider and return success if it succeeded.', async () => {
  const strategy = strategyNoFallback([
    {
      id: 'sms-provider-1',
      send: async () => '24'
    }
  ])
  const result = await strategy({
    sms: { from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?' }
  })

  expect(result).toEqual({ providerId: 'sms-provider-1', id: '24' })
})

test('No-Fallback strategy should call first provider and throw error if it failed.', async () => {
  const strategy = strategyNoFallback([
    {
      id: 'sms-provider-1',
      send: async () => { throw new Error('error provider 1') }
    }, {
      id: 'sms-provider-2',
      send: async () => '24'
    }
  ])

  let error
  try {
    await strategy({
      sms: { from: '+15000000000', to: '+15000000001', text: 'Hello John! How are you?' }
    })
  } catch (e) {
    error = e
  }
  expect(logger.warn).toBeCalledWith('sms-provider-1', new Error('error provider 1'))
  expect(error).toEqual(new Error('error provider 1'))
})
