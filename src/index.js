/* @flow */
/* global $Keys */
import Queue from './queue'
import Sender from './sender'
import logger from './util/logger'
// Types
import type {EmailRequestType, PushRequestType, SmsRequestType, WebpushRequestType} from './models/notification-request'
import type {EmailProviderType} from './models/provider-email'
import type {PushProviderType} from './models/provider-push'
import type {SmsProviderType} from './models/provider-sms'
import type {WebpushProviderType} from './models/provider-webpush'
import type {QueueType} from './queue'

export const channels = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  webpush: 'webpush'
}
export type ChannelType = $Keys<typeof channels>

export type NotificationRequestType = {|
  id?: string,
  email?: EmailRequestType,
  push?: PushRequestType,
  sms?: SmsRequestType,
  webpush?: WebpushRequestType
  // TODO: slack, messenger, skype, telegram, kik, spark...
|}

export type NotificationStatusType = {
  status: 'queued' | 'success' | 'error',
  [channel: ChannelType]: {
    id: string,
    providerId: ?string
  },
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
    webpush?: {
      providers: WebpushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    }
  },
  requestQueue?: false | 'in-memory' | QueueType<NotificationRequestType>,
  onError?: (NotificationStatusType, NotificationRequestType) => any
|}

export default class NotifmeSdk {
  sender: Sender
  logger: typeof logger = logger

  constructor ({channels, requestQueue, ...rest}: OptionsType) {
    this.sender = new Sender({
      ...rest,
      channels: {
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
        webpush: {
          providers: [],
          multiProviderStrategy: 'fallback',
          ...(channels ? channels.webpush : null)
        }
      },
      requestQueue: typeof requestQueue === 'string' ? new Queue(requestQueue) : requestQueue
    })
  }

  send (request: NotificationRequestType): Promise<NotificationStatusType> {
    return this.sender.handleRequest(request)
  }
}
