/* @flow */

export type PushProviderType = {
  type: 'logger'
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
  apiKey: string
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
