/**
 * Store Zustand pour les Missions Quotidiennes
 *
 * Gère:
 * - Configuration utilisateur (catégorie, jours)
 * - Mission du jour
 * - Historique des missions
 * - Statistiques
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DailyMissionConfig,
  DailyMissionCategoryId,
  MissionHistoryEntry,
  MissionStatus,
  DailyMissionStats,
  DailyMission,
} from '@/lib/types/dailyMission'
import { getRandomMission, getMissionById } from '@/lib/constants/dailyMissions'

// ========================================
// TYPES
// ========================================

interface DailyMissionState {
  /** Configuration utilisateur */
  config: DailyMissionConfig
  /** Mission actuelle du jour */
  todayMission: MissionHistoryEntry | null
  /** Historique complet des missions */
  history: MissionHistoryEntry[]
}

interface DailyMissionActions {
  // Configuration
  setCategory: (categoryId: DailyMissionCategoryId) => void
  toggleDay: (day: number) => void
  setActiveDays: (days: number[]) => void
  setNotificationTime: (time: string) => void
  setNotificationsEnabled: (enabled: boolean) => void
  activate: () => void
  deactivate: () => void
  resetConfig: () => void

  // Mission du jour
  generateTodayMission: () => void
  completeMission: () => void
  skipMission: () => void

  // Helpers
  getTodayDate: () => string
  isTodayActive: () => boolean
  getStats: () => DailyMissionStats
  getMissionForDate: (date: string) => MissionHistoryEntry | null
}

type DailyMissionStore = DailyMissionState & DailyMissionActions

// ========================================
// INITIAL STATE
// ========================================

const initialConfig: DailyMissionConfig = {
  categoryId: null,
  activeDays: [1, 2, 3, 4, 5], // Lun-Ven par défaut
  notificationTime: '09:00',
  isActive: false,
  notificationsEnabled: false,
}

const initialState: DailyMissionState = {
  config: initialConfig,
  todayMission: null,
  history: [],
}

// ========================================
// STORE
// ========================================

export const useDailyMissionStore = create<DailyMissionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // CONFIGURATION
      // ========================================

      setCategory: (categoryId) => {
        set((state) => ({
          config: { ...state.config, categoryId },
        }))
      },

      toggleDay: (day) => {
        set((state) => {
          const currentDays = state.config.activeDays
          const newDays = currentDays.includes(day)
            ? currentDays.filter((d) => d !== day)
            : [...currentDays, day].sort((a, b) => a - b)

          return {
            config: { ...state.config, activeDays: newDays },
          }
        })
      },

      setActiveDays: (days) => {
        set((state) => ({
          config: { ...state.config, activeDays: days.sort((a, b) => a - b) },
        }))
      },

      setNotificationTime: (time) => {
        set((state) => ({
          config: { ...state.config, notificationTime: time },
        }))
      },

      setNotificationsEnabled: (enabled) => {
        set((state) => ({
          config: { ...state.config, notificationsEnabled: enabled },
        }))
      },

      activate: () => {
        set((state) => ({
          config: { ...state.config, isActive: true },
        }))
        // Générer la mission du jour immédiatement si c'est un jour actif
        const store = get()
        if (store.isTodayActive()) {
          store.generateTodayMission()
        }
      },

      deactivate: () => {
        set((state) => ({
          config: { ...state.config, isActive: false },
        }))
      },

      resetConfig: () => {
        set({
          config: initialConfig,
          todayMission: null,
        })
      },

      // ========================================
      // MISSION DU JOUR
      // ========================================

      generateTodayMission: () => {
        const { config, history, getTodayDate } = get()
        const today = getTodayDate()

        // Vérifier si on a déjà une mission pour aujourd'hui
        const existingMission = history.find((h) => h.date === today)
        if (existingMission) {
          set({ todayMission: existingMission })
          return
        }

        // Pas de catégorie configurée
        if (!config.categoryId) {
          set({ todayMission: null })
          return
        }

        // Générer une nouvelle mission
        // Éviter les missions récentes (dernières 5)
        const recentMissionIds = history.slice(-5).map((h) => h.missionId)
        let mission: DailyMission | null = null
        let attempts = 0

        do {
          mission = getRandomMission(config.categoryId)
          attempts++
        } while (
          mission &&
          recentMissionIds.includes(mission.id) &&
          attempts < 10
        )

        if (!mission) {
          set({ todayMission: null })
          return
        }

        // Créer l'entrée historique
        const newEntry: MissionHistoryEntry = {
          id: `${today}-${mission.id}`,
          missionId: mission.id,
          mission,
          date: today,
          status: 'pending',
        }

        set((state) => ({
          todayMission: newEntry,
          history: [...state.history, newEntry],
        }))
      },

      completeMission: () => {
        const { todayMission } = get()
        if (!todayMission) return

        const updatedEntry: MissionHistoryEntry = {
          ...todayMission,
          status: 'completed',
          completedAt: Date.now(),
        }

        set((state) => ({
          todayMission: updatedEntry,
          history: state.history.map((h) =>
            h.id === updatedEntry.id ? updatedEntry : h
          ),
        }))
      },

      skipMission: () => {
        const { todayMission } = get()
        if (!todayMission) return

        const updatedEntry: MissionHistoryEntry = {
          ...todayMission,
          status: 'skipped',
        }

        set((state) => ({
          todayMission: updatedEntry,
          history: state.history.map((h) =>
            h.id === updatedEntry.id ? updatedEntry : h
          ),
        }))
      },

      // ========================================
      // HELPERS
      // ========================================

      getTodayDate: () => {
        return new Date().toISOString().split('T')[0]
      },

      isTodayActive: () => {
        const { config } = get()
        const today = new Date().getDay() // 0 = Dimanche
        return config.activeDays.includes(today)
      },

      getMissionForDate: (date) => {
        return get().history.find((h) => h.date === date) || null
      },

      getStats: () => {
        const { history } = get()

        const completed = history.filter((h) => h.status === 'completed').length
        const skipped = history.filter((h) => h.status === 'skipped').length
        const total = history.filter((h) => h.status !== 'pending').length

        // Calculer le streak actuel
        let currentStreak = 0
        const sortedHistory = [...history]
          .filter((h) => h.status !== 'pending')
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )

        for (const entry of sortedHistory) {
          if (entry.status === 'completed') {
            currentStreak++
          } else {
            break
          }
        }

        // Calculer le plus long streak
        let longestStreak = 0
        let tempStreak = 0
        const chronologicalHistory = [...history]
          .filter((h) => h.status !== 'pending')
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )

        for (const entry of chronologicalHistory) {
          if (entry.status === 'completed') {
            tempStreak++
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak
            }
          } else {
            tempStreak = 0
          }
        }

        return {
          totalMissions: total,
          completedMissions: completed,
          skippedMissions: skipped,
          currentStreak,
          longestStreak,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      },
    }),
    {
      name: 'social-chaos-daily-missions',
    }
  )
)

// ========================================
// HOOKS UTILITAIRES
// ========================================

export function useDailyMissionConfig() {
  return useDailyMissionStore((state) => state.config)
}

export function useTodayMission() {
  return useDailyMissionStore((state) => state.todayMission)
}

export function useDailyMissionHistory() {
  return useDailyMissionStore((state) => state.history)
}

export function useDailyMissionStats() {
  return useDailyMissionStore((state) => state.getStats())
}
