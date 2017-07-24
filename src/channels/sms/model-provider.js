/* @flow */

export type SmsProviderType = {
  nexmo?: {
    apiKey: string,
    apiSecret: string,
    applicationId: string,
    privateKey: string
  },
  twilio?: {
    apiKey: string,
    apiSecret: string,
    applicationId: string,
    privateKey: string
  }
  // TODO: other SMS providers
}
