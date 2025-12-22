/**
 * useGameTurn - Gestion des transitions de tour
 *
 * Responsabilités:
 * - Sélection du prochain joueur
 * - Filtrage des défis par préférences
 * - Calcul de la progression
 * - Mode progressif (ajustement difficulté)
 */

import { useCallback } from 'react'
import { GameSession, Dare, Player } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'

interface UseGameTurnProps {
  session: GameSession | null
  dares: Dare[]
}

interface TurnTransitionResult {
  isGameEnd: boolean
  roundsCompleted: number
}

interface UseGameTurnReturn {
  getNextPlayer: () => {
    player: Player | null
    nextIndex: number
  }
  filterDaresForPlayer: (playerId: string) => Dare[]
  advanceToNextTurn: () => Promise<TurnTransitionResult>
  awardPointToPlayer: (playerId: string) => Promise<void>
}

export function useGameTurn({
  session,
  dares,
}: UseGameTurnProps): UseGameTurnReturn {
  /**
   * Get the next non-paused player in turn order
   */
  const getNextPlayer = useCallback(() => {
    if (!session) return { player: null, nextIndex: -1 }

    const currentIndex = session.players.findIndex(
      (p) => p.id === session.currentTurnPlayerId
    )
    let nextIndex = currentIndex
    let attempts = 0

    // Find next non-paused player
    do {
      nextIndex = (nextIndex + 1) % session.players.length
      attempts++
    } while (
      session.players[nextIndex].isPaused &&
      attempts < session.players.length
    )

    return {
      player: session.players[nextIndex],
      nextIndex,
    }
  }, [session])

  /**
   * Filter dares based on player preferences
   */
  const filterDaresForPlayer = useCallback(
    (playerId: string): Dare[] => {
      if (!session) return dares

      const player = session.players.find((p) => p.id === playerId)
      if (!player) return dares

      const preferences = player.preferences || { want: [], avoid: [] }
      const excludedCategories = preferences.avoid || []
      const preferredCategories = preferences.want || []

      // 1. Filter out AVOID categories
      let availableDares = dares.filter((dare) => {
        return !dare.categoryTags.some((tag) =>
          excludedCategories.includes(tag)
        )
      })

      // Fallback if filtering leaves no dares
      if (availableDares.length === 0) {
        console.warn(
          `No dares available for ${player.name} with avoids: ${excludedCategories}. Using all dares.`
        )
        availableDares = dares
      }

      // 2. Prioritize WANT categories (20% chance to use preferred subset)
      const preferredSubset = availableDares.filter((dare) =>
        dare.categoryTags.some((tag) => preferredCategories.includes(tag))
      )
      if (preferredSubset.length > 0 && Math.random() < 0.2) {
        return preferredSubset
      }

      return availableDares
    },
    [session, dares]
  )

  /**
   * Advance to the next turn - updates Firestore
   */
  const advanceToNextTurn =
    useCallback(async (): Promise<TurnTransitionResult> => {
      if (!session) return { isGameEnd: false, roundsCompleted: 0 }

      const { player: nextPlayer } = getNextPlayer()
      if (!nextPlayer)
        return { isGameEnd: false, roundsCompleted: session.roundsCompleted }

      // Calculate round progress
      const activePlayersCount = session.players.filter(
        (p) => !p.isPaused
      ).length
      let playersPlayed = (session.playersPlayedThisRound || 0) + 1
      let roundsCompleted = session.roundsCompleted

      if (playersPlayed >= activePlayersCount) {
        roundsCompleted += 1
        playersPlayed = 0
      }

      // Check game end condition
      const roundsTotal = Number(session.roundsTotal) || 10
      if (roundsCompleted >= roundsTotal) {
        return { isGameEnd: true, roundsCompleted }
      }

      // Pick random dare for next player
      const filteredDares = filterDaresForPlayer(nextPlayer.id)
      const randomDare =
        filteredDares[Math.floor(Math.random() * filteredDares.length)]

      // Progressive Mode: Calculate new difficulty
      let newDifficulty = session.settings.difficulty
      if (session.isProgressiveMode) {
        const progress = roundsCompleted / roundsTotal
        newDifficulty = Math.min(
          4,
          Math.max(1, Math.floor(progress * 4) + 1)
        ) as 1 | 2 | 3 | 4
      }

      const { Timestamp, increment } = await import('firebase/firestore')

      await dataAccess.updateGameTurn(session.id, {
        currentTurnPlayerId: nextPlayer.id,
        currentDare: randomDare as unknown as Record<string, unknown>,
        playersPlayedThisRound: playersPlayed,
        roundsCompleted,
        startedAt: Timestamp.now(),
        turnCounter: increment(1),
        swapUsedByPlayerIds: [],
        ...(session.isProgressiveMode &&
          newDifficulty !== session.settings.difficulty && {
            'settings.difficulty': newDifficulty,
          }),
      })

      return { isGameEnd: false, roundsCompleted }
    }, [session, getNextPlayer, filterDaresForPlayer])

  /**
   * Award a point to a player
   */
  const awardPointToPlayer = useCallback(
    async (playerId: string) => {
      if (!session) return

      const player = session.players.find((p) => p.id === playerId)
      if (!player) return

      await dataAccess.updatePlayerScore(
        session.id,
        playerId,
        (player.score || 0) + 1
      )
    },
    [session]
  )

  return {
    getNextPlayer,
    filterDaresForPlayer,
    advanceToNextTurn,
    awardPointToPlayer,
  }
}
