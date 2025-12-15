import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let _app: FirebaseApp | null = null

/**
 * Get Firebase App instance (client-side only, lazy initialization)
 * This prevents Firebase from initializing during SSR/build time
 */
export function getFirebaseApp(): FirebaseApp {
  // Skip initialization on server side
  if (typeof window === 'undefined') {
    throw new Error('Firebase should only be initialized on the client side')
  }

  if (_app) {
    return _app
  }

  // Check if already initialized by another module
  if (getApps().length > 0) {
    _app = getApp()
    return _app
  }

  // Validate required environment variables
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      'Firebase configuration is missing. Check your environment variables.'
    )
  }

  _app = initializeApp(firebaseConfig)
  return _app
}

/**
 * @deprecated Use getFirebaseApp() instead for SSR-safe initialization
 * Kept for backward compatibility - will lazy-init on first access
 */
export const app =
  typeof window !== 'undefined'
    ? getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApp()
    : (null as unknown as FirebaseApp)
