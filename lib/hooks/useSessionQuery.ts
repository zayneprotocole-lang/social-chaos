import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { dataAccess } from '@/lib/services/dataAccess'
import { GameSession, SessionDocument } from '@/lib/types'
import { mapFirestoreToSession } from '@/lib/utils/firestoreMappers'

export function useSessionQuery(roomId: string) {
    const queryClient = useQueryClient()
    const queryKey = useMemo(() => ['session', roomId], [roomId])

    const { data: session, isLoading, error } = useQuery<GameSession | null>({
        queryKey,
        queryFn: async () => {
            const doc = await dataAccess.getSession(roomId)
            if (!doc) return null
            const players = await dataAccess.getSessionPlayers(roomId)
            return mapFirestoreToSession(doc.id, doc as SessionDocument, players)
        },
        enabled: !!roomId,
        staleTime: Infinity,
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
