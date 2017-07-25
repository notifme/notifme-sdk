/* @flow */
/* global $PropertyType */
import DefaulProvider from './defaultProvider'
// Types
import type {ChannelType, OptionsType} from '../index'
import type {EmailRequestType, PushRequestType, SmsRequestType, WebpushRequestType} from '../model-request'

type ProviderOptionsType = $PropertyType<OptionsType, 'providers'>
type MultiProviderStrategyType = $PropertyType<OptionsType, 'multiProviderStrategy'>

interface ProviderType {
  name: string;
  send(EmailRequestType | PushRequestType | SmsRequestType | WebpushRequestType): Promise<boolean>;
}

export default class ProviderFactory {
  providers: ProviderOptionsType
  multiProviderStrategy: MultiProviderStrategyType

  constructor (providers: ProviderOptionsType, multiProviderStrategy: MultiProviderStrategyType) {
    this.providers = providers
    this.multiProviderStrategy = multiProviderStrategy
  }

  get (channel: ChannelType): ProviderType {
    // TODO: use multiProviderStrategy
    return this.providers && this.providers[channel] && this.providers[channel].length > 0
      ? this.getInstance(channel, 0)
      : new DefaulProvider(channel)
  }

  getInstance (channel: ChannelType, index: number): ProviderType {
    // TODO: generate and cache provider instance from this.providers[channel][index]
    return new DefaulProvider(channel)
  }
}
