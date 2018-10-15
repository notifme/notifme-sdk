/* @flow */
import type { PushRequestType } from './notification-request'

export type PushProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (PushRequestType) => Promise<string>
} | {
  // Doc: https://github.com/node-apn/node-apn/blob/master/doc/provider.markdown
  type: 'apn', // Apple Push Notification
  token?: {
    key: string,
    keyId: string,
    teamId: string
  },
  cert?: string,
  key?: string,
  ca?: {filename: string}[],
  pfx?: string,
  passphrase?: string,
  production?: boolean,
  rejectUnauthorized?: boolean,
  connectionRetryLimit?: number
} | {
  // Doc: https://github.com/ToothlessGear/node-gcm
  type: 'fcm', // Firebase Cloud Messaging (previously called GCM, Google Cloud Messaging)
  id: string,
  phonegap?: boolean
} | {
  // Doc: https://github.com/tjanczuk/wns
  type: 'wns', // Windows Push Notification
  clientId: string,
  clientSecret: string,
  notificationMethod: string // sendTileSquareBlock, sendTileSquareImage...
} | {
  // Doc: https://github.com/umano/node-adm
  type: 'adm', // Amazon Device Messaging
  clientId: string,
  clientSecret: string
}
