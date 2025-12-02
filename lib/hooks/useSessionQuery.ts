import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { dataAccess } from '@/lib/services/dataAccess'
import { GameSession, SessionDocument } from '@/lib/types'
import { mapFirestoreToSession } from '@/lib/utils/firestoreMappers'

export function useSessionQuery(roomId: string) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['session', roomId], [roomId])

  const {
    data: session,
    isLoading,
    error,
  } = useQuery<GameSession | null>({
    queryKey,
    queryFn: async () => {
      // Task 7.1: Minimal Session Loading & Parallel Fetching
      // Fetch session and players in parallel to minimize network wait time
      const [doc, players] = await Promise.all([
        dataAccess.getSession(roomId),
        dataAccess.getSessionPlayers(roomId),
      ])

      if (!doc) return null

      return mapFirestoreToSession(doc.id, doc as SessionDocument, players)
    },
    enabled: !!roomId,
    // Task 7.1: Strategic Caching
    // Serve from cache instantly (Infinity) and rely on real-time listeners for updates
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 mins
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (!roomId) return

    const unsubscribeSession = dataAccess.subscribeToSession(
      roomId,
      (updatedSessionDoc) => {
        queryClient.setQueryData<GameSession | null>(queryKey, (oldSession) => {
          if (!updatedSessionDoc) return null
          const currentPlayers = oldSession?.players || []
          return mapFirestoreToSession(
            updatedSessionDoc.id,
            updatedSessionDoc as SessionDocument,
            currentPlayers
          )
        })
      }
    )

    const unsubscribePlayers = dataAccess.subscribeToPlayers(
      roomId,
      (updatedPlayers) => {
        queryClient.setQueryData<GameSession | null>(queryKey, (oldSession) => {
          if (!oldSession) return null
          return {
            ...oldSession,
            players: updatedPlayers,
          }
        })
      }
    )

    return () => {
      unsubscribeSession()
      unsubscribePlayers()
    }
  }, [roomId, queryClient, queryKey])

  return { session, isLoading, error }
}
