/* @flow */
import NotifmeWorker from '../../src/worker' // notifme-sdk/lib/worker

const notifmeWorker = new NotifmeWorker({
  requestQueue: 'in-memory', // same queue than producer
  channels: {
    email: {
      providers: [{type: 'logger'}]
    }
  }
})

// Dequeue and send the notifications
notifmeWorker.run()
