function receivePushNotification(event) {
  console.log("[Service Worker] Push Received.");

  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge:
      "https://icons.iconarchive.com/icons/cornmanthe3rd/metronome/128/Utilities-tasks-icon.png",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon:
          "https://icons.iconarchive.com/icons/cornmanthe3rd/metronome/128/Utilities-tasks-icon.png",
      },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
  console.log(
    "[Service Worker] Notification click Received.",
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
