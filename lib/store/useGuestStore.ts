/**
 * Store Zustand pour la gestion des invités temporaires
 *
 * Conserve les noms des joueurs invités récents (non-profils).
 * Expire après 30 minutes d'inactivité.
 * Persisté dans sessionStorage (supprimé à la fermeture du navigateur).
 *
 * Actions principales :
 * - addGuest: Ajoute ou met à jour un invité
 * - removeGuest: Supprime un invité par ID
 * - removeGuestByName: Supprime par nom
 * - cleanupExpiredGuests: Nettoie les invités expirés (>30min)
 * - touchGuest: Met à jour la date d'utilisation
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface TemporaryGuest {
  id: string
  name: string
  avatarUri?: string
  createdAt: number // Timestamp
  lastUsedAt: number // Timestamp
}

interface GuestStoreState {
  guests: TemporaryGuest[]
}

interface GuestStoreActions {
  /** Ajoute ou met à jour un invité (basé sur le nom) */
  addGuest: (name: string, avatarUri?: string) => TemporaryGuest
  /** Supprime un invité (ex: après conversion en profil) */
  removeGuest: (id: string) => void
  removeGuestByName: (name: string) => void
  /** Supprime les invités vieux de plus de 30 min */
  cleanupExpiredGuests: () => void
  /** Met à jour la date d'utilisation */
  touchGuest: (id: string) => void
}

const EXPIRATION_MS = 30 * 60 * 1000 // 30 minutes

export const useGuestStore = create<GuestStoreState & GuestStoreActions>()(
  persist(
    (set, get) => ({
      guests: [],

      addGuest: (name: string, avatarUri?: string) => {
        const now = Date.now()
        const { guests } = get()

        // Vérifier si existe déjà (par nom, insensible à la casse)
        const existingGuest = guests.find(
          (g) => g.name.toLowerCase() === name.trim().toLowerCase()
        )

        if (existingGuest) {
          const updatedGuest = {
            ...existingGuest,
            lastUsedAt: now,
            avatarUri: avatarUri || existingGuest.avatarUri,
          }
          set({
            guests: guests.map((g) =>
              g.id === existingGuest.id ? updatedGuest : g
            ),
          })
          return updatedGuest
        }

        const newGuest: TemporaryGuest = {
          id: Math.random().toString(36).substring(2, 11),
          name: name.trim(),
          avatarUri,
          createdAt: now,
          lastUsedAt: now,
        }

        set({ guests: [...guests, newGuest] })
        return newGuest
      },

      removeGuest: (id: string) => {
        set({ guests: get().guests.filter((g) => g.id !== id) })
      },

      removeGuestByName: (name: string) => {
        set({
          guests: get().guests.filter(
            (g) => g.name.toLowerCase() !== name.trim().toLowerCase()
          ),
        })
      },

      cleanupExpiredGuests: () => {
        const now = Date.now()
        set({
          guests: get().guests.filter(
            (g) => now - g.lastUsedAt < EXPIRATION_MS
          ),
        })
      },

      touchGuest: (id: string) => {
        const now = Date.now()
        set({
          guests: get().guests.map((g) =>
            g.id === id ? { ...g, lastUsedAt: now } : g
          ),
        })
      },
    }),
    {
      name: 'social-chaos-guests',
      storage: createJSONStorage(() => sessionStorage), // Persistance session uniquement
      skipHydration: false,
    }
  )
)
