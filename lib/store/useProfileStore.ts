/**
 * Store Zustand pour la gestion des profils joueurs locaux
 *
 * Fonctionnalités :
 * - Persistance automatique dans localStorage
 * - Gestion du profil "host" (profil principal de l'appareil)
 * - CRUD complet sur les profils
 * - Validation des données via Zod
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  LocalPlayerProfile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfileStore,
  PROFILE_CONFIG,
} from '@/types/profile'
import {
  validateCreateProfileInput,
  validateUpdateProfileInput,
} from '@/lib/validation/profileSchema'

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Génère un UUID v4 compatible avec tous les navigateurs
 * Utilise crypto.randomUUID si disponible, sinon fallback manuel
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback pour les navigateurs plus anciens
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Retourne la date actuelle au format ISO 8601
 */
function getCurrentISODate(): string {
  return new Date().toISOString()
}

// ========================================
// STORE DEFINITION
// ========================================

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      // ========================================
      // STATE
      // ========================================

      /** Liste de tous les profils */
      profiles: [],

      /** ID du profil host (profil principal) */
      hostProfileId: null,

      // ========================================
      // ACTIONS
      // ========================================

      /**
       * Crée un nouveau profil
       *
       * @param input - Données du profil (nom, avatar optionnel, isHost optionnel)
       * @returns Le profil créé
       * @throws Error si les données sont invalides
       *
       * @example
       * const profile = createProfile({ name: 'Alex', isHost: true })
       */
      createProfile: (input: CreateProfileInput): LocalPlayerProfile => {
        // Validation des données d'entrée
        const validation = validateCreateProfileInput(input)
        if (!validation.success) {
          throw new Error(`Invalid profile data: ${validation.error.message}`)
        }

        const validatedInput = validation.data

        // Création du nouveau profil
        const newProfile: LocalPlayerProfile = {
          id: generateUUID(),
          name: validatedInput.name,
          avatarUri: validatedInput.avatarUri,
          createdAt: getCurrentISODate(),
          isHost: validatedInput.isHost ?? false,
          preferences: {
            want: validatedInput.preferences?.want ?? [],
            avoid: validatedInput.preferences?.avoid ?? [],
          },
        }

        set((state) => {
          let updatedProfiles = [...state.profiles]
          let updatedHostProfileId = state.hostProfileId

          // Si ce profil est host, retirer le statut host des autres
          if (newProfile.isHost) {
            updatedProfiles = updatedProfiles.map((p) => ({
              ...p,
              isHost: false,
            }))
            updatedHostProfileId = newProfile.id
          }

          return {
            profiles: [...updatedProfiles, newProfile],
            hostProfileId: updatedHostProfileId,
          }
        })

        return newProfile
      },

      /**
       * Met à jour un profil existant
       *
       * @param input - ID du profil et champs à mettre à jour
       * @returns Le profil mis à jour ou null si non trouvé
       *
       * @example
       * updateProfile({ id: 'xxx', name: 'New Name' })
       * updateProfile({ id: 'xxx', avatarUri: null }) // Supprime l'avatar
       */
      updateProfile: (input: UpdateProfileInput): LocalPlayerProfile | null => {
        // Validation
        const validation = validateUpdateProfileInput(input)
        if (!validation.success) {
          console.error('Invalid update data:', validation.error.message)
          return null
        }

        const validatedInput = validation.data
        const { profiles } = get()

        // Trouver le profil à mettre à jour
        const profileIndex = profiles.findIndex(
          (p) => p.id === validatedInput.id
        )
        if (profileIndex === -1) {
          console.error(`Profile not found: ${validatedInput.id}`)
          return null
        }

        const existingProfile = profiles[profileIndex]

        // Construire le profil mis à jour
        const updatedProfile: LocalPlayerProfile = {
          ...existingProfile,
          name: validatedInput.name ?? existingProfile.name,
          // Si avatarUri est null, on le supprime, sinon on garde la valeur
          avatarUri:
            validatedInput.avatarUri === null
              ? undefined
              : (validatedInput.avatarUri ?? existingProfile.avatarUri),
          preferences: {
            want:
              validatedInput.preferences?.want ??
              existingProfile.preferences?.want ??
              [],
            avoid:
              validatedInput.preferences?.avoid ??
              existingProfile.preferences?.avoid ??
              [],
          },
        }

        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === validatedInput.id ? updatedProfile : p
          ),
        }))

        return updatedProfile
      },

      /**
       * Supprime un profil
       *
       * @param id - ID du profil à supprimer
       * @returns true si supprimé, false si non trouvé
       *
       * Note: Si le profil supprimé était host, hostProfileId devient null
       */
      deleteProfile: (id: string): boolean => {
        const { profiles } = get()

        const profileExists = profiles.some((p) => p.id === id)
        if (!profileExists) {
          return false
        }

        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          // Si on supprime le host, réinitialiser hostProfileId
          hostProfileId:
            state.hostProfileId === id ? null : state.hostProfileId,
        }))

        return true
      },

      /**
       * Définit un profil comme host (profil principal)
       *
       * @param id - ID du profil à définir comme host
       * @returns true si réussi, false si le profil n'existe pas
       *
       * Note: Le précédent host perd son statut automatiquement
       */
      setHostProfile: (id: string): boolean => {
        const { profiles } = get()

        const profileExists = profiles.some((p) => p.id === id)
        if (!profileExists) {
          return false
        }

        set((state) => ({
          profiles: state.profiles.map((p) => ({
            ...p,
            isHost: p.id === id,
          })),
          hostProfileId: id,
        }))

        return true
      },

      /**
       * Récupère le profil host actuel
       *
       * @returns Le profil host ou null s'il n'y en a pas
       */
      getHostProfile: (): LocalPlayerProfile | null => {
        const { profiles, hostProfileId } = get()

        if (!hostProfileId) {
          // Fallback: chercher un profil avec isHost: true
          const hostByFlag = profiles.find((p) => p.isHost)
          return hostByFlag ?? null
        }

        return profiles.find((p) => p.id === hostProfileId) ?? null
      },

      /**
       * Récupère un profil par son ID
       *
       * @param id - ID du profil recherché
       * @returns Le profil ou null si non trouvé
       */
      getProfileById: (id: string): LocalPlayerProfile | null => {
        const { profiles } = get()
        return profiles.find((p) => p.id === id) ?? null
      },

      /**
       * Récupère tous les profils sauf le host
       * Utile pour l'affichage dans le lobby
       *
       * @returns Liste des profils non-host
       */
      getNonHostProfiles: (): LocalPlayerProfile[] => {
        const { profiles, hostProfileId } = get()
        return profiles.filter((p) => p.id !== hostProfileId && !p.isHost)
      },
    }),
    {
      name: PROFILE_CONFIG.STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),

      // Partialize: on persiste tout l'état
      partialize: (state) => ({
        profiles: state.profiles,
        hostProfileId: state.hostProfileId,
      }),

      // Version du store pour migrations futures
      version: 1,

      // Migration handler pour les versions futures
      migrate: (persistedState, version) => {
        // Version 0 -> 1: pas de migration nécessaire pour l'instant
        if (version === 0) {
          return persistedState as ProfileStore
        }
        return persistedState as ProfileStore
      },
    }
  )
)

// ========================================
// UTILITY HOOKS
// ========================================

/**
 * Hook pour récupérer uniquement le profil host
 * Optimisé pour éviter les re-renders inutiles
 */
export function useHostProfile() {
  return useProfileStore((state) => {
    const { profiles, hostProfileId } = state
    if (!hostProfileId) {
      return profiles.find((p) => p.isHost) ?? null
    }
    return profiles.find((p) => p.id === hostProfileId) ?? null
  })
}

/**
 * Hook pour récupérer tous les profils
 */
export function useProfiles() {
  return useProfileStore((state) => state.profiles)
}

/**
 * Hook pour récupérer les profils non-host
 */
export function useNonHostProfiles() {
  return useProfileStore((state) => {
    const { profiles, hostProfileId } = state
    return profiles.filter((p) => p.id !== hostProfileId && !p.isHost)
  })
}

/**
 * Hook pour vérifier si un profil host existe
 */
export function useHasHostProfile() {
  return useProfileStore(
    (state) =>
      state.hostProfileId !== null || state.profiles.some((p) => p.isHost)
  )
}
