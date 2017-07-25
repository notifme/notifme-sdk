/* @flow */
/* global $Keys */
import Sender from './sender'
import logger from './util/logger'
// Types
import type {EmailProviderType} from './providers/model-email'
import type {PushProviderType} from './providers/model-push'
import type {SmsProviderType} from './providers/model-sms'
import type {WebpushProviderType} from './providers/model-webpush'
import type {EmailRequestType, PushRequestType, SmsRequestType, WebpushRequestType} from './model-request'

export const channels = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  webpush: 'webpush'
}
export type ChannelType = $Keys<typeof channels>

export type OptionsType = {
  requestQueueType?: false | 'in-memory',
  retryQueueType?: 'in-memory',
  providers?: {
    email?: EmailProviderType[],
    push?: PushProviderType[],
    sms?: SmsProviderType[],
    webpush?: WebpushProviderType[]
  },
  multiProviderStrategy?: {[ChannelType]: {
    type: 'fallback' | 'roundrobin' // Defaults to fallback
  }}
}

export type NotificationRequestType = {
  email: EmailRequestType,
  push: PushRequestType,
  sms: SmsRequestType,
  webpush: WebpushRequestType
  // TODO: slack, messenger, skype, telegram, kik, spark...
}

export type NotificationStatusType = {
  // TODO: response to complete
  status: 'queued' | 'sent' | 'failed'
}

export default class NotifmeSdk {
  sender: Sender
  logger: typeof logger = logger

  constructor (options: OptionsType) {
    this.sender = new Sender(options)
  }

  send (request: NotificationRequestType): Promise<NotificationStatusType> {
    return this.sender.handleRequest(request)
  }
}
