
export type EmailRequestType = {
  from: string,
  to: string,
  subject: string,
  cc?: string,
  bcc?: string,
  replyTo?: string,
  text?: string,
  html?: string,
  attachments?: {
    contentType?: string,
    filename?: string,
    content?: string,
    path?: string,
    href?: string,
    contentDisposition?: string,
    contentTransferEncoding?: string,
    cid?: string,
    raw?: string,
    encoding?: string,
    headers?: {[string]: string | number | boolean}
  }[],
  headers?: {[string]: string | number | boolean}
}
