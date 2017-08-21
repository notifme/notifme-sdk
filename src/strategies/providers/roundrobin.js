/* @flow */
// "statefull" strategy
import strategyFallback from './fallback'
// Types
import type {StrategyType} from './index'

function rotate<T> (arr: T[]): T[] { // /!\ mute array, the mutation is "the state"
  arr.unshift(arr.pop())
  return arr
}

const strategyProvidersFallback: StrategyType =
  (providers) => (request) => strategyFallback(rotate(providers))(request)

// /!\ not equivalent to (providers) => strategyFallback(rotate(providers)) because of memoization

export default strategyProvidersFallback
