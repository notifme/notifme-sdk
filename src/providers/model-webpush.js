/* @flow */

// TODO: onesignal, urbanairship, goroost, sendpulse, wonderpush, appboy...
export type WebpushProviderType = {
  type: 'logger'
} | {
  type: 'gcm',
  gcmAPIKey?: string,
  vapidDetails: {
    subject: string,
    publicKey: string,
    privateKey: string
  },
  ttl?: number,
  headers?: {[string]: string | number | boolean}
}
