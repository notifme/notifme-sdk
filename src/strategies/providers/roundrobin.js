/* @flow */
// "statefull" strategy
import strategyFallback from './fallback'
// Types
import type { StrategyType } from './index'

function rotate<T> (arr: T[], forward): T[] { // /!\ mute array, the mutation is "the state"
  if (forward) {
    arr.push(arr.shift())
  } else {
    arr.unshift(arr.pop())
  }
  return arr
}

const strategyProvidersFallback: StrategyType = (providers) => {
  const rotatedProviders = rotate(providers, false)
  return (request) => strategyFallback(rotate(rotatedProviders, true))(request)
}

// /!\ not equivalent to (providers) => strategyFallback(rotate(providers)) because of memoization

export default strategyProvidersFallback
