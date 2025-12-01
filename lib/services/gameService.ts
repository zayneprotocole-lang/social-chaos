import { GameSession } from '@/types'
import { dataAccess } from './dataAccess'

export const gameService = {
  async archiveGame(sessionId: string, sessionData: GameSession) {
    try {
      // Calculate winner and loser
      const sortedPlayers = [...sessionData.players].sort(
        (a, b) => b.score - a.score
      )
      const winner = sortedPlayers[0]
      const loser = sortedPlayers[sortedPlayers.length - 1]

      // Get difficulty label
      const difficultyLabels = ['Échauffement', 'Audace', 'Chaos', 'Apocalypse']
      const difficultyLabel =
        difficultyLabels[sessionData.settings.difficulty - 1] || 'Inconnu'

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
