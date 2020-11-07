/* @flow */
// Types
import type { TelegramRequestType } from './notification-request'

export type TelegramProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (TelegramRequestType) => Promise<string>
} | {
  type: 'webhook',
  webhookUrl?: string // Can be overriden in request
}
