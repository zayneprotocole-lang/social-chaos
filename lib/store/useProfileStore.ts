/**
 * Store Zustand pour la gestion des profils joueurs
 *
 * Architecture:
 * - hostProfile: Profil de l'utilisateur authentifié (unique)
 * - guestProfiles: Profils invités locaux (multiples, persistés)
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ========================================
// TYPES
// ========================================

export interface Profile {
  id: string
  name: string
  avatarUri?: string // URL de l'avatar (photo Google ou data URI)
  preferences: {
    // Renommé de categoryPreferences pour correspondre à LocalPlayerProfile
    want: string[] // Catégories préférées
    avoid: string[] // Catégories à éviter
  }
  isHost: boolean // true si profil hôte, false si invité
  createdAt: string
  updatedAt: string
}

interface ProfileStoreState {
  hostProfile: Profile | null
  guestProfiles: Profile[]
}

interface ProfileStoreActions {
  // Actions hôte
  setHostProfile: (profile: Omit<Profile, 'isHost'>) => void
  updateHostProfile: (
    updates: Partial<Omit<Profile, 'id' | 'isHost' | 'createdAt'>>
  ) => void
  clearHostProfile: () => void

  // Actions invités
  addGuestProfile: (data: { name: string; avatarUri?: string }) => string
  updateGuestProfile: (
    id: string,
    updates: Partial<Omit<Profile, 'id' | 'isHost' | 'createdAt'>>
  ) => void
  removeGuestProfile: (id: string) => void

  // Helpers
  getAllProfiles: () => Profile[]
  getProfileById: (id: string) => Profile | null
  getGuestProfiles: () => Profile[]

  // Méthodes de compatibilité (ancien API)
  createProfile: (input: {
    name: string
    avatarUri?: string
    isHost?: boolean
    preferences?: { want: string[]; avoid: string[] }
  }) => Profile
  updateProfile: (input: {
    id: string
    name?: string
    avatarUri?: string
    preferences?: { want: string[]; avoid: string[] }
  }) => Profile | null
}

export type ProfileStore = ProfileStoreState & ProfileStoreActions

// ========================================
// HELPER FUNCTIONS
// ========================================

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

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

      hostProfile: null,
      guestProfiles: [],

      // ========================================
      // HOST ACTIONS
      // ========================================

      setHostProfile: (profile: Omit<Profile, 'isHost'>) => {
        const newHostProfile: Profile = {
          ...profile,
          isHost: true,
          updatedAt: getCurrentISODate(),
        }

        set({ hostProfile: newHostProfile })
      },

      updateHostProfile: (updates) => {
        const { hostProfile } = get()

        if (!hostProfile) {
          console.warn('Cannot update host profile: no host profile exists')
          return
        }

        const updatedHostProfile: Profile = {
          ...hostProfile,
          ...updates,
          id: hostProfile.id,
          isHost: true,
          createdAt: hostProfile.createdAt,
          updatedAt: getCurrentISODate(),
        }

        set({ hostProfile: updatedHostProfile })
      },

      clearHostProfile: () => {
        set({ hostProfile: null })
      },

      // ========================================
      // GUEST ACTIONS
      // ========================================

      addGuestProfile: (data) => {
        const newGuest: Profile = {
          id: generateUUID(),
          name: data.name,
          avatarUri: data.avatarUri,
          preferences: { want: [], avoid: [] },
          isHost: false,
          createdAt: getCurrentISODate(),
          updatedAt: getCurrentISODate(),
        }

        set((state) => ({
          guestProfiles: [...state.guestProfiles, newGuest],
        }))

        return newGuest.id
      },

      updateGuestProfile: (id, updates) => {
        const { guestProfiles } = get()

        const profileIndex = guestProfiles.findIndex((p) => p.id === id)
        if (profileIndex === -1) {
          console.warn(`Cannot update guest profile: profile ${id} not found`)
          return
        }

        const existingProfile = guestProfiles[profileIndex]
        const updatedProfile: Profile = {
          ...existingProfile,
          ...updates,
          id: existingProfile.id,
          isHost: false,
          createdAt: existingProfile.createdAt,
          updatedAt: getCurrentISODate(),
        }

        set((state) => ({
          guestProfiles: state.guestProfiles.map((p) =>
            p.id === id ? updatedProfile : p
          ),
        }))
      },

      removeGuestProfile: (id) => {
        set((state) => ({
          guestProfiles: state.guestProfiles.filter((p) => p.id !== id),
        }))
      },

      // ========================================
      // HELPERS
      // ========================================
      // Helpers
      getAllProfiles: () => {
        const { hostProfile, guestProfiles } = get()
        const all: Profile[] = []

        if (hostProfile) {
          all.push(hostProfile)
        }

        all.push(...guestProfiles)
        return all
      },

      getProfileById: (id) => {
        const { hostProfile, guestProfiles } = get()

        if (hostProfile?.id === id) {
          return hostProfile
        }

        return guestProfiles.find((p) => p.id === id) ?? null
      },

      getGuestProfiles: () => {
        return get().guestProfiles
      },

      // Méthode de compatibilité pour createProfile (ancien API)
      createProfile: (input: {
        name: string
        avatarUri?: string
        isHost?: boolean
        preferences?: { want: string[]; avoid: string[] }
      }) => {
        const newProfile: Profile = {
          id: generateUUID(),
          name: input.name,
          avatarUri: input.avatarUri,
          preferences: input.preferences || { want: [], avoid: [] },
          isHost: input.isHost || false,
          createdAt: getCurrentISODate(),
          updatedAt: getCurrentISODate(),
        }

        if (input.isHost) {
          // Créer comme profil hôte
          set({ hostProfile: newProfile })
        } else {
          // Créer comme profil invité
          set((state) => ({
            guestProfiles: [...state.guestProfiles, newProfile],
          }))
        }

        return newProfile
      },

      // Méthode de compatibilité pour updateProfile (ancien API)
      updateProfile: (input: {
        id: string
        name?: string
        avatarUri?: string
        preferences?: { want: string[]; avoid: string[] }
      }) => {
        const { hostProfile } = get()

        // Si c'est le profil host, utiliser updateHostProfile
        if (hostProfile && hostProfile.id === input.id) {
          const updates: Partial<Omit<Profile, 'id' | 'isHost' | 'createdAt'>> =
            {}
          if (input.name !== undefined) updates.name = input.name
          if (input.avatarUri !== undefined) updates.avatarUri = input.avatarUri
          if (input.preferences !== undefined)
            updates.preferences = input.preferences

          set((state) => ({
            hostProfile: state.hostProfile
              ? {
                  ...state.hostProfile,
                  ...updates,
                  updatedAt: getCurrentISODate(),
                }
              : null,
          }))

          return hostProfile
        }

        // Sinon utiliser updateGuestProfile
        const guest = get().guestProfiles.find((p) => p.id === input.id)
        if (guest) {
          const updates: Partial<Omit<Profile, 'id' | 'isHost' | 'createdAt'>> =
            {}
          if (input.name !== undefined) updates.name = input.name
          if (input.avatarUri !== undefined) updates.avatarUri = input.avatarUri
          if (input.preferences !== undefined)
            updates.preferences = input.preferences

          set((state) => ({
            guestProfiles: state.guestProfiles.map((p) =>
              p.id === input.id
                ? { ...p, ...updates, updatedAt: getCurrentISODate() }
                : p
            ),
          }))

          return guest
        }

        return null
      },
    }),
    {
      name: 'social-chaos-profiles',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        hostProfile: state.hostProfile,
        guestProfiles: state.guestProfiles,
      }),

      version: 2, // Incremented version for migration

      migrate: (persistedState: unknown, version) => {
        // Migration from v1 (old structure) to v2 (new structure)
        if (version === 1) {
          interface OldProfile {
            id: string
            name: string
            avatarUri?: string
            createdAt: string
            isHost: boolean
            preferences?: {
              want: string[]
              avoid: string[]
            }
          }

          const oldState = persistedState as {
            profiles: OldProfile[]
            hostProfileId: string | null
          }

          // Find host profile from old structure
          const oldHostProfile = oldState.hostProfileId
            ? oldState.profiles.find((p) => p.id === oldState.hostProfileId)
            : oldState.profiles.find((p) => p.isHost)

          // Convert old profiles to new structure
          const newHostProfile: Profile | null = oldHostProfile
            ? {
                id: oldHostProfile.id,
                name: oldHostProfile.name,
                avatarUri: oldHostProfile.avatarUri,
                preferences: oldHostProfile.preferences || {
                  want: [],
                  avoid: [],
                },
                isHost: true,
                createdAt: oldHostProfile.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : null

          // Convert guest profiles
          const newGuestProfiles: Profile[] = oldState.profiles
            .filter((p) => p.id !== oldState.hostProfileId && !p.isHost)
            .map((p) => ({
              id: p.id,
              name: p.name,
              avatarUri: p.avatarUri,
              preferences: p.preferences || { want: [], avoid: [] },
              isHost: false,
              createdAt: p.createdAt,
              updatedAt: new Date().toISOString(),
            }))

          return {
            hostProfile: newHostProfile,
            guestProfiles: newGuestProfiles,
          }
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
 */
export function useHostProfile() {
  return useProfileStore((state) => state.hostProfile)
}

/**
 * Hook pour récupérer tous les profils
 */
export function useAllProfiles() {
  return useProfileStore((state) => state.getAllProfiles())
}

/**
 * Hook pour récupérer tous les profils (alias de useAllProfiles pour compatibilité)
 * @deprecated Utilisezuse AllProfiles à la place
 */
export function useProfiles() {
  return useAllProfiles()
}

/**
 * Hook pour récupérer les profils invités
 */
export function useGuestProfiles() {
  return useProfileStore((state) => state.guestProfiles)
}

/**
 * Hook pour vérifier si un profil host existe
 */
export function useHasHostProfile() {
  return useProfileStore((state) => state.hostProfile !== null)
}
