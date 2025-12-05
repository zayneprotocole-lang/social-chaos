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
        avatar?: string
        score: number
    }
    loser: {
        id: string
        name: string
        avatar?: string
        score: number
    }
    otherPlayers: {
        name: string
        avatar?: string
    }[]
    totalRounds: number
    difficulty: DifficultyLevel
    categories: DareCategory[]
    playedAt: Timestamp
}

/**
 * Local Storage History Item (Offline-First)
 */
export interface LocalHistoryItem {
    id: string
    winner: {
        id: string
        name: string
        avatar?: string
        score: number
    }
    loser: {
        id: string
        name: string
        avatar?: string
        score: number
    }
    otherPlayers: {
        name: string
        avatar?: string
    }[]
    totalRounds: number
    difficulty: DifficultyLevel
    categories: DareCategory[]
    playedAt: number // Timestamp in milliseconds
}
