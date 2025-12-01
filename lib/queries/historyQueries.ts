'use client'

import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/firestore'
import type { SessionDocument, SessionPlayerDocument } from '@/types'
import { sessionDocumentSchema } from '@/lib/validation/sessionSchema'

/**
 * Fetch completed game sessions for history display.
 * Uses React Query for caching and automatic refetching.
 */
export function useGameHistory() {
  return useQuery({
    queryKey: ['gameHistory'],
    queryFn: async () => {
      const sessionsRef = collection(db, 'sessions')
      const q = query(
        sessionsRef,
        where('status', '==', 'FINISHED'),
        orderBy('playedAt', 'desc')
      )

      const snapshot = await getDocs(q)
      const sessions: SessionDocument[] = []

      snapshot.forEach((doc) => {
        try {
          const data = doc.data()
          // Validate with Zod
          const validatedData = sessionDocumentSchema.parse({
            id: doc.id,
            ...data,
          })
          sessions.push(validatedData as SessionDocument)
        } catch (error) {
          console.error('Invalid session data:', error)
          // Skip invalid sessions
        }
      })

      return sessions
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Fetch a single game session by ID.
 */
export function useGameSession(sessionId: string | null) {
  return useQuery({
    queryKey: ['gameSession', sessionId],
    queryFn: async () => {
      if (!sessionId) return null

      const sessionsRef = collection(db, 'sessions')
      const q = query(sessionsRef, where('id', '==', sessionId))
      const snapshot = await getDocs(q)

      if (snapshot.empty) return null

      const doc = snapshot.docs[0]
      const data = doc.data()

      // Validate with Zod
      const validatedData = sessionDocumentSchema.parse({
        id: doc.id,
        ...data,
      })

      return validatedData as SessionDocument
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Fetch players for a specific game session (subcollection).
 */
export function useSessionPlayers(sessionId: string) {
  return useQuery<SessionPlayerDocument[]>({
    queryKey: ['sessionPlayers', sessionId],
    queryFn: async () => {
      if (!sessionId) return []

      const playersRef = collection(db, 'sessions', sessionId, 'players')
      const snapshot = await getDocs(playersRef)

      // Map to Player type (assuming data is consistent, or add validation if needed)
      const players = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SessionPlayerDocument[]

      return players
    },
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes (history doesn't change often)
  })
}
