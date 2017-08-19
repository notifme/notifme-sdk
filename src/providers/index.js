/* @flow */
import emailFactory from './email'
import pushFactory from './push'
import smsFactory from './sms'
import webpushFactory from './webpush'

import type {ChannelType} from '../index'

export type ChannelOptionsType = {[ChannelType]: {providers: Object[]}}

export interface ProviderType {
  id: string;
  send(Object): Promise<string>;
}

export type ProvidersType = {[ChannelType]: ProviderType[]};

export default function factory (channels: ChannelOptionsType): ProvidersType {
  return (Object.keys(channels): any).reduce((acc, key: ChannelType): ProvidersType => {
    switch (key) {
      case 'email':
        acc[key] = channels[key].providers.map((config) => emailFactory(config))
        break

      case 'sms':
        acc[key] = channels[key].providers.map((config) => smsFactory(config))
        break

      case 'push':
        acc[key] = channels[key].providers.map((config) => pushFactory(config))
        break

      case 'webpush':
        acc[key] = channels[key].providers.map((config) => webpushFactory(config))
        break
    }

    return acc
  }, {})
}
