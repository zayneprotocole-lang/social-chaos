import { dataAccess } from './dataAccess'

export const historyService = {
  async getGameHistory(limit: number = 20) {
    try {
      const history = await dataAccess.getFinishedGames(limit)
      return history
    } catch (error) {
      console.error('Error fetching game history:', error)
      return []
    }
  },
}
