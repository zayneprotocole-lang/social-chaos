import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { Dare } from '@/lib/types'
import { useSessionQuery } from '@/lib/hooks/useSessionQuery'
import { ensureAuthenticated } from '@/lib/firebase/auth'

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
  const { currentUser, setCurrentUser } = useGameStore()

  // Ensure anonymous authentication before accessing Firestore
  useEffect(() => {
    ensureAuthenticated().catch((error) => {
      console.error('Failed to authenticate:', error)
    })
  }, [])

  // Use the new Query hook
  const { session, isLoading: loading, error } = useSessionQuery(roomId)

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
