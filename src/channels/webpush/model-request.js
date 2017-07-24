/* @flow */

export type WebpushRequestType = {
  actions?: {
    action: string,
    title: string,
    icon?: string
  }[], // C53
  badge?: string, // C53
  body: string, // C22 F22 S6
  dir?: 'auto' | 'rtl' | 'ltr', // C22 F22 S6
  icon?: string, // C22 F22
  image?: string, // C55 F22
  redirects?: {[key: string]: string}, // added for local tests
  requireInteraction?: boolean, // C22 F52
  title: string, // C22 F22 S6
}
