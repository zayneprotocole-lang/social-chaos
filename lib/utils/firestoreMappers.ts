import { Timestamp } from 'firebase/firestore'
import { GameSession, SessionDocument, Player } from '@/types'

/**
 * Helper to convert Firestore Timestamp to Date
 */
function toDate(timestamp: Timestamp | null | undefined): Date | undefined {
  if (!timestamp) return undefined
  return timestamp.toDate()
}

/**
 * Maps Firestore SessionDocument to GameSession (Application State)
 */
export function mapFirestoreToSession(
  docId: string,
  data: SessionDocument,
  players: Player[] = []
): GameSession {
  return {
    id: docId,
    roomCode: data.roomCode,
    status: data.status,
    settings: data.settings,
    players: players,

    // Game State
    currentTurnPlayerId: data.currentTurnPlayerId,
    currentDare: data.currentDare,
    isPaused: data.isPaused || false,

    // V4.0 / Progression
    roundsTotal: data.roundsTotal || 0,
    roundsCompleted: data.roundsCompleted || 0,
    playersPlayedThisRound: data.playersPlayedThisRound || 0,
    isProgressiveMode: data.isProgressiveMode || false,

    // V9.3 - Atomic turn counter
    turnCounter: data.turnCounter || 1,

    // V9.4 - Swap blocking (all players who used swap this turn)
    swapUsedByPlayerIds: data.swapUsedByPlayerIds || [],

    // Timestamps
    startedAt: toDate(data.createdAt),
    endedAt: data.endedAt ? toDate(data.endedAt) : null,
  }
}
