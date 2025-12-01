/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { dataAccess } from '@/lib/services/dataAccess'
import { mapFirestoreToSession } from '@/lib/utils/firestoreMappers'
import { Dare, SessionDocument } from '@/lib/types'

// Mock Dares for demo (moved from page.tsx) - KEEPING THIS FOR NOW as we might need it for fallback or testing
// In a real scenario, dares should come from the DB too, but the prompt focuses on Session/State logic.
const MOCK_DARES: Dare[] = [
  {
    id: '1',
    content: 'Fais 10 pompes ou bois 2 gorgées.',
    difficultyLevel: 1,
    categoryTags: ['Soft'],
    xpReward: 10,
  },
  {
    id: '2',
    content: 'Raconte ta pire honte.',
    difficultyLevel: 2,
    categoryTags: ['Humiliant'],
    xpReward: 20,
  },
  {
    id: '3',
    content: 'Envoie un SMS à ton ex.',
    difficultyLevel: 4,
    categoryTags: ['Chaos'],
    xpReward: 50,
  },
  {
    id: '4',
    content: 'Danse sans musique pendant 1 minute.',
    difficultyLevel: 2,
    categoryTags: ['Fun'],
    xpReward: 15,
  },
]

export function useGameSession(roomId: string) {
  const { session, setSession, currentUser, setCurrentUser } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to Session Updates
  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    // 1. Subscribe to the Session Document
    const unsubscribeSession = dataAccess.subscribeToSession(
      roomId,
      (updatedSessionDoc) => {
        if (updatedSessionDoc) {
          setSession((prevSession) => {
            // If we already have a session, preserve the players
            const currentPlayers = prevSession?.players || []

            // Use the mapper to transform Firestore doc to GameSession
            // We cast updatedSessionDoc to SessionDocument because dataAccess returns it with ID but types might be loose
            return mapFirestoreToSession(
              updatedSessionDoc.id,
              updatedSessionDoc as SessionDocument,
              currentPlayers
            )
          })
        } else {
          setError('Session not found')
        }
        setLoading(false)
      }
    )

    // 2. Subscribe to the Players Subcollection
    const unsubscribePlayers = dataAccess.subscribeToPlayers(
      roomId,
      (updatedPlayers) => {
        setSession((prevSession) => {
          if (!prevSession) return null

          return {
            ...prevSession,
            players: updatedPlayers,
          }
        })
      }
    )

    return () => {
      unsubscribeSession()
      unsubscribePlayers()
    }
  }, [roomId, setSession, setError])

  // Update currentUser in store when players change
  useEffect(() => {
    if (session?.players && currentUser?.id) {
      const updatedUser = session.players.find((p) => p.id === currentUser.id)
      if (
        updatedUser &&
        JSON.stringify(updatedUser) !== JSON.stringify(currentUser)
      ) {
        setCurrentUser(updatedUser)
      }
    }
  }, [session?.players, currentUser, currentUser?.id, setCurrentUser])

  const currentPlayer = session?.players.find(
    (p) => p.id === session.currentTurnPlayerId
  )
  const isMyTurn = currentUser?.id === currentPlayer?.id
  const isGameFinished = session ? session.status === 'FINISHED' : false

  return {
    session,
    currentPlayer,
    isMyTurn,
    isGameFinished,
    loading,
    error,
    MOCK_DARES,
  }
}
