import { useSessionQuery } from '@/hooks/useSessionQuery'
import { MOCK_DARES } from '@/lib/constants/dares'

/**
 * Hook for managing game session in a pass-and-play context
 * All players share the same device, so no "current user" tracking needed
 *
 * NOTE: Authentication is now required at the route level (protected routes)
 */
export function useGameSession(roomId: string) {
  // Authentication check removed - now handled by protected routes

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
