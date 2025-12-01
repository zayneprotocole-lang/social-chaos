import { prisma } from '@/lib/prisma'
import { GameSession } from '@/lib/types'

export const gameService = {
    async archiveGame(sessionId: string, sessionData: GameSession) {
        try {
            // Calculate winner and loser
            const sortedPlayers = [...sessionData.players].sort((a, b) => b.score - a.score)
            const winner = sortedPlayers[0]
            const loser = sortedPlayers[sortedPlayers.length - 1]

            // Get difficulty label
            const difficultyLabels = ['Échauffement', 'Audace', 'Chaos', 'Apocalypse']
            const difficultyLabel = difficultyLabels[sessionData.settings.difficulty - 1] || 'Inconnu'

            // Update the session in the database to mark it as finished
            await prisma.session.update({
                where: { roomCode: sessionId },
                data: {
                    status: 'FINISHED',
                    endedAt: new Date(),
                    playedAt: new Date(), // V9.1: Track when game was played
                    roundsCompleted: sessionData.roundsCompleted,
                    // Store history metadata
                    winnerName: winner?.name || null,
                    loserName: loser?.name || null,
                    roundsPlayed: sessionData.roundsCompleted,
                    difficultyLabel: difficultyLabel,
                    // We could also update players here if we want to persist final scores
                    players: {
                        updateMany: sessionData.players.map(p => ({
                            where: { id: p.id },
                            data: { score: p.score }
                        }))
                    }
                } as any // Type assertion to work around Prisma client cache issue
            })

            // Also explicitly update players individually to be sure
            const playerUpdates = sessionData.players.map(p =>
                prisma.sessionPlayer.update({
                    where: { id: p.id },
                    data: { score: p.score }
                })
            )

            await prisma.$transaction(playerUpdates)

            return { success: true }
        } catch (error) {
            console.error('Error archiving game in service:', error)
            throw error
        }
    }
}
