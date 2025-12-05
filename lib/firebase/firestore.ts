import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
import { app } from '@/firebase'

/**
 * Centralized Firestore client instance with offline persistence
 * Enables pass-and-play with unlimited cache for optimal offline experience
 */
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

// Enable logging in development
if (process.env.NODE_ENV !== 'production') {
  console.log('🔥 Firestore initialized with offline persistence')
}
