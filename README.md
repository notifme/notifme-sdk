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
  <a href="https://github.com/standard/standard"><img alt="js-standard-style" src="https://img.shields.io/badge/codestyle-standard-brightgreen.svg?style=flat" /></a>
  <a href="https://flow.org/"><img alt="flow-typed" src="https://img.shields.io/badge/typing-Flow_Type-brightgreen.svg?style=flat" /></a>
  <a href="https://github.com/notifme/notifme-sdk/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat" /></a>
</p>

- [Features](#features)
- [Getting started](#getting-started)
- [How to use](#how-to-use)
  - [1. General options](#1-general-options)
  - [2. Providers](#2-providers)
  - [3. Use a request queue](#3-use-a-request-queue)
  - [4. Send a notification](#4-send-a-notification)
  - [5. In production](#5-in-production)
- [Contributing](#contributing)
- [Need help? Found a bug?](#need-help-found-a-bug)

## Features

* **Easy channel integration** — Want to start sending `emails` | `SMS` | `pushes` | `webpushes`? Do so in no time!

* **Unique documentation** — Don't look everywhere for the parameters you need to pass, just do it once. **Switching provider becomes a no-brainer**.

* **Multiple providers strategies** — Want to use more than one provider? Use `fallback` and `round-robin` strategies out of the box.

* **Queue system** — Plug your own external queue system to ensure delivery (if you have one).

* **Tools for local testing** — Run a catcher locally to intercept all your notifications and display them in a web interface.

* **MIT license** — Use it like you want.

## Getting Started

```shell
$ yarn add notifme-sdk
```

```javascript
import NotifmeSdk from 'notifme-sdk'

const notifmeSdk = new NotifmeSdk({}) // empty config = no queue and provider is console.log
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

## How to use

- [1. General options](#1-general-options)
- [2. Providers](#2-providers)
- [3. Use a request queue](#3-use-a-request-queue)
- [4. Send a notification](#4-send-a-notification)
- [5. In production](#5-in-production)

### 1. General options

```javascript
new NotifmeSdk({
  channels: ..., // Object
  requestQueue: ..., // false | 'in-memory' | Function
  onSuccess: ..., // Function
  onError: ..., // Function
  useNotificationCatcher: ... // boolean
})
```

| Option name | Required | Type | Description |
| --- | --- | --- | --- |
| `channels` | `false` | `Object` | Define `providers` (`Array`) and `multiProviderStrategy` (`string`) for each channel (email, sms, push, webpush).<br><br>See all details below: [2. Providers](#2-providers). |
| `requestQueue` | `false` | `false` \| `string` \| `Function` | <i>Default: `false`.</i><br>Queue used for your notification requests.<br><br>You can pass `'in-memory'` to mimic an external queue in your local environment. To use a real queue, see [3. Use a request queue](#3-use-a-request-queue) below. |
| `onSuccess` | `false` | `Function` | Callback to call when a notification has been sent with success. The first parameter is [described below](#returned-type) and the second is your request. |
| `onError` | `false` | `Function` | Callback to call when a notification has an error in at least one channel. The first parameter is [described below](#returned-type) and the second is your request. |
| `useNotificationCatcher` | `false` | `boolean` | If true, all your notifications are sent to the catcher running on localhost:1025 (channels option will be completely ignored!) |

#### Complete examples

```javascript
// Env: development
new NotifmeSdk({
  requestQueue: false,
  useNotificationCatcher: true,
  onSuccess: (result, originalRequest) => {
    console.log(`My request id ${originalRequest.id} was successful \\o/.`, result)
  },
  onError: (result, originalRequest) => {
    console.log(`Oh no, my request id ${originalRequest.id} has errors.`, result.errors)
  }
})

// Env: production
new NotifmeSdk({
  channels: {
    email: {
      multiProviderStrategy: 'fallback', // If Mailgun fails, use Mailjet
      providers: [{
        type: 'smtp',
        host: 'smtp.mailgun.org',
        port: 465,
        secure: true,
        auth: {
          user: 'postmaster@xxxxx.mailgun.org',
          pass: 'xxxxx'
        }
      }, {
        type: 'smtp',
        host: 'in-v3.mailjet.com',
        port: 587,
        secure: true,
        auth: {
          user: 'xxxxx',
          pass: 'xxxxx'
        }
      }]
    },
    sms: {
      multiProviderStrategy: 'roundrobin', // Use Nexmo and Twilio in turns (and fallback if error)
      providers: [{
        type: 'nexmo',
        apiKey: 'xxxxx',
        apiSecret: 'xxxxx'
      }, {
        type: 'twilio',
        accountSid: 'xxxxx',
        authToken: 'xxxxx'
      }]
    }
  },
  onSuccess: (result, originalRequest) => {
    // Maybe log success in database
  },
  onError: (result, originalRequest) => {
    // Maybe retry failed channel(s) later
  }
})
```

### 2. Providers

#### Email providers

<details><summary>SMTP</summary><p>

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
<details><summary>Logger (for development)</summary><p>

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
<br>

See all options: [Email provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-email.js)

#### SMS providers

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

<details><summary>Logger (for development)</summary><p>

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
<br>

See all options: [SMS provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-sms.js)

#### Push providers

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
<details><summary>Logger (for development)</summary><p>

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
<br>

See all options: [Push provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-push.js)

#### Webpush providers

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
<details><summary>Logger (for development)</summary><p>

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
<br>

See all options: [Webpush provider options](https://github.com/notifme/notifme-sdk/blob/master/src/models/provider-webpush.js)

#### Multi-provider strategies

| Strategy name | Description |
| --- | --- |
| `fallback` | If the used provider returns an error, try the next in the list. |
| `roundrobin` | Use every provider in turns. If one of them returns an error, fallback to the next. |
| `no-fallback` | Deactivates fallback strategy. |

#### Adding a provider or a channel

If you would like to see another provider or channel, please [upvote the corresponding issue](https://github.com/notifme/notifme-sdk/issues) (or create one if it does not exist yet).

### 3. Use a request queue

You can use your own queue system to handle notification requests. It must implement the following interface:

```javascript
interface QueueType<T> {
  enqueue(type: string, jobData: T): Promise<?Object>;
  dequeue(type: string, callback: CallbackType<T>): void;
  // Note: callback is an async method treating a request
}
```

#### Example

```javascript
new NotifmeSdk({
  requestQueue: {
    enqueue: (type, request) => { // 'type' is prefixed by 'notifme:'
      return new Promise((resolve) => {
        // Put request in your queue
        resolve(/* info from your queue system */)
      })
    },
    dequeue: (type, callback) => {
      // Get a request from your queue
      callback(request).then(/* Send ack for this request */)
    }
  }
})
```

### 4. Send a notification

#### Parameters

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

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js#L91).

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
  }
})
```

See [all parameters](https://github.com/notifme/notifme-sdk/blob/master/src/models/notification-request.js).

</p></details>

#### Returned type

`send` returns a Promise resolving with an `Object` of the following type:

```javascript
type NotificationStatusType = {
  status: 'queued' | 'success' | 'error',
  channels?: {[channel: ChannelType]: {
    id: string,
    providerId: ?string
  }},
  info?: ?Object,
  errors?: {[channel: ChannelType]: Error}
}
```

Examples:

| Case | Returned JSON |
| --- | --- |
| Success<br>(when Promise resolves) | `{status: 'success', channels: {sms: {id: 'id-116561976', providerId: 'sms-default-provider'}}}` |
| Success<br>(when you use a queue for requests) | `{status: 'queued'}` |
| Error<br>(here Notification Catcher is not running) | `{status: 'error', channels: {sms: {id: undefined, providerId: 'sms-notificationcatcher-provider'}}, errors: {sms: 'connect ECONNREFUSED 127.0.0.1:1025'}}` |

### 5. In production

#### Recommended options

| Option name | Usage in production |
| --- | --- |
| useNotificationCatcher | `false` |
| requestQueue | `false` \| `Function` (see [3. Use a request queue](#3-use-a-request-queue)) |

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

#### Send us a message

So that we can make a list of people using this library ;)

## Contributing

Contributions are very welcome!

To get started: [fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

```shell
$ git clone git@github.com:[YOUR_USERNAME]/notifme-sdk.git && cd notifme-sdk
$ yarn install
```

Before making a [pull request](https://help.github.com/articles/creating-a-pull-request/), check that the code respects the [Standard JS rules](https://standardjs.com/) and the [Flow type checker](https://flow.org/).

```shell
$ yarn run lint
```

### Next for this project

- Implement other providers for each channel ([ask or vote for a provider](https://github.com/notifme/notifme-sdk/issues))
- Add other types of notifications based on what people ask (slack, messenger, skype, telegram, kik, spark...)
- A plugin system (for queues, retry system on error, templating, strategies...)

## Need Help? Found a bug?

[Submit an issue](https://github.com/notifme/notifme-sdk/issues) to the project Github if you need any help.
And, of course, feel free to submit pull requests with bug fixes or changes.
