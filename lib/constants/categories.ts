/**
 * Category Configuration
 *
 * Centralized category definitions used across the app.
 * Categories are grouped by theme for the lobby UI.
 */

// ========================================
// CATEGORY TYPES
// ========================================

export interface Category {
  id: string
  emoji: string
  name: string
  desc: string
  warning: 'echange' | 'karaoke' | null
}

export interface CategoryGroup {
  theme: string
  emoji: string
  categories: Category[]
}

// ========================================
// CATEGORY GROUPS
// ========================================

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    theme: 'Pour séduire',
    emoji: '💘',
    categories: [
      {
        id: 'sauvage',
        emoji: '😎',
        name: 'Rizz',
        desc: 'Un crush ? Brisez la glace',
        warning: null,
      },
      {
        id: 'echange',
        emoji: '🤝',
        name: 'Échange',
        desc: 'Idéal pour se rapprocher',
        warning: 'echange',
      },
      {
        id: 'karaoke',
        emoji: '🎤',
        name: 'Karaoké',
        desc: 'Pour une nuit caliente',
        warning: 'karaoke',
      },
    ],
  },
  {
    theme: "Pour s'amuser",
    emoji: '🎉',
    categories: [
      {
        id: 'folie',
        emoji: '😈',
        name: 'Absurde',
        desc: 'Gênance et honte maximum',
        warning: null,
      },
      {
        id: 'jeux',
        emoji: '🎲',
        name: 'Jeux',
        desc: 'Rencontre fun et amusante',
        warning: null,
      },
      {
        id: 'favoris',
        emoji: '⭐',
        name: 'Favoris',
        desc: 'Vos gages préférés',
        warning: null,
      },
    ],
  },
  {
    theme: 'Pour faire des rencontres',
    emoji: '🤝',
    categories: [
      {
        id: 'philo',
        emoji: '🧠',
        name: 'Philo',
        desc: 'Discussion profonde et amusante',
        warning: null,
      },
      {
        id: 'enquete',
        emoji: '🔍',
        name: 'Enquête',
        desc: 'Facile, idéal pour poser les bases',
        warning: null,
      },
      {
        id: 'mignon',
        emoji: '🥰',
        name: 'Mignon',
        desc: 'Bienveillance et bonne action',
        warning: null,
      },
    ],
  },
]

// Flat list of all categories for logic (selection, etc.)
export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((g) => g.categories)

// Category IDs only
export const CATEGORY_IDS = ALL_CATEGORIES.map((c) => c.id)

// Default selected categories
export const DEFAULT_SELECTED_CATEGORIES = ['sauvage', 'jeux', 'mignon']

// Minimum categories required to start a game
export const MIN_CATEGORIES_REQUIRED = 3

// ========================================
// CATEGORY STYLING
// ========================================

export const CATEGORY_BG_COLORS: Record<string, string> = {
  sauvage: 'bg-purple-500/15 border-purple-500/25',
  jeux: 'bg-cyan-500/15 border-cyan-500/25',
  philo: 'bg-violet-500/15 border-violet-500/25',
  mignon: 'bg-pink-500/15 border-pink-500/25',
  folie: 'bg-purple-600/15 border-purple-600/25',
  enquete: 'bg-cyan-600/15 border-cyan-600/25',
  echange: 'bg-violet-600/15 border-violet-600/25',
  karaoke: 'bg-fuchsia-500/15 border-fuchsia-500/25',
  favoris: 'bg-purple-400/15 border-purple-400/25',
}

export const CATEGORY_SELECTED_COLORS: Record<string, string> = {
  sauvage:
    'bg-purple-500/55 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  jeux: 'bg-cyan-500/55 border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
  philo:
    'bg-violet-500/55 border-2 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]',
  mignon:
    'bg-pink-500/55 border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]',
  folie:
    'bg-purple-600/55 border-2 border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.4)]',
  enquete:
    'bg-cyan-600/55 border-2 border-cyan-600 shadow-[0_0_20px_rgba(8,145,178,0.4)]',
  echange:
    'bg-violet-600/55 border-2 border-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.4)]',
  karaoke:
    'bg-fuchsia-500/55 border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
  favoris:
    'bg-purple-400/55 border-2 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.4)]',
}
