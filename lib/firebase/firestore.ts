import {
  initializeFirestore,
  getFirestore,
  CACHE_SIZE_UNLIMITED,
  Firestore,
} from 'firebase/firestore'
import { getFirebaseApp } from '@/firebase'

let _db: Firestore | null = null

/**
 * Get Firestore instance (client-side only, lazy initialization)
 * Enables pass-and-play with unlimited cache for optimal offline experience
 */
export function getDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firestore should only be accessed on the client side')
  }

  if (_db) {
    return _db
  }

  const app = getFirebaseApp()

  try {
    // Try to get existing instance first
    _db = getFirestore(app)
  } catch {
    // Initialize with custom settings if not yet initialized
    _db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    })
  }

  return _db
}

/**
 * @deprecated Use getDb() instead for SSR-safe access
 * Kept for backward compatibility
 */
export const db =
  typeof window !== 'undefined'
    ? (() => {
        const app = getFirebaseApp()
        try {
          return getFirestore(app)
        } catch {
          return initializeFirestore(app, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED,
          })
        }
      })()
    : (null as unknown as Firestore)
