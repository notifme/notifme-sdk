/* @flow */
import Sender from './sender'
// Types
import type {EmailProviderType} from './channels/email/model-provider'
import type {EmailRequestType} from './channels/email/model-request'
import type {PushProviderType} from './channels/push/model-provider'
import type {PushRequestType} from './channels/push/model-request'
import type {SmsProviderType} from './channels/sms/model-provider'
import type {SmsRequestType} from './channels/sms/model-request'
import type {WebpushProviderType} from './channels/webpush/model-provider'
import type {WebpushRequestType} from './channels/webpush/model-request'

export type OptionsType = {
  requestQueue: false | 'in-memory',
  retryQueue: 'in-memory',
  providers: {
    email?: EmailProviderType[],
    push?: PushProviderType[],
    sms?: SmsProviderType[],
    webpush?: WebpushProviderType[]
  },
  multiProviderStrategy?: {['email' | 'push' | 'sms' | 'webpush']: {
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
  // TODO: response to define
  status: 'queued' | 'sent' | 'failed'
}

export default class NotifmeSdk {
  sender: Sender

  constructor (options: OptionsType) {
    this.sender = new Sender(options)
  }

  send (request: NotificationRequestType): NotificationStatusType {
    return this.sender.handleRequest(request)
  }
}
