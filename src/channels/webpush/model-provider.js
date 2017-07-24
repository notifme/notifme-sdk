/* @flow */

export type WebpushProviderType = {
  gcm?: {
    gcmAPIKey?: string,
    vapidDetails: {
      subject: string,
      publicKey: string,
      privateKey: string
    },
    ttl?: number,
    headers?: {[string]: string | number | boolean}
  }
  // TODO: onesignal, urbanairship, goroost, sendpulse, wonderpush, appboy...
}
