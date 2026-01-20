importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDwqkwolOEDtmvUn9P3w-he4K3Vz9WKgb4",
  authDomain: "gerenciador-15f1c.firebaseapp.com",
  projectId: "gerenciador-15f1c",
  storageBucket: "gerenciador-15f1c.firebasestorage.app",
  messagingSenderId: "25006794530",
  appId: "1:25006794530:web:a5af5a593fad5a71b4677b",
  measurementId: "G-XSKW75JCLN"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/Logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
