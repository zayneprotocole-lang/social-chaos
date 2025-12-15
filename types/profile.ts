/**
 * Types pour les profils joueurs locaux
 * Ces profils sont stock├®s en localStorage et r├®utilisables entre les parties
 */

/**
 * Repr├®sente un profil joueur stock├® localement sur l'appareil
 *
 * @property id - Identifiant unique UUID v4
 * @property name - Nom/pseudo du joueur (1-30 caract├¿res)
 * @property avatarUri - Image de profil en base64 data URI (optionnel, max 200KB)
 * @property createdAt - Date de cr├®ation du profil (ISO string pour s├®rialisation)
 * @property isHost - True si c'est le profil principal de l'appareil (un seul ├á la fois)
 */
export interface LocalPlayerProfile {
  id: string
  name: string
  avatarUri?: string
  createdAt: string // ISO 8601 string pour compatibilit├® JSON/localStorage
  isHost: boolean
  // V10.1: Category preferences
  preferences: {
    want: string[]
    avoid: string[]
  }
}

/**
 * Donn├®es requises pour cr├®er un nouveau profil
 * L'id et createdAt seront g├®n├®r├®s automatiquement
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
 * Donn├®es pour mettre ├á jour un profil existant
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
 * ├ëtat du store des profils
 */
export interface ProfileStoreState {
  /** Liste de tous les profils stock├®s localement */
  profiles: LocalPlayerProfile[]

  /** ID du profil host actuel (profil principal de l'appareil) */
  hostProfileId: string | null
}

/**
 * Actions disponibles dans le store des profils
 */
export interface ProfileStoreActions {
  /** Cr├®e un nouveau profil et le stocke */
  createProfile: (input: CreateProfileInput) => LocalPlayerProfile

  /** Met ├á jour un profil existant */
  updateProfile: (input: UpdateProfileInput) => LocalPlayerProfile | null

  /** Supprime un profil par son ID */
  deleteProfile: (id: string) => boolean

  /** D├®finit un profil comme host (retire le statut host des autres) */
  setHostProfile: (id: string) => boolean

  /** R├®cup├¿re le profil host actuel */
  getHostProfile: () => LocalPlayerProfile | null

  /** R├®cup├¿re un profil par son ID */
  getProfileById: (id: string) => LocalPlayerProfile | null

  /** R├®cup├¿re tous les profils non-host */
  getNonHostProfiles: () => LocalPlayerProfile[]
}

/**
 * Type complet du store Zustand (├®tat + actions)
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

  /** Cl├® de stockage localStorage */
  STORAGE_KEY: 'social-chaos-profiles',

  /** Qualit├® de compression JPEG (0-1) */
  AVATAR_COMPRESSION_QUALITY: 0.7,

  /** Dimension maximale de l'avatar (largeur ou hauteur) */
  AVATAR_MAX_DIMENSION: 256,
} as const
