/* @flow */
import fetch from 'node-fetch'
import crypto from 'crypto'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsOvhProvider {
  id: string = 'sms-ovh-provider'
  timestamp: int = Math.round(Date.now() / 1000)
  credentials: Object

  constructor (config: Object) {
    this.credentials = {appKey: config.appKey, appSecret: config.appSecret, consumerKey: config.consumerKey, account: config.account}
  }
  
  signRequest (httpMethod: String, url: String, body: String) {
    
    let s = [
      this.credentials.appSecret,
      this.credentials.consumerKey,
      httpMethod,
      url,
      body,
      this.timestamp
    ];

    return '$1$' + crypto.createHash('sha1').update(s.join('+')).digest('hex');
  }

  /*
   * Note: read this tutorial to create credentials on Ovh.com : https://www.ovh.com/fr/g1639.envoyer_des_sms_avec_lapi_ovh_en_php#mise_en_place_de_lenvironnement_creation_des_identifiants
   */
  async send (request: SmsRequestType): Promise<string> {
    const {appKey, consumerKey, account} = this.credentials
    
    //see options here : https://api.ovh.com/console/#/sms/%7BserviceName%7D/jobs#POST
    //host param : We do not expect an endpoint like ovh sdk, but a host, read more about aliased endpoints : https://github.com/ovh/node-ovh/blob/master/lib/endpoints.js
    const {from, to, text, smsClass, coding, differedPeriod, noStopClause, priority, receiversDocumentUrl, receiversSlotId, senderForResponse, tag, validityPeriod, host} = request

    const body = JSON.stringify({
      'sender': from || null,
      'message': text,
      'receivers': [ to ],
	    'charset': 'UTF-8',
	    'class': smsClass || 'phoneDisplay',
	    'coding': coding || '7bit',
	    'noStopClause': (typeof noStopClause !== 'undefined')? noStopClause : true,
	    'priority': priority || 'high',
	    'senderForResponse': (typeof senderForResponse !== 'undefined')? senderForResponse : true,
	    'validityPeriod': validityPeriod || 2880,
	    'differedPeriod': differedPeriod || null,
	    'receiversDocumentUrl': receiversDocumentUrl || null,
	    'receiversSlotId': receiversSlotId || null,
	    'tag': tag || null
    })
 
    const reqBody = body.replace(/[\u0080-\uFFFF]/g, (m) => {
      return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
    });
    
    const apiHost = host || 'eu.api.ovh.com';
    
    const url = `https://${apiHost}/1.0/sms/${account}/jobs/`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Ovh-Timestamp': this.timestamp,
        'X-Ovh-Signature': this.signRequest('POST', url, reqBody),
        'X-Ovh-Consumer': consumerKey,
        'X-Ovh-Application': appKey,
        'Content-Length': reqBody.length,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: body
    })

    const responseBody = await response.json()
    
    if (response.ok) {
      return responseBody.ids[0]
    } else {
      throw new Error(`${response.status} - ${responseBody.message}`)
    }
  }
}
