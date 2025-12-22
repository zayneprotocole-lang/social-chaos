// Local Player Profiles (V10.0)
export * from './profile'

// Lobby Types (V10.0)
export * from './lobby'

export type DifficultyLevel = 1 | 2 | 3 | 4

export type DareCategory =
  | 'Alcool'
  | 'Soft'
  | 'Humiliant'
  | 'Drague'
  | 'Public'
  | 'Chaos'
  | 'Fun'
  | 'Indoor'
  | 'Truth'
  | 'Physique'
  | 'Social'
  | 'Acting'
  | 'Duel'
  | 'Spicy'
  | 'Cupidon'
  | 'Sensuel'
  | 'Phone'
  | 'Duo'
  | 'Group'

// Game control flow types
export type ControlStep = 'START' | 'ACTION'

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
  avatar?: string | null
  score: number
  jokersLeft: number
  rerollsLeft: number
  exchangeLeft: number
  isHost: boolean
  isPaused?: boolean
  hasBeenPaused?: boolean // V9.6: Track if player was ever paused (disqualified from ranking)
  turnOrder?: number // Position in turn order (0-based)
  createdAt?: Date // Added for sorting
  profileId?: string // Link to LocalPlayerProfile for Mentor/Élève system
  preferences?: {
    want: string[]
    avoid: string[]
  }

  // Accompagnement (V11 - set at game start if part of active Mentor/Élève duo)
  hasAccompagnement?: boolean // true if part of an active duo
  accompagnementPartnerId?: string // Player ID of partner
  accompagnementPartnerName?: string // Partner name for display
  accompagnementUsed?: boolean // true if already used this game
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

  // Terms acceptance (V12.0 - Electronic signature)
  termsAcceptedAt?: Timestamp | null
  termsVersion?: string | null // e.g., "1.0.0"
  termsAcceptedIP?: string | null // Optional: IP address for legal purposes
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
  creatorId: string // User ID of session creator (required for Firestore rules)
  participantIds: string[] // User IDs of all participants (required for Firestore rules)

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
  startedAt?: Timestamp | null

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
  avatar?: string | null
  score: number
  jokersLeft: number
  rerollsLeft: number
  exchangeLeft: number
  isHost: boolean
  hasBeenPaused?: boolean
  createdAt: Timestamp // Added for sorting
  preferences?: {
    want: string[]
    avoid: string[]
  }
}
