/* @flow */
import type {ProviderType, ChannelOptionsType} from '../../providers'
import type {ChannelType} from '../../index'

import strategyFallback from './fallback'

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

      default:
        acc[key] = optionStrategy // TODO if typeof function else error
    }

    return acc
  }, {})
}
