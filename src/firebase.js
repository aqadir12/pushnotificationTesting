import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getToken, getMessaging, onMessage } from 'firebase/messaging';
import { onBackgroundMessage } from "firebase/messaging/sw";
const firebaseConfig = {
  apiKey: "AIzaSyBhX3bSzerzWwwiX8_RU6koqPUQsfgxigI",
  authDomain: "myapp-6ac69.firebaseapp.com",
  databaseURL: "https://myapp-6ac69-default-rtdb.firebaseio.com",
  projectId: "myapp-6ac69",
  storageBucket: "myapp-6ac69.appspot.com",
  messagingSenderId: "313654010550",
  appId: "1:313654010550:web:33adb5900c526f49ce7c17",
  measurementId: "G-6SCDR3TQM9"
};

console.log('*** Environment ***', process.env.REACT_APP_ENV)
console.log('*** Firebase Config ***', firebaseConfig)

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
// 
export const getPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BGkEAkSz6UUYd3odeEUok86C7GD7sHx4ZK5V7n0QQWPQOjRyQ8L8Bp-OlRvsw_T86KKRJ5bD7vvM_NiewiuCZyw",
      });
      if (token) {
        console.log("cehckk", token);
      }
      else {
        console.log('falied to get to token')
      }
    }
    else {
      console.log("User Permission Denied.");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
};

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker()
    .then((serviceWorkerRegistration) =>
      getToken(messaging, { vapidKey: "BGkEAkSz6UUYd3odeEUok86C7GD7sHx4ZK5V7n0QQWPQOjRyQ8L8Bp-OlRvsw_T86KKRJ5bD7vvM_NiewiuCZyw", serviceWorkerRegistration }));


onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };
  console.log(notificationTitle)
  console.log(notificationOptions)
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});