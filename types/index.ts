export type DifficultyLevel = 1 | 2 | 3 | 4

export type DareCategory =
  | 'Alcool'
  | 'Soft'
  | 'Humiliant'
  | 'Drague'
  | 'Public'
  | 'Chaos'
  | 'Fun'

export interface Dare {
  id: string
  content: string
  difficultyLevel: DifficultyLevel
  categoryTags: DareCategory[]
  penaltyText?: string
  xpReward: number
}

export interface Player {
  id: string
  name: string
  avatar?: string
  score: number
  jokersLeft: number
  rerollsLeft: number
  exchangeLeft: number
  isHost: boolean
  isPaused?: boolean
  turnOrder?: number // Position in turn order (0-based)
  createdAt?: Date // Added for sorting
}

export interface GameSettings {
  difficulty: DifficultyLevel
  tags: DareCategory[]
  timerDuration: number // in seconds
  alcoholMode: boolean
  includeCustomDares?: boolean
}

export interface GameSession {
  id: string
  roomCode: string
  status: 'WAITING' | 'ACTIVE' | 'FINISHED'
  settings: GameSettings
  players: Player[]
  currentTurnPlayerId?: string
  currentDare?: Dare
  isPaused: boolean
  startedAt?: Date

  // V4.0
  roundsTotal: number
  roundsCompleted: number
  playersPlayedThisRound: number
  isProgressiveMode: boolean
  endedAt?: Date | null

  // V9.3 - Atomic turn counter for forcing timer reset
  turnCounter: number

  // V9.4 - Track ALL players who have used swap this turn (prevents revenge swap on any of them)
  swapUsedByPlayerIds?: string[]
}

// ========================================
// FIRESTORE DOCUMENT INTERFACES
// ========================================

import { Timestamp } from 'firebase/firestore'

/**
 * Firestore Document: /users/{userId}
 */
export interface UserDocument {
  id: string
  username: string
  gamesPlayed: number
  createdAt: Timestamp
}

/**
 * Firestore Document: /dares/{dareId}
 */
export interface DareDocument {
  id: string
  content: string
  difficultyLevel: DifficultyLevel
  categoryTags: DareCategory[]
  penaltyText?: string
  xpReward: number
}

/**
 * Firestore Document: /sessions/{sessionId}
 */
export interface SessionDocument {
  id: string
  roomCode: string
  status: 'WAITING' | 'ACTIVE' | 'FINISHED'
  settings: GameSettings
  createdAt: Timestamp

  // V4.0 Fields
  roundsTotal: number
  roundsCompleted: number
  isProgressiveMode: boolean
  endedAt?: Timestamp | null

  // V9.1 History Metadata
  winnerName?: string | null
  loserName?: string | null
  roundsPlayed?: number | null
  difficultyLabel?: string | null
  playedAt?: Timestamp | null

  // Game State Fields (Dynamic)
  currentTurnPlayerId?: string
  currentDare?: Dare
  isPaused?: boolean
  playersPlayedThisRound?: number
  startedAt?: Timestamp

  // V9.3 - Atomic turn counter
  turnCounter: number

  // V9.4 - Track ALL players who have used swap this turn
  swapUsedByPlayerIds?: string[]
}

/**
 * Firestore Subcollection Document: /sessions/{sessionId}/players/{playerId}
 */
export interface SessionPlayerDocument {
  id: string
  name: string
  avatar?: string
  score: number
  jokersLeft: number
  rerollsLeft: number
  exchangeLeft: number
  isHost: boolean
  createdAt: Timestamp // Added for sorting
}
