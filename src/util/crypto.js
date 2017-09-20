/* @flow */
import crypto from 'crypto'

export function hmac (key: string | Buffer, data: string, encoding: 'hex' | 'latin1' | 'base64' | 'buffer') {
  return crypto.createHmac('sha256', key)
    .update(typeof data === 'string' ? Buffer.from(data) : data)
    .digest(encoding === 'buffer' ? undefined : encoding)
}

export function sha256 (data: string, encoding: 'hex' | 'latin1' | 'base64' | 'buffer') {
  return crypto.createHash('sha256')
    .update(typeof data === 'string' ? Buffer.from(data) : data)
    .digest(encoding === 'buffer' ? undefined : encoding)
}
