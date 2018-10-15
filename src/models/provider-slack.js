/* @flow */
// Types
import type { SlackRequestType } from './notification-request'

export type SlackProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (SlackRequestType) => Promise<string>
} | {
  type: 'webhook',
  webhookUrl?: string // Can be overriden in request
}
