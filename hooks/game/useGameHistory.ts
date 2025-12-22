/**
 * useGameHistory - Sauvegarde de l'historique de fin de partie
 *
 * Responsabilités:
 * - Calcul du classement final
 * - Sauvegarde dans localStorage (Offline-First)
 * - Sauvegarde dans Firestore (optionnel)
 * - Archivage de la session
 */

import { useCallback } from 'react'
import { GameSession, Player } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'

interface UseGameHistoryProps {
  session: GameSession | null
}

interface GameEndData {
  roundsCompleted: number
}

interface UseGameHistoryReturn {
  saveGameHistory: (data: GameEndData) => Promise<void>
}

/**
 * Calculate remaining actions for a player (for tiebreaker)
 */
function getActionsRemaining(player: Player): number {
  return (
    (player.jokersLeft || 0) +
    (player.rerollsLeft || 0) +
    (player.exchangeLeft || 0)
  )
}

export function useGameHistory({
  session,
}: UseGameHistoryProps): UseGameHistoryReturn {
  const saveGameHistory = useCallback(
    async (data: GameEndData) => {
      if (!session) return

      const { roundsCompleted } = data
      const isSoloMode = session.players.length === 1

      // V9.6: Separate Competitors vs Adventurers (Disqualified)
      const adventurers = session.players.filter((p) => p.hasBeenPaused)
      const competitors = session.players.filter((p) => !p.hasBeenPaused)

      // Rank only competitors if possible (fallback to adventurers if everyone paused)
      const rankingPool = competitors.length > 0 ? competitors : adventurers

      const sortedPlayers = [...rankingPool].sort((a, b) => {
        // Primary: Higher score wins
        if (b.score !== a.score) {
          return b.score - a.score
        }
        // Tiebreaker: More actions remaining = better
        return getActionsRemaining(b) - getActionsRemaining(a)
      })

      const winner = sortedPlayers[0]
      const loser = isSoloMode ? null : sortedPlayers[sortedPlayers.length - 1]

      const difficultyLabel =
        DIFFICULTY_CONFIG[session.settings.difficulty]?.name || 'Inconnu'

      // 1. PRIORITY: Save to Local Storage FIRST (Offline-First)
      try {
        const { localHistory } = await import('@/lib/services/historyStorage')
        localHistory.save({
          winner: {
            id: winner.id,
            name: winner.name,
            avatar: winner.avatar || null,
            score: winner.score,
          },
          loser: loser
            ? {
                id: loser.id,
                name: loser.name,
                avatar: loser.avatar || null,
                score: loser.score,
              }
            : null,
          otherPlayers: sortedPlayers
            .filter((p) => p.id !== winner.id && (!loser || p.id !== loser.id))
            .map((p) => ({ name: p.name, avatar: p.avatar || null })),
          adventurers: adventurers.map((p) => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar || null,
            score: p.score,
          })),
          totalRounds: roundsCompleted,
          difficulty: session.settings.difficulty,
          categories: session.settings.tags,
          playedAt: Date.now(),
          isSoloMode,
        })
      } catch (localError) {
        console.error('❌ Failed to save to localStorage:', localError)
      }

      // 2. OPTIONAL: Save to Firestore (may fail, that's OK)
      try {
        const { Timestamp } = await import('firebase/firestore')

        await dataAccess.saveGameHistory({
          winner: {
            id: winner.id,
            name: winner.name,
            avatar: winner.avatar || null,
            score: winner.score,
          },
          loser: loser
            ? {
                id: loser.id,
                name: loser.name,
                avatar: loser.avatar || null,
                score: loser.score,
              }
            : null,
          otherPlayers: sortedPlayers
            .filter((p) => p.id !== winner.id && (!loser || p.id !== loser.id))
            .map((p) => ({ name: p.name, avatar: p.avatar || null })),
          adventurers: adventurers.map((p) => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar || null,
            score: p.score,
          })),
          totalRounds: roundsCompleted,
          difficulty: session.settings.difficulty,
          categories: session.settings.tags,
          playedAt: Timestamp.now(),
          isSoloMode,
        })

        // 3. Mark Session as Finished
        await dataAccess.archiveGameSession(session.id, {
          winnerName: winner.name,
          loserName: loser ? loser.name : null,
          roundsPlayed: roundsCompleted,
          difficultyLabel,
        })
      } catch (firestoreError) {
        console.error(
          '⚠️ Firestore save failed (localStorage still saved):',
          firestoreError
        )
      }

      // 4. Clear saved game and active session
      try {
        const { useSavedGameStore } =
          await import('@/lib/store/useSavedGameStore')
        const { useGameStore } = await import('@/lib/store/useGameStore')

        useSavedGameStore.getState().deleteGame()
        useGameStore.getState().setActiveSession(null, null)
      } catch (e) {
        console.error('Failed to clear game state:', e)
      }
    },
    [session]
  )

  return {
    saveGameHistory,
  }
}
