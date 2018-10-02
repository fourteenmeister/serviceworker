self.addEventListener("notificationclick", function(event) {
  const target = event.notification.data.click_action || '/';
  console.log(target);
  event.notification.close();

  event.waitUntil(clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(function(clientList) {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url === target && 'focus' in client) {
        return client.focus();
      }
    }
    return clients.openWindow(target);
  }));
});

self.addEventListener('push', function(event) {
  console.log(event);
  const options = {
    body: 'This is amazing message',
  };
  const promise = self.registration.showNotification('Push notification!', options);
  event.waitUntil(promise);
});
