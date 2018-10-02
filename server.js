const webpush = require('web-push');

const {
  GOOGLE_CLOUD_MESSAGING_API_KEY,
  PUBLIC_SERVER_KEY,
  PRIVATE_SERVER_KEY,
  PUSH_SUBSCRIPTION,
} = process.env;

webpush.setGCMAPIKey(GOOGLE_CLOUD_MESSAGING_API_KEY);

webpush.setVapidDetails(
  'mailto:firstName.secondName@test.test',
  PUBLIC_SERVER_KEY,
  PRIVATE_SERVER_KEY
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = JSON.parse(PUSH_SUBSCRIPTION);

webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
