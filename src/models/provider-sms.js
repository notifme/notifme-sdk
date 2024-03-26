/* @flow */
import type { SmsRequestType } from './notification-request'

// TODO?: other SMS providers
export type SmsProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (SmsRequestType) => Promise<string>
} | {
  type: '46elks',
  apiUsername: string,
  apiPassword: string
} | {
  type: 'callr',
  login: string,
  password: string
} | {
  type: 'clickatell',
  apiKey: string // One-way integration API key
} | {
  type: 'infobip',
  username: string,
  password: string
} | {
  type: 'nexmo',
  apiKey: string,
  apiSecret: string
} | {
  type: 'ovh',
  appKey: string,
  appSecret: string,
  consumerKey: string,
  account: string,
  host: string // https://github.com/ovh/node-ovh/blob/master/lib/endpoints.js
} | {
  type: 'plivo',
  authId: string,
  authToken: string
} | {
  type: 'twilio',
  accountSid: string,
  authToken: string
} | {
  type: 'seven',
  apiKey: string,
}
