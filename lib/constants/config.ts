import { DifficultyLevel, DareCategory } from '../../types/index'

export const GAME_CONFIG = {
  TIMERS: {
    DEFAULT: 30,
    SHORT: 15,
    LONG: 60,
  },
  ROUNDS: {
    MIN: 5,
    MAX: 50,
    DEFAULT: 6,
  },
  COLORS: {
    PRIMARY: '#7c3aed',
    SECONDARY: '#db2777',
    SUCCESS: '#10b981',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    GOLD: '#eab308',
    PROGRESSIVE: {
      BORDER: '#FF1493',
      BG_GRADIENT:
        'linear-gradient(135deg, #FF1493 0%, #FF69B4 25%, #FFB6C1 50%, #FF69B4 75%, #FF1493 100%)',
      SHADOW: '0 0 20px rgba(255, 20, 147, 0.5)',
    },
    UI: {
      BACKGROUND_OVERLAY: 'from-purple-900/90 via-black to-black',
      WINNER: '#eab308', // yellow-500
      LOSER: '#ef4444', // red-500
    },
  },
  UI: {
    APP_NAME: 'SocialChaos',
    LOADING_TEXT: 'Chargement...',
  },
} as const

export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  {
    name: string
    color: string
    timer: number
    description?: string
    backgroundClass: string
  }
> = {
  1: {
    name: 'Échauffement',
    color: '#39FF14',
    timer: 0,
    description: 'Juste pour rire, sans pression.',
    backgroundClass: 'from-green-900/20 via-black to-black',
  },
  2: {
    name: 'Audace',
    color: '#FFC300',
    timer: 120,
    description: "On monte d'un cran. Ça devient sérieux.",
    backgroundClass: 'from-yellow-900/20 via-black to-black',
  },
  3: {
    name: 'Chaos',
    color: '#FF4500',
    timer: 60,
    description: 'Préparez-vous à souffrir (de rire).',
    backgroundClass: 'from-orange-900/20 via-black to-black',
  },
  4: {
    name: 'Apocalypse',
    color: '#8A2BE2',
    timer: 30,
    description: 'Plus de règles, plus de limites.',
    backgroundClass: 'from-purple-900/20 via-black to-black',
  },
}

export const CATEGORY_CONFIG: Record<
  DareCategory,
  { label: string; color: string }
> = {
  Fun: { label: 'Fun', color: 'bg-yellow-500' },
  Alcool: { label: 'Alcool', color: 'bg-orange-500' },
  Soft: { label: 'Soft', color: 'bg-green-500' },
  Humiliant: { label: 'Humiliant', color: 'bg-red-500' },
  Drague: { label: 'Drague', color: 'bg-pink-500' },
  Public: { label: 'Public', color: 'bg-blue-500' },
  Chaos: { label: 'Chaos', color: 'bg-purple-500' },
  Indoor: { label: 'Maison', color: 'bg-indigo-500' },
  Truth: { label: 'Vérité', color: 'bg-cyan-500' },
  Physique: { label: 'Physique', color: 'bg-rose-500' },
  Social: { label: 'Réseaux', color: 'bg-violet-500' },
  Acting: { label: 'Acting', color: 'bg-lime-500' },
  Duel: { label: 'Duel', color: 'bg-red-600' },
  Spicy: { label: 'Spicy', color: 'bg-pink-600' },
  Cupidon: { label: 'Cupidon', color: 'bg-rose-400' },
  Sensuel: { label: 'Sensuel', color: 'bg-fuchsia-500' },
  Phone: { label: 'Phone', color: 'bg-blue-600' },
  Duo: { label: 'Duo', color: 'bg-teal-500' },
  Group: { label: 'Groupe', color: 'bg-emerald-500' },
}
