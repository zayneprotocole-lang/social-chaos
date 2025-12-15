/**
 * Types pour le lobby refactorisé avec profils locaux
 */

/**
 * Représente un joueur dans le lobby
 * Peut être lié à un profil local ou être un invité temporaire
 */
export interface LobbyPlayer {
    /** ID unique du joueur dans le lobby (différent du profileId) */
    id: string
    /** Nom du joueur */
    name: string
    /** Avatar en base64 (optionnel) */
    avatarUri?: string
    /** ID du profil local associé (undefined = invité) */
    profileId?: string
    /** Ce joueur est l'hôte de la partie */
    isHost: boolean
    /** Préférences du joueur */
    preferences?: {
        want: string[]
        avoid: string[]
    }
}

/**
 * Configuration du mode solo
 */
export interface SoloModeConfig {
    /** En mode solo, pas de Joker */
    jokersAllowed: 0
    /** En mode solo, pas de Swap */
    swapsAllowed: 0
    /** En mode solo, 3 rerolls */
    rerollsAllowed: 3
}

/**
 * Configuration par défaut des actions par joueur
 */
export interface PlayerActionsConfig {
    jokersLeft: number
    rerollsLeft: number
    exchangeLeft: number
}

/**
 * Retourne la config d'actions selon le mode (solo vs multi)
 */
export function getPlayerActionsConfig(isSoloMode: boolean): PlayerActionsConfig {
    if (isSoloMode) {
        return {
            jokersLeft: 0,    // Pas de joker en solo
            rerollsLeft: 3,   // 3 rerolls en solo
            exchangeLeft: 0,  // Pas de swap en solo
        }
    }

    return {
        jokersLeft: 1,
        rerollsLeft: 1,
        exchangeLeft: 1,
    }
}

/**
 * Génère un ID unique pour un joueur lobby
 */
export function generateLobbyPlayerId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }
    return `player-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
