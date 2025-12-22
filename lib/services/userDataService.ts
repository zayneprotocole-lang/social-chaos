/**
 * Service de synchronisation des données utilisateur avec Firestore
 *
 * Architecture:
 * users/{uid}/
 *   - document principal avec infos user
 *   - data/profile/ (profil utilisateur)
 *   - data/stats/ (statistiques de jeu)
 *   - favorites/{dareId} (dares favoris)
 *   - history/{gameId} (historique des parties)
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  getFirestore,
} from 'firebase/firestore'
import { getCurrentUser } from '@/lib/firebase/auth'

// ========================================
// TYPES
// ========================================

export interface UserProfile {
  name: string
  avatarId: string | null
  avatarUrl: string | null
  categoryPreferences: {
    want: string[]
    avoid: string[]
  }
}

export interface UserStats {
  totalGamesPlayed: number
  totalGamesWon: number
  goatCount: number
  chevreCount: number
}

export interface GameHistoryEntry {
  playedAt: string
  players: string[]
  isGoat: boolean
  isChevre: boolean
  score: number
}

interface UserDocument {
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: string
  lastLoginAt: string
  isPremium: boolean
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Vérifie qu'un utilisateur est connecté
 * @throws Error si aucun utilisateur connecté
 */
function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('User must be authenticated')
  }
  return user
}

/**
 * Retourne la date actuelle au format ISO
 */
function getCurrentISODate(): string {
  return new Date().toISOString()
}

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Crée ou met à jour le document utilisateur
 * Appelé après connexion pour initialiser/synchroniser les données
 */
export async function createOrUpdateUser(): Promise<void> {
  const user = requireAuth()
  const db = getFirestore()
  const userDocRef = doc(db, 'users', user.uid)

  try {
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      // Utilisateur existant - mettre à jour lastLoginAt
      await updateDoc(userDocRef, {
        lastLoginAt: getCurrentISODate(),
      })
    } else {
      // Nouvel utilisateur - créer le document
      const userData: UserDocument = {
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: getCurrentISODate(),
        lastLoginAt: getCurrentISODate(),
        isPremium: false,
      }

      await setDoc(userDocRef, userData)

      // Initialiser les stats à 0
      const statsRef = doc(db, 'users', user.uid, 'data', 'stats')
      const initialStats: UserStats = {
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        goatCount: 0,
        chevreCount: 0,
      }
      await setDoc(statsRef, initialStats)
    }
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}

/**
 * Récupère le document utilisateur principal
 */
export async function getUserData(): Promise<UserDocument | null> {
  const user = requireAuth()
  const db = getFirestore()
  const userDocRef = doc(db, 'users', user.uid)

  try {
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      return userDoc.data() as UserDocument
    }

    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}

// ========================================
// PROFILE
// ========================================

/**
 * Sauvegarde le profil utilisateur dans Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const user = requireAuth()
  const db = getFirestore()
  const profileRef = doc(db, 'users', user.uid, 'data', 'profile')

  try {
    await setDoc(profileRef, profile, { merge: true })
  } catch (error) {
    console.error('Error saving user profile:', error)
    throw error
  }
}

/**
 * Récupère le profil utilisateur depuis Firestore
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = requireAuth()
  const db = getFirestore()
  const profileRef = doc(db, 'users', user.uid, 'data', 'profile')

  try {
    const profileDoc = await getDoc(profileRef)

    if (profileDoc.exists()) {
      return profileDoc.data() as UserProfile
    }

    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

// ========================================
// STATS
// ========================================

/**
 * Récupère les statistiques utilisateur
 */
export async function getUserStats(): Promise<UserStats | null> {
  const user = requireAuth()
  const db = getFirestore()
  const statsRef = doc(db, 'users', user.uid, 'data', 'stats')

  try {
    const statsDoc = await getDoc(statsRef)

    if (statsDoc.exists()) {
      return statsDoc.data() as UserStats
    }

    return null
  } catch (error) {
    console.error('Error getting user stats:', error)
    throw error
  }
}

/**
 * Met à jour les statistiques utilisateur
 */
export async function updateUserStats(
  updates: Partial<UserStats>
): Promise<void> {
  const user = requireAuth()
  const db = getFirestore()
  const statsRef = doc(db, 'users', user.uid, 'data', 'stats')

  try {
    await updateDoc(statsRef, updates)
  } catch (error) {
    console.error('Error updating user stats:', error)
    throw error
  }
}

// ========================================
// FAVORITES
// ========================================

/**
 * Ajoute un dare aux favoris
 */
export async function addFavorite(dareId: string): Promise<void> {
  const user = requireAuth()
  const db = getFirestore()
  const favoriteRef = doc(db, 'users', user.uid, 'favorites', dareId)

  try {
    await setDoc(favoriteRef, {
      addedAt: getCurrentISODate(),
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    throw error
  }
}

/**
 * Supprime un dare des favoris
 */
export async function removeFavorite(dareId: string): Promise<void> {
  const user = requireAuth()
  const db = getFirestore()
  const favoriteRef = doc(db, 'users', user.uid, 'favorites', dareId)

  try {
    await deleteDoc(favoriteRef)
  } catch (error) {
    console.error('Error removing favorite:', error)
    throw error
  }
}

/**
 * Récupère la liste des IDs des dares favoris
 */
export async function getFavorites(): Promise<string[]> {
  const user = requireAuth()
  const db = getFirestore()
  const favoritesRef = collection(db, 'users', user.uid, 'favorites')

  try {
    const snapshot = await getDocs(favoritesRef)
    return snapshot.docs.map((doc) => doc.id)
  } catch (error) {
    console.error('Error getting favorites:', error)
    throw error
  }
}

// ========================================
// GAME HISTORY
// ========================================

/**
 * Ajoute une partie à l'historique et met à jour les stats
 */
export async function addGameToHistory(
  gameData: GameHistoryEntry
): Promise<void> {
  const user = requireAuth()
  const db = getFirestore()

  try {
    // Générer un ID unique pour la partie
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const historyRef = doc(db, 'users', user.uid, 'history', gameId)

    // Ajouter la partie à l'historique
    await setDoc(historyRef, gameData)

    // Mettre à jour les stats
    const statsRef = doc(db, 'users', user.uid, 'data', 'stats')
    const statsDoc = await getDoc(statsRef)

    if (statsDoc.exists()) {
      const currentStats = statsDoc.data() as UserStats

      const updates: Partial<UserStats> = {
        totalGamesPlayed: currentStats.totalGamesPlayed + 1,
      }

      // Incrémenter les compteurs selon le résultat
      if (gameData.isGoat) {
        updates.goatCount = (currentStats.goatCount || 0) + 1
        updates.totalGamesWon = currentStats.totalGamesWon + 1
      }

      if (gameData.isChevre) {
        updates.chevreCount = (currentStats.chevreCount || 0) + 1
      }

      await updateDoc(statsRef, updates)
    }
  } catch (error) {
    console.error('Error adding game to history:', error)
    throw error
  }
}

/**
 * Récupère l'historique des parties (limité aux N dernières)
 */
export async function getGameHistory(
  limitCount: number = 50
): Promise<GameHistoryEntry[]> {
  const user = requireAuth()
  const db = getFirestore()
  const historyRef = collection(db, 'users', user.uid, 'history')

  try {
    const q = query(historyRef, orderBy('playedAt', 'desc'), limit(limitCount))

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as GameHistoryEntry)
  } catch (error) {
    console.error('Error getting game history:', error)
    throw error
  }
}
