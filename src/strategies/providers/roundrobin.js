/* @flow */
// "statefull" strategy
import type {StrategyType} from './index'

import strategyFallback from './fallback'

function rotate<T> (arr: T[]): T[] { // /!\ mute array, the mutation is "the state"
  arr.unshift(arr.pop())
  return arr
}

const strategyProvidersFallback: StrategyType =
  (providers) => (request) => strategyFallback(rotate(providers))(request)

// /!\ not equivalent to (providers) => strategyFallback(rotate(providers)) because of memoization

export default strategyProvidersFallback
