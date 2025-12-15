/**
 * Store Zustand pour la gestion du lobby local
 * 
 * Gère les joueurs du lobby avant synchronisation avec Firestore
 * Intègre les profils locaux et les invités temporaires
 */

import { create } from 'zustand'
import {
    LobbyPlayer,
    generateLobbyPlayerId,
    getPlayerActionsConfig
} from '@/types/lobby'
import { LocalPlayerProfile } from '@/types/profile'

// ========================================
// TYPES
// ========================================

export interface LobbyStoreState {
    /** Liste des joueurs dans le lobby */
    players: LobbyPlayer[]
    /** Indique si le host a été ajouté automatiquement */
    hostAutoAdded: boolean
}

export interface LobbyStoreActions {
    /** Initialise le lobby avec le profil hôte */
    initializeWithHost: (hostProfile: LocalPlayerProfile | null) => void

    /** Ajoute un joueur depuis un profil local */
    addPlayerFromProfile: (profile: LocalPlayerProfile) => boolean

    /** Ajoute un joueur invité (non sauvegardé) */
    addGuestPlayer: (name: string) => LobbyPlayer

    /** Retire un joueur du lobby */
    removePlayer: (playerId: string) => void

    /** Vérifie si un profil est déjà dans le lobby */
    isProfileInLobby: (profileId: string) => boolean

    /** Réinitialise le lobby */
    resetLobby: () => void

    /** Obtient le nombre de joueurs */
    getPlayerCount: () => number

    /** Vérifie si c'est le mode solo */
    isSoloMode: () => boolean

    /** Met à jour les préférences d'un joueur du lobby */
    updatePlayerPreferences: (playerId: string, preferences: { want: string[]; avoid: string[] }) => void

    /** Obtient les joueurs formatés pour Firestore */
    getPlayersForSession: () => Array<{
        name: string
        avatar?: string | null
        score: number
        jokersLeft: number
        rerollsLeft: number
        exchangeLeft: number
        isHost: boolean
        preferences?: {
            want: string[]
            avoid: string[]
        }
    }>
}

export type LobbyStore = LobbyStoreState & LobbyStoreActions

// ========================================
// INITIAL STATE
// ========================================

const initialState: LobbyStoreState = {
    players: [],
    hostAutoAdded: false,
}

// ========================================
// STORE
// ========================================

export const useLobbyStore = create<LobbyStore>()((set, get) => ({
    // ========================================
    // STATE
    // ========================================
    ...initialState,

    // ========================================
    // ACTIONS
    // ========================================

    /**
     * Initialise le lobby avec le profil hôte s'il existe
     * Appelé à l'ouverture du lobby
     */
    initializeWithHost: (hostProfile: LocalPlayerProfile | null) => {
        if (!hostProfile) {
            set({ players: [], hostAutoAdded: false })
            return
        }

        // Vérifier si le host n'est pas déjà dans la liste
        const { players } = get()
        const alreadyHasHost = players.some(p => p.profileId === hostProfile.id)

        if (alreadyHasHost) {
            return
        }

        const hostPlayer: LobbyPlayer = {
            id: generateLobbyPlayerId(),
            name: hostProfile.name,
            avatarUri: hostProfile.avatarUri,
            profileId: hostProfile.id,
            isHost: true,
            preferences: hostProfile.preferences,
        }

        set({
            players: [hostPlayer, ...players],
            hostAutoAdded: true,
        })
    },

    /**
     * Ajoute un joueur depuis un profil local existant
     */
    addPlayerFromProfile: (profile: LocalPlayerProfile): boolean => {
        const { players } = get()

        // Vérifier les doublons
        if (players.some(p => p.profileId === profile.id)) {
            console.warn('Profile already in lobby:', profile.id)
            return false
        }

        const newPlayer: LobbyPlayer = {
            id: generateLobbyPlayerId(),
            name: profile.name,
            avatarUri: profile.avatarUri,
            profileId: profile.id,
            isHost: profile.isHost,
            preferences: profile.preferences,
        }

        set({
            players: [...players, newPlayer],
        })

        return true
    },

    /**
     * Ajoute un joueur invité (pas de profil, nom uniquement)
     */
    addGuestPlayer: (name: string): LobbyPlayer => {
        const { players } = get()
        // Auto-assign host if this is the first player
        const isFirstPlayer = players.length === 0

        const guestPlayer: LobbyPlayer = {
            id: generateLobbyPlayerId(),
            name: name.trim(),
            avatarUri: undefined,
            profileId: undefined, // Invité = pas de profileId
            isHost: isFirstPlayer, // First player becomes host
            preferences: { want: [], avoid: [] },
        }

        set({
            players: [...players, guestPlayer],
        })

        return guestPlayer
    },

    /**
     * Retire un joueur du lobby (y compris l'hôte)
     */
    removePlayer: (playerId: string) => {
        const { players } = get()
        const newPlayers = players.filter(p => p.id !== playerId)

        // If we removed the host, assign host to the new first player
        if (players.find(p => p.id === playerId)?.isHost && newPlayers.length > 0) {
            newPlayers[0].isHost = true
        }

        set({
            players: newPlayers,
        })
    },

    /**
     * Vérifie si un profil est déjà dans le lobby
     */
    isProfileInLobby: (profileId: string): boolean => {
        const { players } = get()
        return players.some(p => p.profileId === profileId)
    },

    /**
     * Réinitialise complètement le lobby
     */
    resetLobby: () => {
        set(initialState)
    },

    /**
     * Retourne le nombre de joueurs
     */
    getPlayerCount: (): number => {
        return get().players.length
    },

    /**
     * Vérifie si c'est le mode solo (1 seul joueur)
     */
    isSoloMode: (): boolean => {
        return get().players.length === 1
    },

    /**
     * Met à jour les préférences d'un joueur
     */
    updatePlayerPreferences: (playerId: string, preferences) => {
        const { players } = get()
        set({
            players: players.map(p =>
                p.id === playerId
                    ? { ...p, preferences }
                    : p
            )
        })
    },

    /**
     * Formate les joueurs pour l'envoi à Firestore
     * Applique les config d'actions selon le mode (solo vs multi)
     */
    getPlayersForSession: () => {
        const { players } = get()
        const isSolo = players.length === 1
        const actionsConfig = getPlayerActionsConfig(isSolo)
        const hasHost = players.some(p => p.isHost)

        return players.map((player, index) => {
            // Force first player to be host if no host exists
            const isEffectivelyHost = hasHost ? player.isHost : index === 0

            return {
                name: player.name,
                avatar: player.avatarUri || null, // FIX: Firestore does not allow undefined
                score: 0,
                jokersLeft: actionsConfig.jokersLeft,
                rerollsLeft: actionsConfig.rerollsLeft,
                exchangeLeft: actionsConfig.exchangeLeft,
                isHost: isEffectivelyHost,
                profileId: player.profileId, // For Mentor/Élève system
                preferences: {
                    want: player.preferences?.want || [],
                    avoid: player.preferences?.avoid || []
                }
            }
        })
    }
}))

// ========================================
// HOOKS UTILITAIRES
// ========================================

/**
 * Hook pour obtenir les joueurs du lobby
 */
export function useLobbyPlayers() {
    return useLobbyStore(state => state.players)
}

/**
 * Hook pour vérifier le mode solo
 */
export function useIsSoloMode() {
    return useLobbyStore(state => state.players.length === 1)
}

/**
 * Hook pour obtenir le nombre de joueurs
 */
export function useLobbyPlayerCount() {
    return useLobbyStore(state => state.players.length)
}
