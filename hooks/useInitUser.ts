/**
 * Hook pour initialiser les données utilisateur après connexion
 *
 * Fonctionnalité:
 * - Crée/met à jour le document Firestore user
 * - Récupère et synchronise le profil cloud vers le store local
 * - Crée un profil par défaut si nécessaire
 * - S'exécute une seule fois par session
 */

import { useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import { useProfileStore } from '@/lib/store/useProfileStore'
import type { Profile } from '@/lib/store/useProfileStore'
import {
  createOrUpdateUser,
  getUserProfile,
  saveUserProfile,
} from '@/lib/services/userDataService'

export function useInitUser() {
  const { user, isAuthenticated } = useAuth()
  const setHostProfile = useProfileStore((state) => state.setHostProfile)
  const initialized = useRef(false)

  useEffect(() => {
    // Ne rien faire si pas connecté ou déjà initialisé
    if (!isAuthenticated || !user || initialized.current) return

    const initUser = async () => {
      try {
        // 1. Créer/mettre à jour le document user Firestore
        await createOrUpdateUser()

        // 2. Récupérer le profil depuis Firestore
        const cloudProfile = await getUserProfile()

        // 3. Si pas de profil cloud, créer un profil par défaut
        if (!cloudProfile) {
          const defaultProfile: Omit<Profile, 'isHost'> = {
            id: user.uid,
            name: user.displayName || user.email || 'Utilisateur',
            avatarUri: undefined, // Don't use Google photo by default
            preferences: { want: [], avoid: [] },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          // Sauvegarder dans Firestore (utilise la structure UserProfile)
          await saveUserProfile({
            name: defaultProfile.name,
            avatarId: null,
            avatarUrl: defaultProfile.avatarUri || null,
            categoryPreferences: defaultProfile.preferences,
          })

          // Mettre dans le store local
          setHostProfile(defaultProfile)
        } else {
          // 4. Synchroniser le profil cloud vers le store local
          setHostProfile({
            id: user.uid,
            name: cloudProfile.name,
            avatarUri: cloudProfile.avatarUrl || undefined, // Don't fallback to Google photo
            preferences: cloudProfile.categoryPreferences || {
              want: [],
              avoid: [],
            },
            createdAt: new Date().toISOString(), // UserProfile doesn't have createdAt, use current
            updatedAt: new Date().toISOString(), //  UserProfile doesn't have updatedAt, use current
          })
        }

        initialized.current = true
      } catch (error) {
        console.error('Failed to initialize user:', error)
      }
    }

    initUser()
  }, [isAuthenticated, user, setHostProfile])

  // Reset quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      initialized.current = false
    }
  }, [isAuthenticated])
}
