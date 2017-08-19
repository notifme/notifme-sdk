/* @flow */
import type {StrategyType} from './index'

import logger from '../../util/logger'

const strategyProvidersNoFallback: StrategyType =
  (providers) => async (request) => {
    try {
      const id = await providers[0].send(request)
      return {providerId: providers[0].id, id}
    } catch (error) {
      logger.warn(providers[0].id, error)
      error.providerId = providers[0].id
      throw error
    }
  }

export default strategyProvidersNoFallback
