/* @flow */
/* global $PropertyType */
import logger from '../util/logger'
import Registry from '../util/registry'
import EmailProvider from './email'
import PushProvider from './push'
import SmsProvider from './sms'
import WebpushProvider from './webpush'
// Types
import type {ChannelType, OptionsType} from '../index'

type ChannelOptionsType = $PropertyType<OptionsType, 'channels'>

interface ProviderType {
  name: string;
  send(Object): Promise<string>;
}

type ContextType = {
  attempt?: number
}

export default class ProviderFactory {
  channels: ChannelOptionsType
  lastIndexUsedByChannel: {[ChannelType]: number} = {}

  constructor (channels: ChannelOptionsType) {
    this.channels = channels
  }

  get (channel: ChannelType, {attempt}: ContextType): ?ProviderType {
    const index = Math.max(0, attempt ? attempt - 1 : 0)
    if (this.channels && this.channels[channel]) {
      const channelConfig = this.channels[channel]
      const providerConfig = channelConfig.providers[index]
      if (channelConfig.multiProviderStrategy === 'roundrobin') {
        return this.getUsingRoundRobinStrategy(channel, index, channelConfig.providers.length)
      } else if (providerConfig) {
        return this.getProviderByIndex(channel, index)
      } else if (index === 0) {
        return this.getDefaultProvider(channel)
      } else {
        return null
      }
    } else {
      throw new Error(`Unknown channel "${channel}".`)
    }
  }

  getUsingRoundRobinStrategy (channel: ChannelType, index: number, channelProviderCount: number) {
    const nextIndex = this.lastIndexUsedByChannel[channel] !== undefined
      ? (this.lastIndexUsedByChannel[channel] + 1) % channelProviderCount
      : index
    this.lastIndexUsedByChannel[channel] = nextIndex
    return this.getProviderByIndex(channel, nextIndex)
  }

  getDefaultProvider (channel: ChannelType) {
    return this.getProviderByIndex(channel, 0, 'logger')
  }

  getProviderByIndex (channel: ChannelType, index: number, forceType?: string): ?ProviderType {
    if (this.channels && this.channels[channel]) {
      const providerConfig = this.channels[channel].providers[index]
      const type = forceType || providerConfig.type
      return Registry.getInstance(`${channel}-${type}-${index}`, () => {
        try {
          switch (channel) {
            case 'email':
              return new EmailProvider(type, providerConfig)
            case 'push':
              return new PushProvider(type, providerConfig)
            case 'sms':
              return new SmsProvider(type, providerConfig)
            case 'webpush':
              return new WebpushProvider(type, providerConfig)
          }
        } catch (error) {
          logger.error(error)
          return null
        }
      })
    }
  }
}
