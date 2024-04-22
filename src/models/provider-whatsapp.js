/* @flow */
// Types
import type { WhatsappRequestType } from './notification-request'

export type WhatsappProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (SlackRequestType) => Promise<string>
} | {
  type: 'infobip',
  baseUrl: string,
  apiKey: string,
}
