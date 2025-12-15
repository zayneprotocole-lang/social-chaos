import { useEffect } from 'react'
import { useSessionQuery } from '@/hooks/useSessionQuery'
import { ensureAuthenticated } from '@/lib/firebase/auth'
import { MOCK_DARES } from '@/lib/constants/dares'

/**
 * Hook for managing game session in a pass-and-play context
 * All players share the same device, so no "current user" tracking needed
 */
export function useGameSession(roomId: string) {
  // Ensure anonymous authentication before accessing Firestore
  useEffect(() => {
    ensureAuthenticated().catch((error) => {
      console.error('Failed to authenticate:', error)
    })
  }, [])

  // Use the new Query hook
  const { session, isLoading, isFetching, error } = useSessionQuery(roomId)

  const currentPlayer = session?.players.find(
    (p) => p.id === session.currentTurnPlayerId
  )
  const isGameFinished = session ? session.status === 'FINISHED' : false

  return {
    session,
    currentPlayer,
    isGameFinished,
    isLoading,
    isFetching,
    error,
    MOCK_DARES,
  }
}
