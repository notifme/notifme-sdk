/* @flow */
import NotifmeSdk from '../../src' // notifme-sdk

const notifmeSdk = new NotifmeSdk({
  requestQueue: 'in-memory', // mimic real queue for example purposes
  runWorker: false
  // No need for provider info, the `worker` will send all the notifications
})

// Enqueue the notifications
notifmeSdk.send({
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  }
})
