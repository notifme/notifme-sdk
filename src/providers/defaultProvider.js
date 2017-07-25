/* @flow */
// Types
import type {ChannelType} from '../index'
import type {EmailRequestType, PushRequestType, SmsRequestType, WebpushRequestType} from '../model-request'

export default class DefaulProvider {
  name: string
  channel: ChannelType

  constructor (channel: ChannelType) {
    this.name = `${channel}-default-provider`
    this.channel = channel
  }

  async send (request: EmailRequestType | PushRequestType | SmsRequestType | WebpushRequestType): Promise<boolean> {
    console.log(this.name, request)
    return false
  }
}
