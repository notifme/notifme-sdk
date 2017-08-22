/* @flow */
import type {SmsRequestType} from './notification-request'

// TODO?: other SMS providers
export type SmsProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (SmsRequestType) => Promise<string>
} | {
  type: 'nexmo',
  apiKey: string,
  apiSecret: string
} | {
  type: 'twilio',
  accountSid: string,
  authToken: string
} | {
  type: '46elks',
  apiUsername: string,
  apiPassword: string
} | {
  type: 'plivo',
  authId: string,
  authToken: string
} | {
  type: 'clickatell',
  apiKey: string // One-way integration API key
} | {
  type: 'infobip',
  username: string,
  password: string
} | {
  type: 'callr',
  login: string,
  password: string
}
