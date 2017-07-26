/* @flow */
/* global $Keys */
import Queue from './queue'
import Sender from './sender'
import logger from './util/logger'
// Types
import type {EmailRequestType, PushRequestType, SmsRequestType, WebpushRequestType} from './model-request'
import type {EmailProviderType} from './providers/model-email'
import type {PushProviderType} from './providers/model-push'
import type {SmsProviderType} from './providers/model-sms'
import type {WebpushProviderType} from './providers/model-webpush'
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
  email: EmailRequestType,
  push: PushRequestType,
  sms: SmsRequestType,
  webpush: WebpushRequestType
  // TODO: slack, messenger, skype, telegram, kik, spark...
|}

export type NotificationStatusType = {
  // TODO: response to complete
  status: 'queued' | 'success' | 'error',
  errors?: {[channel: ChannelType]: Error}
}

export type OptionsType = {|
  providers?: {
    email?: EmailProviderType[],
    push?: PushProviderType[],
    sms?: SmsProviderType[],
    webpush?: WebpushProviderType[]
  },
  multiProviderStrategy?: {[ChannelType]: {
    type: 'fallback' | 'roundrobin' // Defaults to fallback
  }},
  requestQueue?: false | 'in-memory' | QueueType<NotificationRequestType>,
  onError?: (NotificationStatusType, NotificationRequestType) => any
|}

export default class NotifmeSdk {
  sender: Sender
  logger: typeof logger = logger

  constructor (options: OptionsType) {
    this.sender = new Sender({
      ...options,
      requestQueue: typeof options.requestQueue === 'string'
        ? new Queue(options.requestQueue)
        : options.requestQueue
    })
  }

  send (request: NotificationRequestType): Promise<NotificationStatusType> {
    return this.sender.handleRequest(request)
  }
}
