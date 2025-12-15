/**
 * Types pour les profils joueurs locaux
 * Ces profils sont stockés en localStorage et réutilisables entre les parties
 */

/**
 * Représente un profil joueur stocké localement sur l'appareil
 * 
 * @property id - Identifiant unique UUID v4
 * @property name - Nom/pseudo du joueur (1-30 caractères)
 * @property avatarUri - Image de profil en base64 data URI (optionnel, max 200KB)
 * @property createdAt - Date de création du profil (ISO string pour sérialisation)
 * @property isHost - True si c'est le profil principal de l'appareil (un seul à la fois)
 */
export interface LocalPlayerProfile {
    id: string
    name: string
    avatarUri?: string
    createdAt: string // ISO 8601 string pour compatibilité JSON/localStorage
    isHost: boolean
    // V10.1: Category preferences
    preferences: {
        want: string[]
        avoid: string[]
    }
}

/**
 * Données requises pour créer un nouveau profil
 * L'id et createdAt seront générés automatiquement
 */
export interface CreateProfileInput {
    name: string
    avatarUri?: string
    isHost?: boolean
    // V10.1: Optional preferences
    preferences?: {
        want: string[]
        avoid: string[]
    }
}

/**
 * Données pour mettre à jour un profil existant
 * Tous les champs sont optionnels sauf l'id
 */
export interface UpdateProfileInput {
    id: string
    name?: string
    avatarUri?: string | null // null pour supprimer l'avatar
    preferences?: {
        want: string[]
        avoid: string[]
    }
}

/**
 * État du store des profils
 */
export interface ProfileStoreState {
    /** Liste de tous les profils stockés localement */
    profiles: LocalPlayerProfile[]

    /** ID du profil host actuel (profil principal de l'appareil) */
    hostProfileId: string | null
}

/**
 * Actions disponibles dans le store des profils
 */
export interface ProfileStoreActions {
    /** Crée un nouveau profil et le stocke */
    createProfile: (input: CreateProfileInput) => LocalPlayerProfile

    /** Met à jour un profil existant */
    updateProfile: (input: UpdateProfileInput) => LocalPlayerProfile | null

    /** Supprime un profil par son ID */
    deleteProfile: (id: string) => boolean

    /** Définit un profil comme host (retire le statut host des autres) */
    setHostProfile: (id: string) => boolean

    /** Récupère le profil host actuel */
    getHostProfile: () => LocalPlayerProfile | null

    /** Récupère un profil par son ID */
    getProfileById: (id: string) => LocalPlayerProfile | null

    /** Récupère tous les profils non-host */
    getNonHostProfiles: () => LocalPlayerProfile[]
}

/**
 * Type complet du store Zustand (état + actions)
 */
export type ProfileStore = ProfileStoreState & ProfileStoreActions

/**
 * Constantes de configuration pour les profils
 */
export const PROFILE_CONFIG = {
    /** Taille maximale de l'avatar en bytes (200KB) */
    MAX_AVATAR_SIZE_BYTES: 200 * 1024,

    /** Longueur minimale du nom */
    MIN_NAME_LENGTH: 1,

    /** Longueur maximale du nom */
    MAX_NAME_LENGTH: 30,

    /** Clé de stockage localStorage */
    STORAGE_KEY: 'social-chaos-profiles',

    /** Qualité de compression JPEG (0-1) */
    AVATAR_COMPRESSION_QUALITY: 0.7,

    /** Dimension maximale de l'avatar (largeur ou hauteur) */
    AVATAR_MAX_DIMENSION: 256,
} as const
