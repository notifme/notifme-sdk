<p align="center">
  <a href="https://www.notif.me">
    <img alt="Notif.me" src="https://notifme.github.io/notifme-sdk/img/logo.png" />
  </a>
</p>

<p align="center">
  A Node.js library to send all kinds of transactional notifications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/notifme-sdk"><img alt="npm-status" src="https://img.shields.io/npm/v/notifme-sdk.svg?style=flat" /></a>
  <a href="https://codeclimate.com/github/notifme/notifme-sdk/test_coverage"><img src="https://api.codeclimate.com/v1/badges/2d2cc6d915094ddb50b7/test_coverage" /></a>
  <a href="https://github.com/notifme/notifme-sdk/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat" /></a>
  <a href="https://slackin-notifme.now.sh"><img alt="slack" src="https://img.shields.io/badge/Slack-Join_us!-e01563.svg?style=flat" /></a>
</p>

- [Features](#features)
- [Getting started](#getting-started)
- [How to use](#how-to-use)
  - [1. General options](#1-general-options)
  - [2. Providers](#2-providers)
  - [3. Custom channels](#3-custom-channels)
  - [4. Send a notification](#4-send-a-notification)
  - [5. In production](#5-in-production)
- [Contributing](#contributing)
- [Need help? Found a bug?](#need-help-found-a-bug)
- [Related Projects](#related-projects)

## Features

* **Easy channel integration** — Want to start sending `emails` | `SMS` | `pushes` | `webpushes` | `slack`? Do so in no time!

* **Unique documentation** — Don't look everywhere for the parameters you need to pass, just do it once. **Switching provider becomes a no-brainer**.

* **Multiple providers strategies** — Want to use more than one provider? Use `fallback` and `round-robin` strategies out of the box.

* **Tools for local testing** — Run a catcher locally to intercept all your notifications and display them in a web interface.

* **MIT license** — Use it like you want.

## Getting Started

```shell
$ yarn add notifme-sdk
```

```javascript
import NotifmeSdk from 'notifme-sdk'

const notifmeSdk = new NotifmeSdk({}) // empty config = all providers are set to console.log
notifmeSdk
  .send({sms: {from: '+15000000000', to: '+15000000001', text: 'Hello, how are you?'}})
  .then(console.log)
```

:sparkles: Congratulations, you should see the following lines in your console:

![Getting started SMS log](https://notifme.github.io/notifme-sdk/img/getting-started-sms-log.png)
<br><br>

### [Recommended] Setup Notification Catcher for your local tests

[Notification Catcher](https://github.com/notifme/catcher) is a web interface for viewing and testing notifications during development.

```shell
$ yarn add --dev notification-catcher
$ yarn run notification-catcher
```

```javascript
import NotifmeSdk from 'notifme-sdk'

const notifmeSdk = new NotifmeSdk({
  useNotificationCatcher: true // <= this sends all your notifications to the catcher running on port 1025
})
notifmeSdk
  .send({sms: {from: '+15000000000', to: '+15000000001', text: 'Hello, how are you?'}})
  .then(console.log)
```

:heart_eyes_cat: Open [http://localhost:1080](http://localhost:1080) on your favorite browser, you should see the notification:

![Getting started SMS catcher](https://notifme.github.io/notifme-sdk/img/getting-started-sms-catcher.png)

#### Custom connection settings

If you have the Notification Catcher running on a custom port, domain, or you need to change any other connection setting, set the environment variable `NOTIFME_CATCHER_OPTIONS` with your [custom connection smtp url](https://nodemailer.com/smtp/).

```shell
$ # Example
$ NOTIFME_CATCHER_OPTIONS=smtp://127.0.0.1:3025?ignoreTLS=true node your-script-using-notifme.js
```

## How to use

- [1. General options](#1-general-options)
- [2. Providers](#2-providers)
- [3. Custom channels](#3-custom-channels)
- [4. Send a notification](#4-send-a-notification)
- [5. In production](#5-in-production)

### 1. General options

```javascript
new NotifmeSdk({
  channels: ..., // Object
  useNotificationCatcher: ... // boolean
})
```

| Option name | Required | Type | Description |
| --- | --- | --- | --- |
| `channels` | `false` | `Object` | Define `providers` (`Array`) and `multiProviderStrategy` (`string`) for each channel (email, sms, push, webpush, slack).<br><br>See all details below: [2. Providers](#2-providers). |
| `useNotificationCatcher` | `false` | `boolean` | If true, all your notifications are sent to the catcher running on localhost:1025 (channels option will be completely ignored!) |

#### Complete examples

```javascript
// Env: development
new NotifmeSdk({
  useNotificationCatcher: true
})

// Env: production
new NotifmeSdk({
  channels: {
    email: {
      // If "Provider1" fails, use "Provider2"
      multiProviderStrategy: 'fallback',
      providers: [{
        type: 'Provider1',
        // ...credentials
      }, {
        type: 'Provider2',
        // ...credentials
      }]
    },
    sms: {
      // Use "Provider1" and "Provider2" in turns (and fallback if error)
      multiProviderStrategy: 'roundrobin',
      providers: [{
        type: 'Provider1',
        // ...credentials
      }, {
        type: 'Provider2',
        // ...credentials
      }]
    }
  }
})
```

#### HTTP proxy option

If you want to use a HTTP proxy, set an environment variable `NOTIFME_HTTP_PROXY`.

```shell
$ # Example
$ NOTIFME_HTTP_PROXY=http://127.0.0.1:8580 node your-script-using-notifme.js
```

### 2. Providers

#### Email providers

<details><summary>Logger <i>(for development)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})
```

</p></details>
<details><summary>SMTP <i>(can be used for almost all providers)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'smtp',
        host: 'smtp.example.com',
        port: 465,
        secure: true,
        auth: {
          user: 'xxxxx',
          pass: 'xxxxx'
        }
      }]
    }
  }
})
```

</p></details>
<details><summary>Sendmail</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'sendmail',
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
      }]
    }
  }
})
```

</p></details>
<details><summary>Mailgun</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'mailgun',
        apiKey: 'xxxxx',
        domainName: 'example.com'
      }]
    }
  }
})
```

</p></details>
<details><summary>Mandrill</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'mandrill',
        apiKey: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>Sendgrid</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'sendgrid',
        apiKey: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>SES</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'ses',
        region: 'xxxxx',
        accessKeyId: 'xxxxx',
        secretAccessKey: 'xxxxx',
        sessionToken: 'xxxxx' // optional
      }]
    }
  }
})
```

</p></details>
<details><summary>SparkPost</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'sparkpost',
        apiKey: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>Custom <i>(define your own)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    email: {
      providers: [{
        type: 'custom',
        id: 'my-custom-email-provider...',
        send: async (request) => {
          // Send email
          return 'id...'
        }
      }]
    }
  }
})
```

`request` being of [the following type](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L8-L31).

</p></details>
<br>

See all options: [Email provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-email.js)

#### SMS providers

<details><summary>Logger <i>(for development)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})
```

</p></details>
<details><summary>46elks</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: '46elks',
        apiUsername: 'xxxxx',
        apiPassword: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>Callr</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'callr',
        login: 'xxxxx',
        password: 'xxxxx'
      }]
    }
  }
})
```
</p></details>
<details><summary>Clickatell</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'clickatell',
        apiKey: 'xxxxx' // One-way integration API key
      }]
    }
  }
})
```
</p></details>
<details><summary>Infobip</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'infobip',
        username: 'xxxxx',
        password: 'xxxxx'
      }]
    }
  }
})
```
</p></details>
<details><summary>Nexmo</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'nexmo',
        apiKey: 'xxxxx',
        apiSecret: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>OVH</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'ovh',
        appKey: 'xxxxx',
        appSecret: 'xxxxx',
        consumerKey: 'xxxxx',
        account: 'xxxxx',
        host: 'xxxxx' // https://github.com/ovh/node-ovh/blob/master/lib/endpoints.js
      }]
    }
  }
})
```

</p></details>
<details><summary>Plivo</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'plivo',
        authId: 'xxxxx',
        authToken: 'xxxxx'
      }]
    }
  }
})
```
</p></details>
<details><summary>Twilio</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'twilio',
        accountSid: 'xxxxx',
        authToken: 'xxxxx'
      }]
    }
  }
})
```

</p></details>

<details><summary>Seven</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'seven',
        apiKey: 'xxxxx'
      }]
    }
  }
})
```

</p></details>

<details><summary>Custom <i>(define your own)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    sms: {
      providers: [{
        type: 'custom',
        id: 'my-custom-sms-provider...',
        send: async (request) => {
          // Send SMS
          return 'id...'
        }
      }]
    }
  }
})
```

`request` being of [the following type](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L76-L92).

</p></details>
<br>

See all options: [SMS provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-sms.js)

#### Voice providers

<details><summary>Logger <i>(for development)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    voice: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})
```
</p></details>
<details><summary>Twilio</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    voice: {
      providers: [{
        type: 'twilio',
        accountSid: 'xxxxx',
        authToken: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>Custom <i>(define your own)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    voice: {
      providers: [{
        type: 'custom',
        id: 'my-custom-voice-provider...',
        send: async (request) => {
          // Send Voice
          return 'id...'
        }
      }]
    }
  }
})
```

`request` being of [the following type](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L94-L111).

</p></details>
<br>

See all options: [Voice provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-voice.js)

#### Push providers

<details><summary>Logger <i>(for development)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    push: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})
```

</p></details>
<details><summary>APN (Apple Push Notification)</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    push: {
      providers: [{
        type: 'apn',
        token: {
          key: './certs/key.p8',
          keyId: 'xxxxx',
          teamId: 'xxxxx'
        }
      }]
    }
  }
})
```

</p></details>
<details><summary>FCM (Firebase Cloud Messaging, previously called GCM, Google Cloud Messaging)</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    push: {
      providers: [{
        type: 'fcm',
        id: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>WNS (Windows Push Notification)</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    push: {
      providers: [{
        type: 'wns',
        clientId: 'xxxxx',
        clientSecret: 'xxxxx',
        notificationMethod: 'sendTileSquareBlock'
      }]
    }
  }
})
```

</p></details>
<details><summary>ADM (Amazon Device Messaging)</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    push: {
      providers: [{
        type: 'adm',
        clientId: 'xxxxx',
        clientSecret: 'xxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>Custom <i>(define your own)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    push: {
      providers: [{
        type: 'custom',
        id: 'my-custom-push-provider...',
        send: async (request) => {
          // Send push
          return 'id...'
        }
      }]
    }
  }
})
```

`request` being of [the following type](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L33-L74).

</p></details>
<br>

See all options: [Push provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-push.js)

#### Webpush providers

<details><summary>Logger <i>(for development)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    webpush: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})
```

</p></details>
<details><summary>GCM (Google Cloud Messaging) - uses W3C endpoints if possible</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    webpush: {
      providers: [{
        type: 'gcm',
        gcmAPIKey: 'xxxxx',
        vapidDetails: {
          subject: 'mailto: contact@example.com',
          publicKey: 'xxxxx',
          privateKey: 'xxxxx'
        }
      }]
    }
  }
})
```

</p></details>
<details><summary>Custom <i>(define your own)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    webpush: {
      providers: [{
        type: 'custom',
        id: 'my-custom-webpush-provider...',
        send: async (request) => {
          // Send webpush
          return 'id...'
        }
      }]
    }
  }
})
```

`request` being of [the following type](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L113-L134).

</p></details>
<br>

See all options: [Webpush provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-webpush.js)

#### Slack providers

<details><summary>Logger <i>(for development)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    slack: {
      providers: [{
        type: 'logger'
      }]
    }
  }
})
```

</p></details>
<details><summary>Slack</summary><p>

```javascript
new NotifmeSdk({
  channels: {
    slack: {
      providers: [{
        type: 'webhook',
        webhookUrl: 'https://hooks.slack.com/services/Txxxxxxxx/Bxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx'
      }]
    }
  }
})
```

</p></details>
<details><summary>Custom <i>(define your own)</i></summary><p>

```javascript
new NotifmeSdk({
  channels: {
    slack: {
      providers: [{
        type: 'custom',
        id: 'my-custom-slack-provider...',
        send: async (request) => {
          // Send slack
          return 'id...'
        }
      }]
    }
  }
})
```

`request` being of [the following type](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L136-L138).

</p></details>
<br>

See all options: [Slack provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-slack.js)

#### Multi-provider strategies

A multi-provider strategy allows you to customize the send process on a channel.

##### Predefined strategies

| Strategy name | Description |
| --- | --- |
| `fallback` | If the used provider returns an error, try the next in the list. |
| `roundrobin` | Use every provider in turns. If one of them returns an error, fallback to the next. |
| `no-fallback` | Deactivates fallback strategy. |

##### Custom

You can also provide your own strategy. You have to pass a function implementing:

```javascript
(Provider[]) => Sender
// See examples below for more details
```

Examples:

<details><summary>Random strategy</summary><p>

```javascript
/*
 * `providers` is an array containing all the instances that were
 * created from your configuration.
 */
const randomStrategy = (providers) => async (request) => {
  // Choose one provider at random
  const provider = providers[Math.floor(Math.random() * providers.length)];

  try {
    const id = await provider.send(request)
    return {id, providerId: provider.id}
  } catch (error) {
    error.providerId = provider.id
    throw error
  }
}

new NotifmeSdk({
  channels: {
    email: { // Example for email channel
      providers: [...],
      multiProviderStrategy: randomStrategy
    }
  }
})
```
</p></details>
<details><summary>Cheap SMS strategy with fallback</summary><p>

```javascript
import strategyFallback from 'notifme-sdk/lib/strategies/fallback'

function getCountryFromNumber(number) {
  // extract the country from a phone number (+33670707070) -> 'fr'
}
function orderProvidersByPrice(country, providers) {
  // giving a country return an array of ordered providers by price
}

const smsCheapStrategy = (providers) => async (request) => {
  const country = getCountryFromNumber(request.from)
  const providersOrdered = orderProvidersByPrice(country, providers)

  return strategyFallback(providersOrdered)(request)
}
```
</p></details>
<br>

#### Adding a provider or a channel

If you would like to see another provider or channel, please [upvote the corresponding issue](https://github.com/notifme/notifme-sdk/issues) (or create one if it does not exist yet).

### 3. Custom channels

If you want to have custom channels (and providers) you can add them.

Example:

<details><summary>Custom channel and provider</summary><p>

```
new NotifmeSdk({
  channels: {
    socket: {
      multiProviderStrategy: 'fallback',
      providers: [
        {
          type: 'custom',
          id: 'my-socket-sender',
          send: async () => {
            return 'custom-socket-id'
          }
        }
      ]
    }
  }
})
```

</p></details>

### 4. Send a notification

#### Parameters

_New: you can check [notifme-template](https://github.com/notifme/notifme-template) to help you define your templates._

<details><summary>Send an email</summary><p>

```javascript
notifmeSdk.send({
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L8).

</p></details>
<details><summary>Send a SMS</summary><p>

```javascript
notifmeSdk.send({
  sms: {
    from: '+15000000000',
    to: '+15000000001',
    text: 'Hello John! How are you?'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L76).

</p></details>
<details><summary>Call using Voice</summary><p>

```javascript
notifmeSdk.send({
  voice: {
    from: '+15000000000',
    to: '+15000000001',
    url: 'http://demo.twilio.com/docs/voice.xml'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L94).

</p></details>
<details><summary>Send a push</summary><p>

```javascript
notifmeSdk.send({
  push: {
    registrationToken: 'xxxxx',
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L33).

</p></details>
<details><summary>Send a webpush</summary><p>

```javascript
notifmeSdk.send({
  webpush: {
    subscription: {
      keys: {
        auth: 'xxxxx',
        p256dh: 'xxxxx'
      },
      endpoint: 'xxxxx'
    },
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L109).

</p></details>
<details><summary>Send a Slack message</summary><p>

```javascript
notifmeSdk.send({
  slack: {
    text: 'Slack webhook text'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L132).

</p></details>
<details><summary>Send a multi-channel notification</summary><p>

```javascript
notifmeSdk.send({
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  },
  sms: {
    from: '+15000000000',
    to: '+15000000001',
    text: 'Hello John! How are you?'
  },
  push: {
    registrationToken: 'xxxxx',
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  },
  webpush: {
    subscription: {
      keys: {
        auth: 'xxxxx',
        p256dh: 'xxxxx'
      },
      endpoint: 'xxxxx'
    },
    title: 'Hi John',
    body: 'Hello John! How are you?',
    icon: 'https://notifme.github.io/notifme-sdk/img/icon.png'
  },
  slack: {
    text: 'Slack webhook text'
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js).

</p></details>

#### Returned type

`send` returns a Promise resolving with an `Object` of the following type:

```javascript
type NotificationStatusType = {
  status: 'success' | 'error',
  channels?: {[channel: ChannelType]: {
    id: string,
    providerId: ?string
  }},
  errors?: {[channel: ChannelType]: Error}
}
```

Examples:

| Case | Returned JSON |
| --- | --- |
| Success<br>(when Promise resolves) | `{status: 'success', channels: {sms: {id: 'id-116561976', providerId: 'sms-default-provider'}}}` |
| Error<br>(here Notification Catcher is not running) | `{status: 'error', channels: {sms: {id: undefined, providerId: 'sms-notificationcatcher-provider'}}, errors: {sms: 'connect ECONNREFUSED 127.0.0.1:1025'}}` |

### 5. In production

#### Recommended options

| Option name | Usage in production | Comment |
| --- | --- | --- |
| useNotificationCatcher | `false` | Don't forget to deactivate notification catcher (it overrides channels configuration). |

#### Logger

This project uses [winston](https://github.com/winstonjs/winston) as logging library. You can add or remove loggers as you wish.

```javascript
import NotifmeSdk from 'notifme-sdk'
import winston from 'winston'

const notifmeSdk = new NotifmeSdk({})

// To deactivate all loggers
notifmeSdk.logger.mute()

// Or set the loggers you want
notifmeSdk.logger.configure([
  new (winston.transports.File)({filename: 'somefile.log'})
])
```

See [winston's documentation](https://github.com/winstonjs/winston) for more details.

#### Use a request queue

- RabbitMQ: see [RabbitMQ Notif.me plugin documentation](https://github.com/notifme/notifme-sdk-queue-rabbitmq).

#### Send us a message

So that we can make a list of people using this library ;)

## Contributing

[![test framework](https://img.shields.io/badge/test_framework-Jest-brightgreen.svg?style=flat)](https://facebook.github.io/jest/)
[![js-standard-style](https://img.shields.io/badge/codestyle-Standard_JS-brightgreen.svg?style=flat)](https://github.com/standard/standard)
[![flow-typed](https://img.shields.io/badge/typing-Flow_Type-brightgreen.svg?style=flat)](https://flow.org/)
[![Greenkeeper badge](https://badges.greenkeeper.io/notifme/notifme-sdk.svg)](https://greenkeeper.io/)

Contributions are very welcome!

To get started: [fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

```shell
$ git clone git@github.com:[YOUR_USERNAME]/notifme-sdk.git && cd notifme-sdk
$ yarn install
```

Before making a [pull request](https://help.github.com/articles/creating-a-pull-request/), check that the code passes all the unit tests, respects the [Standard JS rules](https://standardjs.com/), and the [Flow type checker](https://flow.org/).

Tests will also run automatically with GitHub Actions when you open a PR.

```shell
$ yarn run test
```

### Next for this project

- Implement other providers for each channel ([ask or vote for a provider](https://github.com/notifme/notifme-sdk/issues))
- Add other types of notifications based on what people ask (slack, messenger, skype, telegram, kik, spark...)
- A plugin system (for queues, retry system on error, templating, strategies...)

## Need Help? Found a bug?

[Submit an issue](https://github.com/notifme/notifme-sdk/issues) to the project Github if you need any help.
And, of course, feel free to submit pull requests with bug fixes or changes.

## Related Projects

<p align="center">
  <a href="https://github.com/notifme/notifme-history">
    <img alt="Notif.me SDK" src="https://notifme.github.io/notifme-history/img/logo.png" />
  </a>
  <br>
  <em>A pretty history of the conversations with your users.</em>
</p>
