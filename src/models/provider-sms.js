/* @flow */

// TODO?: other SMS providers
export type SmsProviderType = {
  type: 'logger'
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
  type: 'bulutfon',
  title: string,
  accessToken: string
}
