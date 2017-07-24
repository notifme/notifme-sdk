/* @flow */

export type SmsRequestType = {
  from: string,
  to: string,
  userId?: string,
  nature?: 'marketing' | 'transactional',
  ttl?: number,
  messageClass?: 0 | 1 | 2 | 3
} & (
  {type?: 'text', text: string}
  | {type: 'unicode', text: string}
  | {type: 'binary', body: string, udh: string, protocolId: string}
  | {type: 'wappush', title: string, url: string, validity?: number}
  | {type: 'vcal', vcal: string}
  | {type: 'vcard', vcard: string}
)
