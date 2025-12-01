import { prisma } from '@/lib/prisma'

export const historyService = {
    async getGameHistory(limit: number = 20) {
        try {
            const history = await prisma.session.findMany({
                where: {
                    status: 'FINISHED',
                    endedAt: { not: null }
                } as any, // Type assertion to work around Prisma client cache
                orderBy: [
                    { playedAt: 'desc' },
                    { endedAt: 'desc' }
                ] as any,
                include: {
                    players: true
                },
                take: limit
            })
            return history
        } catch (error) {
            console.error('Error fetching game history in service:', error)
            throw error
        }
    }
}
