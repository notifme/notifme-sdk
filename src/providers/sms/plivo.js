/* @flow */
import Request from 'request-promise-native'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsPlivoProvider {
  id: string
  credentials: Object

  constructor (config: Object) {
    this.id = 'sms-plivo-provider'
    this.credentials = {authId: config.authId, authToken: config.authToken}
  }

  async send (request: SmsRequestType): Promise<string> {
    const {authId, authToken} = this.credentials
    try {
      const result = await Request
        .post(`https://api.plivo.com/v1/Account/${authId}/Message/`)
        .auth(authId, authToken,false)
        .json({
          'src': request.from,
          'dst': request.to,
          'text': (request: any).text
        })
      return result.message_uuid[0]
    } catch (error) {
      let errorMessage;
      if (error.statusCode == 401) {
        errorMessage = error.error;
      }else{
        errorMessage = error.error.error;
      }
      throw new Error(errorMessage)
    }
  }
}
