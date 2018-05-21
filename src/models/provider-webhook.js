/* @flow */
// Types
import type {WebhookRequestType} from './notification-request'

export type WebhookProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (WebhookRequestType) => Promise<string>
} | {
  type: 'webhook',
  url?: string // Can be overriden in request
}
