import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SavedGame, SavedPlayer } from '@/types/saved-game'
import { GameSession, Player } from '@/types/index'

interface SavedGameStore {
    savedGame: SavedGame | null

    // Actions
    saveGame: (session: GameSession) => void
    loadGame: () => SavedGame | null
    deleteGame: () => void
    hasSavedGame: () => boolean
}

export const useSavedGameStore = create<SavedGameStore>()(
    persist(
        (set, get) => ({
            savedGame: null,

            saveGame: (session: GameSession) => {
                if (!session) return

                // Guard: Don't save finished games
                if (session.status === 'FINISHED') {
                    console.log('🚫 Refusing to save finished game')
                    return
                }

                // Guard: Don't save if all rounds are completed
                if (session.roundsCompleted >= session.roundsTotal) {
                    console.log('🚫 Refusing to save completed game (rounds done)')
                    return
                }

                const currentPlayer = session.players.find(p => p.id === session.currentTurnPlayerId)

                // Map players to SavedPlayer format
                const savedPlayers: SavedPlayer[] = session.players.map(p => ({
                    id: p.id,
                    name: p.name,
                    avatarUri: p.avatar || undefined,
                    score: p.score,
                    gagesCompleted: 0, // Placeholder as we don't track this yet
                    gagesFailed: 0, // Placeholder
                    sentencesReceived: 0, // Placeholder
                    jokers: p.jokersLeft,
                    rerolls: p.rerollsLeft,
                    swaps: p.exchangeLeft,
                    isPaused: !!p.isPaused,
                    turnsPaused: 0, // Placeholder
                    preferences: p.preferences
                }))

                const savedGame: SavedGame = {
                    id: session.id,
                    savedAt: new Date(),
                    settings: {
                        difficulty: session.settings.difficulty,
                        totalTurns: session.roundsTotal,
                        categories: session.settings.tags,
                        alcoholMode: session.settings.alcoholMode,
                        timerDuration: session.settings.timerDuration,
                        isProgressiveMode: session.isProgressiveMode
                    },
                    currentTurn: session.roundsCompleted + 1, // Display purposes? Round 1-based?
                    roundsCompleted: session.roundsCompleted,
                    turnCounter: session.turnCounter,
                    currentPlayerId: session.currentTurnPlayerId || '',
                    currentBoardState: {
                        playersPlayedThisRound: session.playersPlayedThisRound
                    },
                    players: savedPlayers,
                    preview: {
                        playerNames: session.players.map(p => p.name),
                        turnInfo: `Tour ${session.roundsCompleted + 1}/${session.roundsTotal}`,
                        currentPlayerName: currentPlayer ? `C'est à ${currentPlayer.name}` : ''
                    }
                }

                set({ savedGame })
            },

            loadGame: () => {
                return get().savedGame
            },

            deleteGame: () => {
                set({ savedGame: null })
            },

            hasSavedGame: () => {
                return !!get().savedGame
            }
        }),
        {
            name: 'social-chaos-saved-game', // localStorage key
            // Version-based migration + stale game cleanup
            onRehydrateStorage: () => (state) => {

                // Version-based migration: clear old saved games from before fix
                const CURRENT_VERSION = 2 // Increment this to force cleanup
                const storedVersion = localStorage.getItem('social-chaos-saved-game-version')

                if (storedVersion !== String(CURRENT_VERSION)) {
                    console.log('🔄 Version migration: clearing old saved game data')
                    localStorage.setItem('social-chaos-saved-game-version', String(CURRENT_VERSION))
                    if (state) {
                        state.savedGame = null
                    }
                    return
                }

                // Clean up stale saved games (> 24h old)
                if (state?.savedGame) {
                    const savedAt = new Date(state.savedGame.savedAt).getTime()
                    const now = Date.now()
                    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

                    if (now - savedAt > maxAge) {
                        console.log('🧹 Cleaning up stale saved game (>24h old)')
                        state.savedGame = null
                    }
                }
            }
        }
    )
)
