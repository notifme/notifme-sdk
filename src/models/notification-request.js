/* @flow */

type CommonRequestType = {
  id?: string,
  userId?: string
}

export type EmailRequestType = CommonRequestType & {
  from: string,
  to: string,
  subject: string,
  cc?: string,
  bcc?: string,
  replyTo?: string,
  text?: string,
  html?: string,
  attachments?: {
    contentType: string,
    filename: string,
    content: string | Buffer
    // path?: string,
    // href?: string,
    // contentDisposition?: string,
    // contentTransferEncoding?: string,
    // cid?: string,
    // raw?: string,
    // encoding?: string,
    // headers?: {[string]: string | number | boolean}
  }[],
  headers?: {[string]: string | number | boolean}
}

export type PushRequestType = CommonRequestType & {
  registrationToken: string,
  title: string,
  body: string,
  custom?: Object,
  priority?: 'high' | 'normal', // gcm, apn. Will be translated to 10 and 5 for apn. Defaults to 'high'
  collapseKey?: string, // gcm for android, used as collapseId in apn
  contentAvailable?: boolean, // gcm for android
  delayWhileIdle?: boolean, // gcm for android
  restrictedPackageName?: string, // gcm for android
  dryRun?: boolean, // gcm for android
  icon?: string, // gcm for android
  tag?: string, // gcm for android
  color?: string, // gcm for android
  clickAction?: string, // gcm for android. In ios, category will be used if not supplied
  locKey?: string, // gcm, apn
  bodyLocArgs?: string, // gcm, apn
  titleLocKey?: string, // gcm, apn
  titleLocArgs?: string, // gcm, apn
  retries?: number, // gcm, apn
  encoding?: string, // apn
  badge?: number, // gcm for ios, apn
  sound?: string, // gcm, apn
  alert?: string | Object, // apn, will take precedence over title and body
  titleLocKey?: string, // apn and gcm for ios
  titleLocArgs?: string, // apn and gcm for ios
  launchImage?: string, // apn and gcm for ios
  action?: string, // apn and gcm for ios
  topic?: string, // apn and gcm for ios
  category?: string, // apn and gcm for ios
  contentAvailable?: string, // apn and gcm for ios
  mdm?: string, // apn and gcm for ios
  urlArgs?: string, // apn and gcm for ios
  truncateAtWordEnd?: boolean, // apn and gcm for ios
  mutableContent?: number, // apn
  expiry?: number, // seconds
  timeToLive?: number, // if both expiry and timeToLive are given, expiry will take precedency
  headers?: {[string]: string | number | boolean}, // wns
  launch?: string, // wns
  duration?: string, // wns
  consolidationKey?: string // ADM
}

export type SmsRequestType = CommonRequestType & {
  from: string,
  to: string,
  text: string,
  type?: 'text' | 'unicode', // Defaults to 'text'
  nature?: 'marketing' | 'transactional',
  ttl?: number,
  messageClass?: 0 | 1 | 2 | 3
// } & (
//   {type?: 'text', text: string}
//   | {type: 'unicode', text: string}
//   | {type: 'binary', body: string, udh: string, protocolId: string}
//   | {type: 'wappush', title: string, url: string, validity?: number}
//   | {type: 'vcal', vcal: string}
//   | {type: 'vcard', vcard: string}
// )
}

export type WebpushRequestType = CommonRequestType & {
  subscription: {
    endpoint: string,
    keys: {
      auth: string,
      p256dh: string
    }
  },
  title: string, // C22 F22 S6
  body: string, // C22 F22 S6
  actions?: {
    action: string,
    title: string,
    icon?: string
  }[], // C53
  badge?: string, // C53
  dir?: 'auto' | 'rtl' | 'ltr', // C22 F22 S6
  icon?: string, // C22 F22
  image?: string, // C55 F22
  redirects?: {[key: string]: string}, // added for local tests
  requireInteraction?: boolean // C22 F52
}
