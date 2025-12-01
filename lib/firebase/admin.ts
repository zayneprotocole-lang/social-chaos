import * as admin from 'firebase-admin'

/**
 * Initialize Firebase Admin SDK for server-side operations.
 * This should only be used in Server Actions or API routes.
 */
function initializeFirebaseAdmin() {
  // Check if already initialized
  if (admin.apps.length > 0) {
    return admin.app()
  }

  // Initialize with service account credentials from environment variables
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  )

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY environment variables.'
    )
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

// Initialize the app
const adminApp = initializeFirebaseAdmin()

// Export Firestore instance
export const adminDb = admin.firestore(adminApp)

// Export admin for other uses
export { admin }
