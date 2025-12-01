import { getFirestore } from 'firebase/firestore'
import { app } from '@/firebase'

/**
 * Centralized Firestore client instance
 * Replaces the previous Prisma client
 */
export const db = getFirestore(app)

// Enable logging in development
if (process.env.NODE_ENV !== 'production') {
  console.log('🔥 Firestore initialized')
}
