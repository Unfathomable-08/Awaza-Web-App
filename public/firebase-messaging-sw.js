// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(
  {
    apiKey: "AIzaSyA1xJde0baKF3aGDRC2e2afB_LJ85EZIg4",
    authDomain: "vibely-social-media.firebaseapp.com",
    projectId: "vibely-social-media",
    storageBucket: "vibely-social-media.firebasestorage.app",
    messagingSenderId: "767842087148",
    appId: "1:767842087148:web:8a05aad8ba05ac696535c9",
    measurementId: "G-MBSEPS0Z8S",
    databaseURL: "https://vibely-social-media-default-rtdb.asia-southeast1.firebasedatabase.app",
  }
);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle incoming messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // The Firebase SDK automatically displays the notification if the 'notification' object 
  // is present in the payload. We do not need to call showNotification manually.
});

// Optional: Handle click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});