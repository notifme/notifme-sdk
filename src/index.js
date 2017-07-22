/* @flow */
/*
TODO:
  - define notification model
  - define provider configuration
  - enqueue received notification
  - dequeue notifications and send it to provider
  - retry request in case of failure
*/

type OptionType = {}
type RequestType = {}

class NotifmeSdk {
  options: OptionType

  constructor (options: OptionType) {
    this.options = options
  }

  send (request: RequestType) {
  }
}

module.exports = NotifmeSdk
