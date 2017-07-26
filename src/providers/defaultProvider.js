/* @flow */
import logger from '../util/logger'
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
    logger.warn(`No provider for channel "${this.channel}"`)
    logger.info(`[${this.channel.toUpperCase()}] Sent by "${this.name}":`)
    logger.info(request)
    return true
  }
}
