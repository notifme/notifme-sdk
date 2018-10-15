/* @flow */
/* global $Keys */
import NotificationCatcherProvider from './providers/notificationCatcherProvider'
import Sender from './sender'
import logger from './util/logger'
import providerFactory from './providers'
import strategyProvidersFactory from './strategies/providers'
// Types
import type { EmailRequestType, PushRequestType, SmsRequestType, VoiceRequestType, WebpushRequestType, SlackRequestType } from './models/notification-request'
import type { EmailProviderType } from './models/provider-email'
import type { PushProviderType } from './models/provider-push'
import type { SmsProviderType } from './models/provider-sms'
import type { VoiceProviderType } from './models/provider-voice'
import type { WebpushProviderType } from './models/provider-webpush'
import type { SlackProviderType } from './models/provider-slack'
import type SenderType from './sender'

export const CHANNELS = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  voice: 'voice',
  webpush: 'webpush',
  slack: 'slack'
}
export type ChannelType = $Keys<typeof CHANNELS>

export type NotificationRequestType = {|
  metadata?: {
    id?: string,
    userId?: string
  },
  email?: EmailRequestType,
  push?: PushRequestType,
  sms?: SmsRequestType,
  voice?: VoiceRequestType,
  webpush?: WebpushRequestType,
  slack?: SlackRequestType
  // TODO?: other channels (slack, messenger, skype, telegram, kik, spark...)
|}

export type NotificationStatusType = {
  status: 'success' | 'error',
  channels?: {[channel: ChannelType]: {
    id: string,
    providerId: ?string
  }},
  info?: ?Object,
  errors?: {[channel: ChannelType]: Error}
}

export type ProviderStrategyType = 'no-fallback' | 'fallback' | 'roundrobin' // Defaults to fallback

export type OptionsType = {|
  channels?: {
    email?: {
      providers: EmailProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    push?: {
      providers: PushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    sms?: {
      providers: SmsProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    voice?: {
      providers: VoiceProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    webpush?: {
      providers: WebpushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    slack?: {
      providers: SlackProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    }
  },
  useNotificationCatcher?: boolean // if true channels are ignored
|}

export default class NotifmeSdk {
  sender: SenderType
  logger: typeof logger = logger

  constructor (options: OptionsType) {
    const mergedOptions = this.mergeWithDefaultConfig(options)
    const providers = providerFactory(mergedOptions.channels)
    const strategies = strategyProvidersFactory(mergedOptions.channels)

    this.sender = new Sender(Object.keys(CHANNELS), providers, strategies)
  }

  mergeWithDefaultConfig ({ channels, ...rest }: OptionsType) {
    return {
      useNotificationCatcher: false,
      ...rest,
      channels: rest.useNotificationCatcher
        ? NotificationCatcherProvider.getConfig(Object.keys(CHANNELS))
        : {
          email: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.email : null)
          },
          push: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.push : null)
          },
          sms: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.sms : null)
          },
          voice: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.voice : null)
          },
          webpush: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.webpush : null)
          },
          slack: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.slack : null)
          }
        }
    }
  }

  send (request: NotificationRequestType): Promise<NotificationStatusType> {
    return this.sender.send(request)
  }
}
