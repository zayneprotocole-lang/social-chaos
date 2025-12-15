import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChanged,
  Auth,
} from 'firebase/auth'
import { getFirebaseApp } from '@/lib/firebase-client'

let _auth: Auth | null = null

/**
 * Get Firebase Auth instance (client-side only, lazy initialization)
 */
export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth should only be accessed on the client side')
  }

  if (_auth) {
    return _auth
  }

  _auth = getAuth(getFirebaseApp())
  return _auth
}

/**
 * @deprecated Use getAuthInstance() instead for SSR-safe access
 * Kept for backward compatibility
 */
export const auth =
  typeof window !== 'undefined'
    ? getAuth(getFirebaseApp())
    : (null as unknown as Auth)

/**
 * Sign in anonymously to Firebase
 * This ensures all users have a uid for Firestore security rules
 */
export async function signInAnonymously() {
  try {
    const authInstance = getAuthInstance()
    const result = await firebaseSignInAnonymously(authInstance)

    return result.user
  } catch (error) {
    console.error('Failed to sign in anonymously:', error)
    throw error
  }
}

/**
 * Get current user or sign in anonymously
 */
export async function ensureAuthenticated() {
  return new Promise((resolve, reject) => {
    const authInstance = getAuthInstance()
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      unsubscribe()
      if (user) {
        resolve(user)
      } else {
        try {
          const newUser = await signInAnonymously()
          resolve(newUser)
        } catch (error) {
          reject(error)
        }
      }
    })
  })
}
