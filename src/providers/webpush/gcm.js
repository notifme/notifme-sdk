/* @flow */
import webpush from 'web-push'
// Types
import type {WebpushRequestType} from '../../models/notification-request'

export default class WebpushGcmProvider {
  id: string
  options: Object

  constructor ({gcmAPIKey, vapidDetails, ttl, headers}: Object) {
    this.id = 'webpush-gcm-provider'
    this.options = {TTL: ttl, headers}
    if (gcmAPIKey) {
      webpush.setGCMAPIKey(gcmAPIKey)
    }
    if (vapidDetails) {
      const {subject, publicKey, privateKey} = vapidDetails
      webpush.setVapidDetails(subject, publicKey, privateKey)
    }
  }

  async send ({subscription, ...request}: WebpushRequestType): Promise<string> {
    const result = await webpush.sendNotification(subscription, JSON.stringify(request), this.options)
    return result.headers.location
  }
}
