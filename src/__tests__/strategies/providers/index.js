/* @flow */
/* global test, expect */
import strategyProvidersFactory from '../../../strategies/providers'
import strategyFallback from '../../../strategies/providers/fallback'
import strategyNoFallback from '../../../strategies/providers/no-fallback'
import strategyRoundrobin from '../../../strategies/providers/roundrobin'

test('Strategy provider factory should replace provider key with its corresponding function.', () => {
  const customStrategy = () => {}
  expect(strategyProvidersFactory({
    email: {
      providers: [],
      multiProviderStrategy: 'no-fallback'
    },
    sms: {
      providers: [],
      multiProviderStrategy: 'fallback'
    },
    push: {
      providers: [],
      multiProviderStrategy: 'roundrobin'
    },
    webpush: {
      providers: [],
      multiProviderStrategy: customStrategy
    }
  })).toEqual({
    email: strategyNoFallback,
    sms: strategyFallback,
    push: strategyRoundrobin,
    webpush: customStrategy
  })
})

test('Strategy provider factory should throw an error if the strategy does not exist.', () => {
  expect(() => {
    strategyProvidersFactory({
      email: {
        providers: [],
        multiProviderStrategy: 'unknown-strategy'
      }
    })
  }).toThrow('"unknown-strategy" is not a valid strategy. Strategy must be a function or fallback|no-fallback|roundrobin.')
})
