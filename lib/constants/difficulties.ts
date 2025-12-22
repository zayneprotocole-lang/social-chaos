/**
 * Difficulty Configuration
 *
 * Centralized difficulty level definitions used across the app.
 */

// ========================================
// DIFFICULTY TYPES
// ========================================

export type DifficultyColor = 'yellow' | 'orange' | 'red' | 'purple'

export interface DifficultyLevel {
  id: string
  name: string
  emoji: string
  desc: string
  color: DifficultyColor
  special?: boolean
}

// ========================================
// DIFFICULTY LEVELS
// ========================================

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 'gentil',
    name: 'Chaos Gentil',
    emoji: '😇',
    desc: 'Facile, pour débuter',
    color: 'yellow',
  },
  {
    id: 'sauvage',
    name: 'Chaos Sauvage',
    emoji: '🔥',
    desc: 'Modéré, ça monte',
    color: 'orange',
  },
  {
    id: 'chaotique',
    name: 'Chaos Chaotique',
    emoji: '💀',
    desc: 'Extrême, sans pitié',
    color: 'red',
  },
  {
    id: 'progressif',
    name: 'Chaos Progressif',
    emoji: '📈',
    desc: 'Gentil → Chaotique',
    color: 'purple',
    special: true,
  },
]

// Standard difficulties (non-progressive)
export const STANDARD_DIFFICULTIES = DIFFICULTY_LEVELS.filter((d) => !d.special)

// Progressive mode
export const PROGRESSIVE_DIFFICULTY = DIFFICULTY_LEVELS.find((d) => d.special)

// Default selected difficulty
export const DEFAULT_DIFFICULTY = 'sauvage'

// ========================================
// DIFFICULTY STYLING
// ========================================

export const DIFFICULTY_COLOR_CLASSES: Record<DifficultyColor, string> = {
  yellow: 'border-yellow-500 bg-yellow-500/50',
  orange: 'border-orange-500 bg-orange-500/50',
  red: 'border-red-500 bg-red-500/50',
  purple: 'border-purple-500 bg-purple-500/50',
}

export const DIFFICULTY_GLOW_COLORS: Record<DifficultyColor, string> = {
  yellow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
  orange: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
  red: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Map difficulty ID to numeric level (1-4)
 */
export function difficultyIdToLevel(id: string): 1 | 2 | 3 | 4 {
  const map: Record<string, 1 | 2 | 3 | 4> = {
    gentil: 1,
    sauvage: 2,
    chaotique: 3,
    progressif: 1, // Progressive starts at 1
  }
  return map[id] || 2
}

/**
 * Check if difficulty ID is progressive mode
 */
export function isProgressiveMode(id: string): boolean {
  return id === 'progressif'
}
