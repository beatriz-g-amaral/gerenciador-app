// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyDwqkwolOEDtmvUn9P3w-he4K3Vz9WKgb4",
  authDomain: "gerenciador-15f1c.firebaseapp.com",
  projectId: "gerenciador-15f1c",
  storageBucket: "gerenciador-15f1c.firebasestorage.app",
  messagingSenderId: "25006794530",
  appId: "1:25006794530:web:a5af5a593fad5a71b4677b",
  measurementId: "G-XSKW75JCLN"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
