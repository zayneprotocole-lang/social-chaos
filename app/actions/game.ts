'use server'

import { GameSession } from '@/lib/types'
import { gameService } from '@/lib/services/gameService'
import { historyService } from '@/lib/services/historyService'

export async function archiveGame(sessionId: string, sessionData: GameSession) {
    try {
        await gameService.archiveGame(sessionId, sessionData)
        return { success: true }
    } catch (error) {
        console.error('Error archiving game action:', error)
        return { success: false, error }
    }
}

export async function getGameHistory() {
    try {
        const history = await historyService.getGameHistory()
        return history
    } catch (error) {
        console.error('Error fetching game history action:', error)
        return []
    }
}
