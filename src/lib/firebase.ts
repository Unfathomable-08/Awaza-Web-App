// firebase.ts
import { getAnalytics, isSupported } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

let app: any = null;

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    databaseURL: "https://vibely-social-media-default-rtdb.asia-southeast1.firebasedatabase.app",
  };

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
}

export const rtdb = app ? getDatabase(app) : null;
export const messaging = app ? getMessaging(app) : null;

// Function to get analytics safely
export const getFirebaseAnalytics = async () => {
  if (!app || typeof window === "undefined") return null;
  if (await isSupported().catch(() => false)) {
    return getAnalytics(app);
  }
  return null;
};

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("Notification permission granted", token);
      return token;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
  return null;
};

export default app;
