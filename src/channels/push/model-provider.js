/* @flow */

export type PushProviderType = {
  apn?: { // Apple Push Notification
    // Doc: https://github.com/node-apn/node-apn/blob/master/doc/provider.markdown
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
    connectionRetryLimit?: number,
  },
  fcm?: { // Firebase Cloud Messaging (previously called GCM, Google Cloud Messaging)
    apiKey: string
  },
  wns?: { // Windows Push Notification
    // Doc: https://github.com/tjanczuk/wns
    clientId: string,
    clientSecret: string,
    notificationMethod: string // sendTileSquareBlock, sendTileSquareImage...
  },
  adm?: { // Amazon Device Messaging
    // Doc: https://github.com/umano/node-adm
    clientId: string,
    clientSecret: string
  }
}
