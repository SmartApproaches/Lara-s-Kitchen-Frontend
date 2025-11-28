// public/firebase-messaging-sw.js
/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBh-Nlh2O9E3TdQuVR-N0dfYhYn2LunV1E",
  authDomain: "lka-app.firebaseapp.com",
  projectId: "lka-app",
  storageBucket: "lka-app.firebasestorage.app",
  messagingSenderId: "332335896055",
  appId: "1:332335896055:web:305d229b06c82f81958af2",
  measurementId: "G-FNE2M0TQ04",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || "/logo.svg",
  });
});
