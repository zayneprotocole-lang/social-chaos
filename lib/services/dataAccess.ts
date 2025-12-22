/**
 * Firestore Data Access Layer
 * Centralized service for all database operations
 */

import { db } from '@/lib/firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  writeBatch,
  onSnapshot,
  increment,
  Unsubscribe,
} from 'firebase/firestore'
import {
  SessionDocument,
  SessionPlayerDocument,
  DareDocument,
  UserDocument,
  GameSettings,
  Player,
} from '@/types'

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
function timestampToDate(timestamp: Timestamp | null | undefined): Date | null {
  return timestamp ? timestamp.toDate() : null
}

/**
 * Convert SessionDocument from Firestore to SessionDocument with Date objects
 */
function convertSessionDoc(
  doc: QueryDocumentSnapshot<DocumentData>
): SessionDocument & { id: string } {
  const data = doc.data()
  return {
    id: doc.id,
    roomCode: data.roomCode,
    status: data.status,
    settings: data.settings,
    createdAt: data.createdAt,
    creatorId: data.creatorId,
    participantIds: data.participantIds || [],
    roundsTotal: data.roundsTotal,
    roundsCompleted: data.roundsCompleted,
    isProgressiveMode: data.isProgressiveMode,
    endedAt: data.endedAt || null,
    winnerName: data.winnerName || null,
    loserName: data.loserName || null,
    roundsPlayed: data.roundsPlayed || null,
    difficultyLabel: data.difficultyLabel || null,
    playedAt: data.playedAt || null,

    // Dynamic Game State Fields
    currentTurnPlayerId: data.currentTurnPlayerId,
    currentDare: data.currentDare,
    isPaused: data.isPaused,
    playersPlayedThisRound: data.playersPlayedThisRound,
    startedAt: data.startedAt,
    turnCounter: data.turnCounter || 0, // V9.3: Default to 0 for old sessions

    // V9.4: Swap blocking (all players who used swap this turn)
    swapUsedByPlayerIds: data.swapUsedByPlayerIds || [],
  }
}

// ========================================
// SESSIONS OPERATIONS
// ========================================

export const dataAccess = {
  /**
   * Create a new game session
   */
  async createSession(data: {
    roomCode: string
    settings: GameSettings
    roundsTotal: number
    isProgressiveMode: boolean
  }) {
    // Get current authenticated user
    const { getAuth } = await import('firebase/auth')
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      throw new Error('User must be authenticated to create a session')
    }

    const sessionRef = doc(db, 'sessions', data.roomCode)
    const sessionData: SessionDocument = {
      id: sessionRef.id,
      roomCode: data.roomCode,
      status: 'WAITING',
      settings: data.settings,
      roundsTotal: data.roundsTotal,
      roundsCompleted: 0,
      isProgressiveMode: data.isProgressiveMode,
      createdAt: Timestamp.now(),
      endedAt: null,
      turnCounter: 1, // V9.3: Initialize turnCounter to 1
      creatorId: currentUser.uid, // Required by Firestore rules
      participantIds: [currentUser.uid], // Creator is first participant
    }

    await setDoc(sessionRef, sessionData)
    return sessionRef.id
  },

  /**
   * Get a session by ID
   */
  async getSession(sessionId: string) {
    const sessionRef = doc(db, 'sessions', sessionId)
    const sessionSnap = await getDoc(sessionRef)

    if (!sessionSnap.exists()) {
      return null
    }

    return convertSessionDoc(sessionSnap)
  },

  /**
   * Get a session by room code
   */
  async getSessionByRoomCode(roomCode: string) {
    const q = query(
      collection(db, 'sessions'),
      where('roomCode', '==', roomCode),
      limit(1)
    )

    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return null
    }

    return convertSessionDoc(snapshot.docs[0])
  },

  /**
   * Update a session
   */
  async updateSession(sessionId: string, data: Partial<SessionDocument>) {
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, { ...data })
  },

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string) {
    const sessionRef = doc(db, 'sessions', sessionId)
    await deleteDoc(sessionRef)
  },

  // ========================================
  // PLAYERS OPERATIONS (Subcollection)
  // ========================================

  /**
   * Add a player to a session
   */
  async addPlayerToSession(
    sessionId: string,
    playerData: Omit<SessionPlayerDocument, 'id' | 'createdAt'>
  ) {
    const playersRef = collection(db, 'sessions', sessionId, 'players')
    const playerDoc = await addDoc(playersRef, {
      ...playerData,
      createdAt: Timestamp.now(),
    })
    return playerDoc.id
  },

  /**
   * Get all players for a session
   */
  async getSessionPlayers(sessionId: string): Promise<Player[]> {
    const playersRef = collection(db, 'sessions', sessionId, 'players')
    const q = query(playersRef, orderBy('createdAt', 'asc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Ensure createdAt is converted to a Date object if it's a Timestamp
        createdAt:
          data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
      } as Player
    })
  },

  /**
   * Update a player's score
   */
  async updatePlayerScore(sessionId: string, playerId: string, score: number) {
    const playerRef = doc(db, 'sessions', sessionId, 'players', playerId)
    await updateDoc(playerRef, { score })
  },

  /**
   * Update a player's powerups (jokers, rerolls, exchanges)
   */
  async updatePlayerPowerups(
    sessionId: string,
    playerId: string,
    powerups: {
      jokersLeft?: number
      rerollsLeft?: number
      exchangeLeft?: number
    }
  ) {
    const playerRef = doc(db, 'sessions', sessionId, 'players', playerId)
    await updateDoc(playerRef, { ...powerups })
  },

  /**
   * Update a player's status (e.g. isPaused)
   */
  async updatePlayerStatus(
    sessionId: string,
    playerId: string,
    updates: {
      isPaused: boolean
    }
  ) {
    const playerRef = doc(db, 'sessions', sessionId, 'players', playerId)
    await updateDoc(playerRef, { ...updates })
  },

  /**
   * Update all players' scores in batch
   */
  async updateAllPlayerScores(sessionId: string, players: Player[]) {
    const batch = writeBatch(db)

    players.forEach((player) => {
      const playerRef = doc(db, 'sessions', sessionId, 'players', player.id)
      batch.update(playerRef, { score: player.score })
    })

    await batch.commit()
  },

  // ========================================
  // HISTORY OPERATIONS
  // ========================================

  /**
   * Get finished game sessions for history
   */
  async getFinishedGames(limitCount: number = 20) {
    const q = query(
      collection(db, 'sessions'),
      where('status', '==', 'FINISHED'),
      where('endedAt', '!=', null),
      orderBy('endedAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)

    // Map sessions without fetching players (Deep Read Optimization)
    // The history list only needs the summary data stored on the session document.
    const sessions = snapshot.docs.map((sessionDoc) => {
      const sessionData = convertSessionDoc(sessionDoc)

      return {
        ...sessionData,
        players: [], // Optimization: Do not fetch players for history list
        // Convert Timestamps to Dates for compatibility
        createdAt: timestampToDate(sessionData.createdAt),
        endedAt: timestampToDate(sessionData.endedAt),
        playedAt: timestampToDate(sessionData.playedAt),
      }
    })

    return sessions
  },

  /**
   * Save game history (Max 10 entries)
   */
  async saveGameHistory(
    historyData: Omit<import('@/types/history').HistoryDocument, 'id'>
  ) {
    const historyRef = collection(db, 'history')

    // 1. Get existing history count
    const q = query(historyRef, orderBy('playedAt', 'asc'))
    const snapshot = await getDocs(q)

    // 2. Manage Limit (Max 10)
    if (snapshot.size >= 10) {
      const oldestDoc = snapshot.docs[0]
      await deleteDoc(doc(db, 'history', oldestDoc.id))
    }

    // 3. Add new entry
    await addDoc(historyRef, historyData)
  },

  /**
   * Archive a game session (mark as finished with metadata)
   */
  async archiveGameSession(
    sessionId: string,
    metadata: {
      winnerName: string | null
      loserName: string | null
      roundsPlayed: number
      difficultyLabel: string
    }
  ) {
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, {
      status: 'FINISHED',
      endedAt: Timestamp.now(),
      playedAt: Timestamp.now(),
      winnerName: metadata.winnerName,
      loserName: metadata.loserName || null,
      roundsPlayed: metadata.roundsPlayed,
      difficultyLabel: metadata.difficultyLabel,
    })
  },

  // ========================================
  // DARES OPERATIONS
  // ========================================

  /**
   * Get dares by difficulty level
   */
  async getDaresByDifficulty(difficultyLevel: number) {
    const q = query(
      collection(db, 'dares'),
      where('difficultyLevel', '==', difficultyLevel)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as DareDocument
    )
  },

  /**
   * Get filtered dares by difficulty and tags
   */
  async getFilteredDares(difficultyLevel: number, tags: string[]) {
    const q = query(
      collection(db, 'dares'),
      where('difficultyLevel', '==', difficultyLevel),
      where('categoryTags', 'array-contains-any', tags)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as DareDocument
    )
  },

  // ========================================
  // USERS OPERATIONS
  // ========================================

  /**
   * Create a new user
   */
  async createUser(username: string) {
    const userRef = doc(collection(db, 'users'))
    const userData: UserDocument = {
      id: userRef.id,
      username,
      gamesPlayed: 0,
      createdAt: Timestamp.now(),
    }

    await setDoc(userRef, userData)
    return userRef.id
  },

  /**
   * Get a user by ID
   */
  async getUser(userId: string) {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return null
    }

    return {
      id: userSnap.id,
      ...userSnap.data(),
    } as UserDocument
  },

  /**
   * Increment user's games played count
   */
  async incrementUserGamesPlayed(userId: string) {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { gamesPlayed: increment(1) })
  },

  // ========================================
  // REAL-TIME LISTENERS
  // ========================================

  /**
   * Subscribe to session changes
   */
  subscribeToSession(
    sessionId: string,
    callback: (session: SessionDocument | null) => void
  ): Unsubscribe {
    const sessionRef = doc(db, 'sessions', sessionId)

    return onSnapshot(
      sessionRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(convertSessionDoc(docSnap))
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error('Error subscribing to session:', error)
        callback(null)
      }
    )
  },

  /**
   * Subscribe to session players
   */
  subscribeToPlayers(
    sessionId: string,
    callback: (players: Player[]) => void
  ): Unsubscribe {
    const playersRef = collection(db, 'sessions', sessionId, 'players')
    const q = query(playersRef, orderBy('createdAt', 'asc'))

    return onSnapshot(
      q,
      (querySnap) => {
        const players = querySnap.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Ensure createdAt is converted to a Date object if it's a Timestamp
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : null,
          } as Player
        })
        callback(players)
      },
      (error) => {
        console.error('Error subscribing to players:', error)
        callback([])
      }
    )
  },

  // ========================================
  // ATOMIC UPDATES (GAME ACTIONS)
  // ========================================

  /**
   * Decrement a player attribute atomically (jokers, rerolls, exchange)
   */
  async decrementPlayerAttribute(
    sessionId: string,
    playerId: string,
    attribute: 'jokersLeft' | 'rerollsLeft' | 'exchangeLeft'
  ) {
    const playerRef = doc(db, 'sessions', sessionId, 'players', playerId)
    await updateDoc(playerRef, {
      [attribute]: increment(-1),
    })
  },

  /**
   * Swap two players' positions by exchanging their createdAt timestamps
   * This effectively changes their turn order since the list is sorted by createdAt
   */
  async swapPlayersPositions(
    sessionId: string,
    player1: Player,
    player2: Player
  ) {
    const batch = writeBatch(db)

    const p1Ref = doc(db, 'sessions', sessionId, 'players', player1.id)
    const p2Ref = doc(db, 'sessions', sessionId, 'players', player2.id)

    // Swap createdAt timestamps
    // We need to handle both Date and Timestamp types safely
    const p1Date =
      player1.createdAt instanceof Date ? player1.createdAt : new Date()
    const p2Date =
      player2.createdAt instanceof Date ? player2.createdAt : new Date()

    const { Timestamp } = await import('firebase/firestore')

    batch.update(p1Ref, { createdAt: Timestamp.fromDate(p2Date) })
    batch.update(p2Ref, { createdAt: Timestamp.fromDate(p1Date) })

    await batch.commit()
  },

  /**
   * Update game turn (next player, next dare, round info)
   */
  async updateGameTurn(
    sessionId: string,
    updates: {
      currentTurnPlayerId: string
      currentDare: Record<string, unknown>
      roundsCompleted?: number
      playersPlayedThisRound?: number
      settings?: Partial<GameSettings>
      startedAt?: Timestamp
      turnCounter?: ReturnType<typeof increment> | number // V9.3: Allow increment() or number
      swapUsedByPlayerIds?: string[] // V9.4: All players who used swap this turn
    }
  ) {
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, { ...updates })
  },
}
