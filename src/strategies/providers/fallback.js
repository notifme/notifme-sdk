/* @flow */
import type {ProviderType} from '../../providers'
import type {StrategyType} from './index'

import logger from '../../util/logger'

async function recursiveTry (providers: ProviderType[], request: any): Promise<{providerId: string, id: string}> {
  const [current, ...others] = providers

  try {
    const id = await current.send(request)
    return {providerId: current.id, id}
  } catch (error) {
    logger.warn(current.id, error)
    if (others.length === 0) { // the last one
      error.providerId = current.id
      throw error
    }

    return recursiveTry(others, request)
  }
}

const strategyProvidersFallback: StrategyType =
  (providers) => (request) => recursiveTry(providers, request)

export default strategyProvidersFallback
