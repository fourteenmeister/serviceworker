const publicKey = 'BB0WKcSna7JRToamlsarYXPez3Vh2csYsDmo3QFpafUAUKgYLebXQcMW2bgY_rU2pErIEEhu-gaw_Zfst-7ghmg';


if ('serviceWorker' in navigator && 'PushManager' in window) {
  document.addEventListener('DOMContentLoaded', function() {
    requestPermission()
      .then(serviceWorkerRegister)
      .then(subscribe)
      .then(pushSubscription)
      .catch(function (error) {
        console.warn(error.message, error);
      });
  });
}

// permission request
function requestPermission() {
  return new Promise(function (resolve, reject) {
    Notification.requestPermission(function (result) {
      resolve(result);
    }).then(resolve, reject);
  })
    .then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('Permission not granted.');
      }
    });
}

// register serviceWorker
function serviceWorkerRegister() {
  return navigator.serviceWorker.register('serviceWorker.js')
    .then(function (registration) {
      console.log("ServiceWorker registered with scope:", registration.scope);
      return registration;
    })
    .catch(function () {
      throw new Error('ServiceWorker registration failed.');
    });
}

function subscribe() {
  return navigator.serviceWorker.ready.then(function (registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(publicKey),
    };
    return registration.pushManager.subscribe(subscribeOptions);
  });
}

function pushSubscription(pushSubscription) {
  copyToClipboard(JSON.stringify(pushSubscription));
  return pushSubscription;
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function toBase64(arrayBuffer) {
  const uint8Version = new Uint8Array(arrayBuffer);
  return btoa(String.fromCharCode.apply(null, uint8Version));
}

function arrayBufferToBase64(arrayBuffer) {
  const base64String = toBase64(arrayBuffer);
  return base64String
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function copyToClipboard (value) {
  console.log(value);
  const el = document.createElement('textarea');
  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  console.log('token was copied successfully');
}