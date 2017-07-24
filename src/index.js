/* @flow */
import type {EmailProviderType} from './channels/email/model-provider'
import type {EmailRequestType} from './channels/email/model-request'
import type {PushProviderType} from './channels/push/model-provider'
import type {PushRequestType} from './channels/push/model-request'
import type {SmsProviderType} from './channels/sms/model-provider'
import type {SmsRequestType} from './channels/sms/model-request'
import type {WebpushProviderType} from './channels/webpush/model-provider'
import type {WebpushRequestType} from './channels/webpush/model-request'

/*
TODO:
  - enqueue received notification
  - dequeue notifications and send it to provider
  - retry request in case of failure
*/

type OptionsType = {
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

type RequestType = {
  email: EmailRequestType,
  push: PushRequestType,
  sms: SmsRequestType,
  webpush: WebpushRequestType
  // TODO: slack, messenger, skype, telegram, kik, spark...
}

class NotifmeSdk {
  options: OptionsType

  constructor (options: OptionsType) {
    this.options = options
  }

  send (request: RequestType) {
  }
}

module.exports = NotifmeSdk
