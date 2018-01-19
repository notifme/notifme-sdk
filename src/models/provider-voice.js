/* @flow */
import type {VoiceRequestType} from './notification-request'

// TODO?: other SMS providers
export type VoiceRequestType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (VoiceRequestType) => Promise<string>
} | {
  type: 'twilio',
  accountSid: string,
  authToken: string
}
