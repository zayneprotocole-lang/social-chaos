import 'server-only'
import { adminDb } from '@/lib/firebase/admin'
import type { SessionDocument } from '@/types'

/**
 * Fetch all completed game sessions for the history page.
 * Uses Firebase Admin SDK for secure server-side fetching.
 */
export async function fetchCompletedHistory(): Promise<SessionDocument[]> {
  try {
    const sessionsRef = adminDb.collection('sessions')
    const snapshot = await sessionsRef
      .where('status', '==', 'FINISHED')
      .orderBy('playedAt', 'desc')
      .get()

    const sessions: SessionDocument[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      // Basic mapping, assuming data is correct.
      // In a real app, we might want to validate with Zod here too,
      // but for server-to-server/admin, we can be a bit more trusting or just map what we need.
      sessions.push({
        id: doc.id,
        ...data,
        // Ensure dates are serializable if needed (Next.js Server Components handle Date objects fine usually,
        // but sometimes it's safer to convert to string if passing to client components directly without formatting)
        // For now, we keep them as is, assuming the consumer handles them.
      } as SessionDocument)
    })

    return sessions
  } catch (error) {
    console.error('Error fetching game history:', error)
    return []
  }
}
