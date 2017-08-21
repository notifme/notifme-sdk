/* @flow */
import emailFactory from './email'
import pushFactory from './push'
import smsFactory from './sms'
import webpushFactory from './webpush'
// Types
import type {ChannelType} from '../index'

export type ChannelOptionsType = {[ChannelType]: {providers: Object[]}}

export interface ProviderType {
  id: string;
  send(Object): Promise<string>;
}

export type ProvidersType = {[ChannelType]: ProviderType[]}

export default function factory (channels: ChannelOptionsType): ProvidersType {
  return (Object.keys(channels): any).reduce((acc, key: ChannelType): ProvidersType => {
    acc[key] = channels[key].providers.map((config) => {
      switch (key) {
        case 'email':
          return emailFactory(config)

        case 'sms':
          return smsFactory(config)

        case 'push':
          return pushFactory(config)

        case 'webpush':
          return webpushFactory(config)
      }
    })

    return acc
  }, {})
}
