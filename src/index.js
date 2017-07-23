/* @flow */
import type {EmailRequestType} from './providers/email/model'
import type {PushRequestType} from './providers/push/model'
import type {SmsRequestType} from './providers/sms/model'
import type {WebpushRequestType} from './providers/webpush/model'

/*
TODO:
  - define provider configuration
  - enqueue received notification
  - dequeue notifications and send it to provider
  - retry request in case of failure
*/

type OptionsType = {}

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
