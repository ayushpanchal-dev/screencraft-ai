import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const rawProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Check if valid Firebase configuration is present in environment
export const isFirebaseConfigured = Boolean(
  rawApiKey &&
  rawApiKey !== '' &&
  rawApiKey !== 'MY_FIREBASE_API_KEY' &&
  rawProjectId &&
  rawProjectId !== ''
);

// Safe fallback API key & Project ID to prevent Firebase SDK from throwing auth/invalid-api-key at module load time on Vercel
const safeApiKey = isFirebaseConfigured
  ? rawApiKey
  : 'AIzaSyDummyApiKeyForVercelFallbackEnvironment12345';

const safeProjectId = isFirebaseConfigured
  ? rawProjectId
  : 'screencraft-ai-fallback';

const firebaseConfig = {
  apiKey: safeApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${safeProjectId}.firebaseapp.com`,
  projectId: safeProjectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${safeProjectId}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!isFirebaseConfigured) {
  console.warn(
    '[ScreenCraft AI] Firebase environment variables not detected. Running in safe fallback mode. Please configure VITE_FIREBASE_* environment variables in Vercel Project Settings.'
  );
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
