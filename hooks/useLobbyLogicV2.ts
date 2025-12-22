/**
 * Hook de logique du lobby refactorisé avec profils locaux
 *
 * Gère:
 * - Auto-inclusion de l'hôte
 * - Synchronisation lobby local → Firestore
 * - Validation mode solo (min 1 joueur)
 * - Config des actions selon le mode
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionQuery } from '@/hooks/useSessionQuery'
import { useSessionMutations } from '@/hooks/useSessionMutations'
import { GAME_CONFIG } from '@/lib/constants/config'
import { GameSettings } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'
import { MOCK_DARES } from '@/lib/constants/dares'
import { useQueryClient } from '@tanstack/react-query'

import { useLobbyStore, useLobbyPlayers } from '@/lib/store/useLobbyStore'
import { useHostProfile, useHasHostProfile } from '@/lib/store/useProfileStore'
import { useGameStore } from '@/lib/store/useGameStore'
import { useLoadingStore } from '@/lib/store/useLoadingStore'

// ========================================
// TYPES
// ========================================

export interface UseLobbyLogicV2Result {
  // Session state
  session: ReturnType<typeof useSessionQuery>['session']
  isLoading: boolean

  // Lobby players (from local store)
  lobbyPlayers: ReturnType<typeof useLobbyPlayers>
  playerCount: number
  isSoloMode: boolean

  // Host profile
  hostProfile: ReturnType<typeof useHostProfile>
  hasHostProfile: boolean
  needsProfileCreation: boolean

  // Settings
  roundsTotal: number
  isProgressiveMode: boolean

  // Actions
  handleSettingsUpdate: (updates: Partial<GameSettings>) => Promise<void>
  updateRoundsAndMode: (rounds: number, progressive: boolean) => void
  startGame: () => Promise<void>

  // Time estimation
  calculateTimeEstimation: () => { min: number; max: number }

  // Validation
  canStartGame: boolean
  startGameError: string | null
}

// ========================================
// HOOK
// ========================================

export function useLobbyLogicV2(code: string): UseLobbyLogicV2Result {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Session query
  const { session, isLoading } = useSessionQuery(code)
  const { updateSettings } = useSessionMutations(code)

  // Lobby store
  const lobbyPlayers = useLobbyPlayers()
  const initializeWithHost = useLobbyStore((s) => s.initializeWithHost)
  const getPlayersForSession = useLobbyStore((s) => s.getPlayersForSession)

  // Profile store
  const hostProfile = useHostProfile()
  const hasHostProfile = useHasHostProfile()

  // Game store
  const setActiveSession = useGameStore((s) => s.setActiveSession)

  // Settings state - explicitly type as number to avoid literal type inference
  const [roundsTotal, setRoundsTotal] = useState<number>(
    GAME_CONFIG.ROUNDS.DEFAULT
  )
  const [isProgressiveMode, setIsProgressiveMode] = useState(false)

  // Track if lobby was initialized for this session
  const lobbyInitialized = useRef(false)
  // Prevent double-click on start
  const isStartingGame = useRef(false)

  // Get resetLobby function
  const resetLobby = useLobbyStore((s) => s.resetLobby)

  // ========================================
  // RESET AND INITIALIZE LOBBY ON MOUNT
  // ========================================

  useEffect(() => {
    // Reset lobby when entering a new session (only once per mount)
    if (!lobbyInitialized.current) {
      resetLobby() // Clear old players
      lobbyInitialized.current = true
    }
  }, [resetLobby])

  // Add host profile after reset
  useEffect(() => {
    if (lobbyInitialized.current && hostProfile) {
      // Check if host is already in lobby (prevents duplicates)
      const players = useLobbyStore.getState().players
      const hostAlreadyInLobby = players.some(
        (p) => p.profileId === hostProfile.id
      )

      if (!hostAlreadyInLobby) {
        initializeWithHost(hostProfile)
      }
    }
  }, [hostProfile, initializeWithHost])

  // ========================================
  // COMPUTED VALUES
  // ========================================

  const playerCount = lobbyPlayers.length
  const isSoloMode = playerCount === 1
  const needsProfileCreation = !hasHostProfile && playerCount === 0

  // Validation
  const canStartGame = playerCount >= 1 // Mode solo autorisé
  const startGameError = playerCount === 0 ? 'Ajoutez au moins 1 joueur' : null

  // ========================================
  // HANDLERS
  // ========================================

  /**
   * Met à jour les settings de session
   */
  const handleSettingsUpdate = useCallback(
    async (updates: Partial<GameSettings>) => {
      if (!session) return
      const currentSettings = session.settings
      const newSettings = { ...currentSettings, ...updates }
      await updateSettings(newSettings)
    },
    [session, updateSettings]
  )

  /**
   * Met à jour rounds et mode progressif
   */
  const updateRoundsAndMode = useCallback(
    (rounds: number, progressive: boolean) => {
      setRoundsTotal(rounds)
      setIsProgressiveMode(progressive)
    },
    []
  )

  /**
   * Démarre la partie
   *
   * 1. Crée les joueurs dans Firestore depuis le lobby local
   * 2. Met à jour le status de la session
   * 3. Redirige vers la page de jeu
   */
  const startGame = useCallback(async () => {
    if (!session || !canStartGame) return

    // Prevent double-click
    if (isStartingGame.current) {
      return
    }
    isStartingGame.current = true

    // Show loading screen
    useLoadingStore.getState().show('Préparation de la partie...')

    try {
      // Récupérer les joueurs formatés pour Firestore
      const playersData = getPlayersForSession()

      // Import Timestamp dynamiquement
      const { Timestamp } = await import('firebase/firestore')

      // Ajouter les joueurs au Firestore et récupérer leurs IDs
      const createdPlayerIds: string[] = []

      for (const playerData of playersData) {
        try {
          const playerId = await dataAccess.addPlayerToSession(
            session.id,
            playerData
          )
          createdPlayerIds.push(playerId)
        } catch (playerError) {
          console.error(
            '❌ Failed to add player to session:',
            playerData.name,
            playerError
          )
          // Continue trying to add other players? Or abort?
          // Aborting is probably safer to avoid partial starts
          throw playerError
        }
      }

      if (createdPlayerIds.length === 0) {
        console.error('❌ No players were added to the session. Cannot start.')
        isStartingGame.current = false
        return
      }

      // Pre-load dares based on session settings (Classic/Indoor)
      const difficulty = session.settings.difficulty
      // Ensure tags is typed correctly as array of strings
      const tags = (session.settings.tags || ['Fun']) as string[]

      console.log('🎰 Starting Game with:', { difficulty, tags })

      let poolOfDares = await dataAccess.getFilteredDares(difficulty, tags)
      console.log('📦 Pool size from DataAccess:', poolOfDares?.length)

      // Safety fallback to hardcoded mocks if absolutely nothing returned
      if (!poolOfDares || poolOfDares.length === 0) {
        console.warn(
          '⚠️ No dares found for settings, falling back to MOCK_DARES (Outdoor)'
        )
        poolOfDares = MOCK_DARES
      }

      // Pick random starting dare filtered by first player's preferences
      const firstPlayer = playersData[0]
      const preferences = firstPlayer.preferences || { want: [], avoid: [] }
      console.log('👤 Player Prefs:', preferences)
      const excludedCategories = preferences.avoid || []
      const preferredCategories = preferences.want || []

      // 1. Filter out AVOID categories from the pool
      let availableDares = poolOfDares.filter(
        (dare) =>
          !dare.categoryTags.some((tag) => excludedCategories.includes(tag))
      )
      console.log('✅ Available after filter:', availableDares.length)

      // Fallback if filtering leaves no dares
      if (availableDares.length === 0) {
        console.warn('⚠️ Filtering removed all dares, reverting to full pool')
        availableDares = poolOfDares
      }

      // 2. Prioritize WANT categories (Weighted Selection)
      let finalizedPool = availableDares
      if (preferredCategories.length > 0) {
        const preferredSubset = availableDares.filter((dare) =>
          dare.categoryTags.some((tag) => preferredCategories.includes(tag))
        )
        // 20% chance to force a preferred category if available
        if (preferredSubset.length > 0 && Math.random() < 0.2) {
          finalizedPool = preferredSubset
        }
      }

      const randomDare =
        finalizedPool[Math.floor(Math.random() * finalizedPool.length)]

      // Update session status
      await dataAccess.updateSession(session.id, {
        status: 'ACTIVE',
        currentTurnPlayerId: createdPlayerIds[0], // Le premier joueur commence
        currentDare: randomDare,
        roundsCompleted: 0,
        playersPlayedThisRound: 0,
        startedAt: Timestamp.now(),
        roundsTotal: roundsTotal,
        isProgressiveMode: isProgressiveMode,
      })

      // Force refresh cache
      await queryClient.invalidateQueries({ queryKey: ['session', code] })

      // Petite attente pour la sync
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Save session ID for resume capability
      setActiveSession(session.id, code)

      // Navigate to game
      router.push(`/game/${code}`)
    } catch (error) {
      console.error('Error starting game:', error)
    } finally {
      // Hide loading screen and reset flag
      useLoadingStore.getState().hide()
      isStartingGame.current = false
    }
  }, [
    session,
    canStartGame,
    getPlayersForSession,
    roundsTotal,
    isProgressiveMode,
    queryClient,
    code,
    router,
    setActiveSession,
  ])

  /**
   * Calcule l'estimation de temps
   */
  const calculateTimeEstimation = useCallback(() => {
    const effectivePlayerCount = Math.max(playerCount, 1)
    const timerDurationSeconds = session?.settings?.timerDuration || 60
    const timerDurationMinutes = timerDurationSeconds / 60

    // Overhead par tour
    const overheadMin = 0.5 // 30 secondes
    const overheadMax = 1.5 // 90 secondes

    const minTimePerTurn = timerDurationMinutes + overheadMin
    const maxTimePerTurn = timerDurationMinutes + overheadMax

    return {
      min: Math.round(roundsTotal * effectivePlayerCount * minTimePerTurn),
      max: Math.round(roundsTotal * effectivePlayerCount * maxTimePerTurn),
    }
  }, [playerCount, session?.settings?.timerDuration, roundsTotal])

  // ========================================
  // RETURN
  // ========================================

  return {
    // Session
    session,
    isLoading,

    // Lobby
    lobbyPlayers,
    playerCount,
    isSoloMode,

    // Profiles
    hostProfile,
    hasHostProfile,
    needsProfileCreation,

    // Settings
    roundsTotal,
    isProgressiveMode,

    // Actions
    handleSettingsUpdate,
    updateRoundsAndMode,
    startGame,

    // Time
    calculateTimeEstimation,

    // Validation
    canStartGame,
    startGameError,
  }
}
