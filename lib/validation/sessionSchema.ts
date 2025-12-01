import { z } from 'zod'

// ========================================
// BASE SCHEMAS
// ========================================

export const difficultyLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
])

export const dareCategorySchema = z.enum([
  'Alcool',
  'Soft',
  'Humiliant',
  'Drague',
  'Public',
  'Chaos',
  'Fun',
])

// ========================================
// PLAYER SCHEMA
// ========================================

export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  avatar: z.string().optional(),
  score: z.number().int().min(0),
  jokersLeft: z.number().int().min(0),
  rerollsLeft: z.number().int().min(0),
  exchangeLeft: z.number().int().min(0),
  isHost: z.boolean(),
  isPaused: z.boolean().optional(),
})

export const sessionPlayerDocumentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  avatar: z.string().optional(),
  score: z.number().int().min(0),
  jokersLeft: z.number().int().min(0),
  rerollsLeft: z.number().int().min(0),
  exchangeLeft: z.number().int().min(0),
  isHost: z.boolean(),
})

// ========================================
// DARE SCHEMA
// ========================================

export const dareSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  difficultyLevel: difficultyLevelSchema,
  categoryTags: z.array(dareCategorySchema),
  penaltyText: z.string().optional(),
  xpReward: z.number().int().min(0),
})

// ========================================
// GAME SETTINGS SCHEMA
// ========================================

export const gameSettingsSchema = z.object({
  difficulty: difficultyLevelSchema,
  tags: z.array(dareCategorySchema),
  timerDuration: z.number().int().positive(),
  alcoholMode: z.boolean(),
  includeCustomDares: z.boolean().optional(),
})

// ========================================
// SESSION DOCUMENT SCHEMA (Firestore)
// ========================================

export const sessionDocumentSchema = z.object({
  id: z.string(),
  roomCode: z.string().length(6),
  status: z.enum(['WAITING', 'ACTIVE', 'FINISHED']),
  settings: gameSettingsSchema,
  createdAt: z.any(), // Firestore Timestamp

  // V4.0 Fields
  roundsTotal: z.number().int().positive(),
  roundsCompleted: z.number().int().min(0),
  isProgressiveMode: z.boolean(),
  endedAt: z.any().nullable().optional(), // Firestore Timestamp

  // V9.1 History Metadata
  winnerName: z.string().nullable().optional(),
  loserName: z.string().nullable().optional(),
  roundsPlayed: z.number().int().nullable().optional(),
  difficultyLabel: z.string().nullable().optional(),
  playedAt: z.any().nullable().optional(), // Firestore Timestamp

  // Game State Fields (Dynamic)
  currentTurnPlayerId: z.string().optional(),
  currentDare: dareSchema.optional(),
  isPaused: z.boolean().optional(),
  playersPlayedThisRound: z.number().int().optional(),
})

// ========================================
// TYPE INFERENCE
// ========================================

export type SessionDocumentData = z.infer<typeof sessionDocumentSchema>
export type PlayerData = z.infer<typeof playerSchema>
export type DareData = z.infer<typeof dareSchema>
export type GameSettingsData = z.infer<typeof gameSettingsSchema>
