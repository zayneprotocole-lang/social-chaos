'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { SessionDocument } from '@/types'

/**
 * Server Action to save game completion data.
 * Uses Firebase Admin SDK for secure server-side operations.
 */
export async function saveGameCompletion(
  sessionId: string,
  data: {
    winnerName: string
    loserName: string
    roundsPlayed: number
    difficultyLabel: string
  }
) {
  try {
    const sessionRef = adminDb.collection('sessions').doc(sessionId)

    await sessionRef.update({
      status: 'FINISHED',
      winnerName: data.winnerName,
      loserName: data.loserName,
      roundsPlayed: data.roundsPlayed,
      difficultyLabel: data.difficultyLabel,
      playedAt: new Date(),
      endedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error saving game completion:', error)
    return { success: false, error: 'Failed to save game completion' }
  }
}

/**
 * Server Action to create a new game session.
 */
export async function createGameSession(
  sessionData: Omit<SessionDocument, 'id'>
) {
  try {
    const sessionsRef = adminDb.collection('sessions')
    const docRef = await sessionsRef.add({
      ...sessionData,
      createdAt: new Date(),
    })

    return { success: true, sessionId: docRef.id }
  } catch (error) {
    console.error('Error creating game session:', error)
    return { success: false, error: 'Failed to create game session' }
  }
}
