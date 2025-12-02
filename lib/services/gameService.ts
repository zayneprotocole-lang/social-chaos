import { GameSession, Player } from '@/types'
import { dataAccess } from './dataAccess'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'

/**
 * Calculate the next player in turn order
 */
export function calculateNextPlayer(
  session: GameSession,
  currentPlayerId: string
): Player | null {
  const currentIndex = session.players.findIndex(
    (p) => p.id === currentPlayerId
  )

  if (currentIndex === -1) return null

  let nextIndex = currentIndex
  let attempts = 0

  do {
    nextIndex = (nextIndex + 1) % session.players.length
    attempts++
  } while (
    session.players[nextIndex].isPaused &&
    attempts < session.players.length
  )

  return session.players[nextIndex]
}

/**
 * Determine winner and loser
 */
export function determineWinnerAndLoser(players: Player[]): {
  winner: Player
  loser: Player
} {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  return {
    winner: sortedPlayers[0],
    loser: sortedPlayers[sortedPlayers.length - 1],
  }
}

/**
 * Calculate round progression
 */
export function calculateRoundProgression(
  session: GameSession,
  activePlayersCount: number
): {
  playersPlayed: number
  roundsCompleted: number
} {
  let playersPlayed = (session.playersPlayedThisRound || 0) + 1
  let roundsCompleted = session.roundsCompleted

  if (playersPlayed >= activePlayersCount) {
    roundsCompleted += 1
    playersPlayed = 0
  }

  return { playersPlayed, roundsCompleted }
}

export const gameService = {
  async archiveGame(sessionId: string, sessionData: GameSession) {
    try {
      // Calculate winner and loser
      const { winner, loser } = determineWinnerAndLoser(sessionData.players)

      // Get difficulty label
      const difficultyLabel =
        DIFFICULTY_CONFIG[sessionData.settings.difficulty]?.name || 'Inconnu'

      // Archive the session with metadata
      await dataAccess.archiveGameSession(sessionId, {
        winnerName: winner?.name || null,
        loserName: loser?.name || null,
        roundsPlayed: sessionData.roundsCompleted,
        difficultyLabel: difficultyLabel,
      })

      // Update all player scores in batch
      await dataAccess.updateAllPlayerScores(sessionId, sessionData.players)

      return { success: true }
    } catch (error) {
      console.error('Error archiving game:', error)
      throw error
    }
  },
}
