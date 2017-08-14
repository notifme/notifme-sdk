# Example with separated queue worker

This example explains how to use a queue and dedicated workers to send notifications.
- The `producer` is the service within your app in charge of handling notification requests. It will call `notifme-sdk` with queue information in `requestQueue` option.
- The `consumer` is a (micro-)service reading your queue and sending the notifications to your providers.

> Side note: this example uses `'in-memory'` queue to mimic a real one, but this is not suitable for production use. See [Use a request queue](https://github.com/notifme/notifme-sdk#3-use-a-request-queue).
