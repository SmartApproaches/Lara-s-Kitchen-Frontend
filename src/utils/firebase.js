import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBh-Nlh2O9E3TdQuVR-N0dfYhYn2LunV1E",
  authDomain: "lka-app.firebaseapp.com",
  projectId: "lka-app",
  storageBucket: "lka-app.firebasestorage.app",
  messagingSenderId: "332335896055",
  appId: "1:332335896055:web:305d229b06c82f81958af2",
  measurementId: "G-FNE2M0TQ04",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async (vapidKey) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    const token = await getToken(messaging, { vapidKey });

    return token;
  } catch (err) {
    return null;
  }
};

export const listenToForegroundMessages = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};
