/* @flow */
import logger from '../util/logger'
// Types
import type { ChannelType } from '../index'
import type { RequestType } from '../models/notification-request'

export default class LoggerProvider {
  id: string
  channel: ChannelType

  constructor (config: Object, channel: ChannelType) {
    this.id = `${channel}-logger-provider`
    this.channel = channel
  }

  async send (request: RequestType): Promise<string> {
    logger.info(`[${this.channel.toUpperCase()}] Sent by "${this.id}":`)
    logger.info(request)
    return `id-${Math.round(Math.random() * 1000000000)}`
  }
}
