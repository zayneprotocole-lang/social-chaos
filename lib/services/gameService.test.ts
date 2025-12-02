import { describe, it, expect } from 'vitest'
import {
    calculateNextPlayer,
    determineWinnerAndLoser,
    calculateRoundProgression,
} from './gameService'
import { GameSession, Player } from '@/lib/types'

describe('gameService', () => {
    describe('calculateNextPlayer', () => {
        it('should return the next player in order', () => {
            const mockSession: Partial<GameSession> = {
                players: [
                    { id: '1', name: 'Player 1', score: 0, isPaused: false } as Player,
                    { id: '2', name: 'Player 2', score: 0, isPaused: false } as Player,
                    { id: '3', name: 'Player 3', score: 0, isPaused: false } as Player,
                ],
            }

            const nextPlayer = calculateNextPlayer(
                mockSession as GameSession,
                '1'
            )

            expect(nextPlayer?.id).toBe('2')
        })

        it('should skip paused players', () => {
            const mockSession: Partial<GameSession> = {
                players: [
                    { id: '1', name: 'Player 1', score: 0, isPaused: false } as Player,
                    { id: '2', name: 'Player 2', score: 0, isPaused: true } as Player,
                    { id: '3', name: 'Player 3', score: 0, isPaused: false } as Player,
                ],
            }

            const nextPlayer = calculateNextPlayer(
                mockSession as GameSession,
                '1'
            )

            expect(nextPlayer?.id).toBe('3')
        })

        it('should wrap around to the first player', () => {
            const mockSession: Partial<GameSession> = {
                players: [
                    { id: '1', name: 'Player 1', score: 0, isPaused: false } as Player,
                    { id: '2', name: 'Player 2', score: 0, isPaused: false } as Player,
                ],
            }

            const nextPlayer = calculateNextPlayer(
                mockSession as GameSession,
                '2'
            )

            expect(nextPlayer?.id).toBe('1')
        })
    })

    describe('determineWinnerAndLoser', () => {
        it('should correctly identify winner and loser', () => {
            const players: Player[] = [
                { id: '1', name: 'Player 1', score: 5 } as Player,
                { id: '2', name: 'Player 2', score: 10 } as Player,
                { id: '3', name: 'Player 3', score: 3 } as Player,
            ]

            const { winner, loser } = determineWinnerAndLoser(players)

            expect(winner.id).toBe('2')
            expect(winner.score).toBe(10)
            expect(loser.id).toBe('3')
            expect(loser.score).toBe(3)
        })
    })

    describe('calculateRoundProgression', () => {
        it('should increment playersPlayed', () => {
            const mockSession: Partial<GameSession> = {
                playersPlayedThisRound: 0,
                roundsCompleted: 0,
            }

            const result = calculateRoundProgression(
                mockSession as GameSession,
                3
            )

            expect(result.playersPlayed).toBe(1)
            expect(result.roundsCompleted).toBe(0)
        })

        it('should increment round when all players have played', () => {
            const mockSession: Partial<GameSession> = {
                playersPlayedThisRound: 2,
                roundsCompleted: 0,
            }

            const result = calculateRoundProgression(
                mockSession as GameSession,
                3
            )

            expect(result.playersPlayed).toBe(0)
            expect(result.roundsCompleted).toBe(1)
        })
    })
})
