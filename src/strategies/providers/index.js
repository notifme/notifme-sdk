/* @flow */
import type {ProviderType, ChannelOptionsType} from '../../providers'
import type {ChannelType} from '../../index'

import strategyFallback from './fallback'
import strategyNoFallback from './no-fallback'

export type StrategyType = (providers: ProviderType[]) => (request: any) => Promise<{
  providerId: string,
  id: string
}>
export type StrategiesType = {[ChannelType]: StrategyType};

export default function factory (channels: ChannelOptionsType): StrategiesType {
  return (Object.keys(channels): any).reduce((acc, key: ChannelType): StrategiesType => {
    const optionStrategy = (channels[key]: any).multiProviderStrategy
    switch (optionStrategy) {
      case 'fallback':
        acc[key] = strategyFallback
        break

      case 'no-fallback':
        acc[key] = strategyNoFallback
        break

      default:
        if (typeof optionStrategy !== 'function') {
          throw new Error(`strategy must be a funtion or fallback|roundrobin|no-fallback, ${optionStrategy} is not a valid strategy`)
        }
        acc[key] = optionStrategy
    }

    return acc
  }, {})
}
