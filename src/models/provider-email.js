/* @flow */
import type { EmailRequestType } from './notification-request'

// TODO?: provider APIs (SES, sendinblue, mailjet, mandrill, elasticemail...)
export type EmailProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (EmailRequestType) => Promise<string>
} | {
  // Doc: https://nodemailer.com/transports/sendmail/
  type: 'sendmail',
  sendmail: true,
  path: string, // Defaults to 'sendmail'
  newline: 'windows' | 'unix', // Defaults to 'unix'
  args?: string[],
  attachDataUrls?: boolean,
  disableFileAccess?: boolean,
  disableUrlAccess?: boolean
} | {
  // General options (Doc: https://nodemailer.com/smtp/)
  type: 'smtp',
  port?: 25 | 465 | 587, // Defaults to 587
  host?: string, // Defaults to 'localhost'
  auth: {
    type?: 'login',
    user: string,
    pass: string
  } | {
    type: 'oauth2', // Doc: https://nodemailer.com/smtp/oauth2/#oauth-3lo
    user: string,
    clientId?: string,
    clientSecret?: string,
    refreshToken?: string,
    accessToken?: string,
    expires?: string,
    accessUrl?: string
  } | {
    type: 'oauth2', // Doc: https://nodemailer.com/smtp/oauth2/#oauth-2lo
    user: string,
    serviceClient: string,
    privateKey?: string
  },
  authMethod?: string, // Defaults to 'PLAIN'
  // TLS options (Doc: https://nodemailer.com/smtp/#tls-options)
  secure?: boolean,
  tls?: Object, // Doc: https://nodejs.org/api/tls.html#tls_class_tls_tlssocket
  ignoreTLS?: boolean,
  requireTLS?: boolean,
  // Connection options (Doc: https://nodemailer.com/smtp/#connection-options)
  name?: string,
  localAddress?: string,
  connectionTimeout?: number,
  greetingTimeout?: number,
  socketTimeout?: number,
  // Debug options (Doc: https://nodemailer.com/smtp/#debug-options)
  logger?: boolean,
  debug?: boolean,
  // Security options (Doc: https://nodemailer.com/smtp/#security-options)
  disableFileAccess?: boolean,
  disableUrlAccess?: boolean,
  // Pooling options (Doc: https://nodemailer.com/smtp/pooled/)
  pool?: boolean,
  maxConnections?: number,
  maxMessages?: number,
  rateDelta?: number,
  rateLimit?: number,
  // Proxy options (Doc: https://nodemailer.com/smtp/proxies/)
  proxy?: string
} | {
  type: 'mailgun',
  apiKey: string,
  domainName: string
} | {
  type: 'mandrill',
  apiKey: string
} | {
  type: 'sendgrid',
  apiKey: string
} | {
  type: 'ses',
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken?: ?string
} | {
  type: 'sparkpost',
  apiKey: string
}
