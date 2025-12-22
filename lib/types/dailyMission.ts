/**
 * Types pour les Missions Quotidiennes
 */

// ========================================
// MISSION TYPES
// ========================================

export type DailyMissionCategoryId = 'kindness' | 'growth' | 'seduction'

export interface DailyMissionCategory {
  id: DailyMissionCategoryId
  name: string
  emoji: string
  description: string
  color: string
  gradient: string
}

export interface DailyMission {
  id: string
  categoryId: DailyMissionCategoryId
  content: string
  tips?: string
}

// ========================================
// CONFIG TYPES
// ========================================

export interface DailyMissionConfig {
  /** Catégorie active */
  categoryId: DailyMissionCategoryId | null
  /** Jours actifs (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi) */
  activeDays: number[]
  /** Heure de notification (format HH:MM) */
  notificationTime: string
  /** Feature activée */
  isActive: boolean
  /** Notifications activées */
  notificationsEnabled: boolean
}

// ========================================
// HISTORY TYPES
// ========================================

export type MissionStatus = 'pending' | 'completed' | 'skipped'

export interface MissionHistoryEntry {
  id: string
  missionId: string
  mission: DailyMission
  date: string // Format ISO: "2024-12-22"
  status: MissionStatus
  completedAt?: number // Timestamp
}

// ========================================
// STATS TYPES
// ========================================

export interface DailyMissionStats {
  totalMissions: number
  completedMissions: number
  skippedMissions: number
  currentStreak: number
  longestStreak: number
  completionRate: number // 0-100
}
