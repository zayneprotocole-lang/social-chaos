import { Timestamp } from 'firebase/firestore'
import { DifficultyLevel, DareCategory } from './index'

/**
 * Firestore Document: /history/{historyId}
 */
export interface HistoryDocument {
  id: string
  winner: {
    id: string
    name: string
    avatar?: string | null
    score: number
  }
  loser: {
    id: string
    name: string
    avatar?: string | null
    score: number
  } | null // Allow null for solo mode
  otherPlayers: {
    name: string
    avatar?: string | null
  }[]
  adventurers?: {
    name: string
    avatar?: string | null
    score: number
  }[]
  totalRounds: number
  difficulty: DifficultyLevel
  categories: DareCategory[]
  playedAt: Timestamp
  isSoloMode?: boolean
}

/**
 * Local Storage History Item (Offline-First)
 */
export interface LocalHistoryItem {
  id: string
  winner: {
    id: string
    name: string
    avatar?: string | null
    score: number
  }
  loser: {
    id: string
    name: string
    avatar?: string | null
    score: number
  } | null // Allow null for solo mode
  otherPlayers: {
    name: string
    avatar?: string | null
  }[]
  adventurers?: {
    name: string
    avatar?: string | null
    score: number
  }[]
  totalRounds: number
  difficulty: DifficultyLevel
  categories: DareCategory[]
  playedAt: number // Timestamp in milliseconds
  isSoloMode?: boolean
}
