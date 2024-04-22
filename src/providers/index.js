/* @flow */
import emailFactory from './email'
import pushFactory from './push'
import smsFactory from './sms'
import voiceFactory from './voice'
import webpushFactory from './webpush'
import slackFactory from './slack'
import whatsappFactory from './whatsapp'
// Types
import type { ChannelType } from '../index'
import type { RequestType } from '../models/notification-request'

export type ChannelOptionsType = {[ChannelType]: {providers: Object[]}}

export interface ProviderType {
  id: string;
  send(RequestType): Promise<string>;
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

        case 'voice':
          return voiceFactory(config)

        case 'push':
          return pushFactory(config)

        case 'webpush':
          return webpushFactory(config)

        case 'slack':
          return slackFactory(config)

        case 'whatsapp':
          return whatsappFactory(config)

        default:
          return config
      }
    })

    return acc
  }, {})
}
