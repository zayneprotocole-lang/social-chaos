import { useMutation } from '@tanstack/react-query'
import { dataAccess } from '@/lib/services/dataAccess'

export function useSessionMutations(sessionId: string) {
    const updateScoreMutation = useMutation({
        mutationFn: async ({ playerId, score }: { playerId: string; score: number }) => {
            await dataAccess.updatePlayerScore(sessionId, playerId, score)
        },
    })

    const updateGameTurnMutation = useMutation({
        mutationFn: async (updates: {
            currentTurnPlayerId: string
            currentDare: Record<string, unknown>
            roundsCompleted?: number
            playersPlayedThisRound?: number
        }) => {
            await dataAccess.updateGameTurn(sessionId, updates)
        },
    })

    const decrementAttributeMutation = useMutation({
        mutationFn: async ({
            playerId,
            attribute,
        }: {
            playerId: string
            attribute: 'jokersLeft' | 'rerollsLeft' | 'exchangeLeft'
        }) => {
            await dataAccess.decrementPlayerAttribute(sessionId, playerId, attribute)
        },
    })

    const updateSettingsMutation = useMutation({
        mutationFn: async (settings: Record<string, unknown>) => {
            await dataAccess.updateSession(sessionId, { settings })
        },
    })

    return {
        updateScore: updateScoreMutation.mutateAsync,
        updateGameTurn: updateGameTurnMutation.mutateAsync,
        decrementAttribute: decrementAttributeMutation.mutateAsync,
        updateSettings: updateSettingsMutation.mutateAsync,
    }
}
