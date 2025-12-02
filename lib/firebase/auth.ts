import { getAuth, signInAnonymously as firebaseSignInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { app } from '@/firebase'

/**
 * Centralized Firebase Auth instance
 */
export const auth = getAuth(app)

/**
 * Sign in anonymously to Firebase
 * This ensures all users have a uid for Firestore security rules
 */
export async function signInAnonymously() {
    try {
        const result = await firebaseSignInAnonymously(auth)
        console.log('🔐 Signed in anonymously:', result.user.uid)
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

// Enable logging in development
if (process.env.NODE_ENV !== 'production') {
    console.log('🔐 Firebase Auth initialized')
}
