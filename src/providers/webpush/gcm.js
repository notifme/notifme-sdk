/* @flow */
import webpush from 'web-push'
// Types
import type { WebpushRequestType } from '../../models/notification-request'

export default class WebpushGcmProvider {
  id: string = 'webpush-gcm-provider'
  options: Object

  constructor ({ gcmAPIKey, vapidDetails, ttl, headers }: Object) {
    this.options = { TTL: ttl, headers }
    if (gcmAPIKey) {
      webpush.setGCMAPIKey(gcmAPIKey)
    }
    if (vapidDetails) {
      const { subject, publicKey, privateKey } = vapidDetails
      webpush.setVapidDetails(subject, publicKey, privateKey)
    }
  }

  async send (request: WebpushRequestType): Promise<string> {
    const { subscription, ...rest } =
      request.customize ? (await request.customize(this.id, request)) : request
    const result = await webpush.sendNotification(subscription, JSON.stringify(rest), this.options)
    return result.headers.location
  }
}
