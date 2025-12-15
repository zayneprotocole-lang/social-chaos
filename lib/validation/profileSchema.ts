/**
 * Schémas de validation Zod pour les profils joueurs locaux
 * Utilisés pour valider les données avant stockage/manipulation
 */

import { z } from 'zod'
import { PROFILE_CONFIG } from '@/types/profile'

// ========================================
// HELPER SCHEMAS
// ========================================

/**
 * Valide qu'une chaîne est un UUID v4 valide
 */
const uuidSchema = z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'Invalid UUID v4 format'
)

/**
 * Valide qu'une chaîne est une date ISO 8601 valide
 */
const isoDateStringSchema = z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid ISO 8601 date string'
)

/**
 * Valide qu'une chaîne est un data URI base64 valide pour une image
 * Format attendu: data:image/[type];base64,[data]
 */
const base64ImageUriSchema = z.string().refine(
    (val) => {
        // Vérifie le format data URI
        const dataUriRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i
        if (!dataUriRegex.test(val)) return false

        // Vérifie la taille approximative (base64 = ~4/3 de la taille originale)
        const base64Data = val.split(',')[1]
        if (!base64Data) return false

        const sizeInBytes = (base64Data.length * 3) / 4
        return sizeInBytes <= PROFILE_CONFIG.MAX_AVATAR_SIZE_BYTES
    },
    `Avatar must be a valid base64 image data URI and less than ${PROFILE_CONFIG.MAX_AVATAR_SIZE_BYTES / 1024}KB`
)

// ========================================
// PROFILE SCHEMAS
// ========================================

/**
 * Schéma complet d'un profil joueur local
 * Utilisé pour valider les profils récupérés du localStorage
 */
export const localPlayerProfileSchema = z.object({
    id: uuidSchema,
    name: z
        .string()
        .min(PROFILE_CONFIG.MIN_NAME_LENGTH, `Name must be at least ${PROFILE_CONFIG.MIN_NAME_LENGTH} character`)
        .max(PROFILE_CONFIG.MAX_NAME_LENGTH, `Name must be at most ${PROFILE_CONFIG.MAX_NAME_LENGTH} characters`)
        .transform((val) => val.trim()),
    avatarUri: base64ImageUriSchema.optional(),
    createdAt: isoDateStringSchema,
    isHost: z.boolean(),
    preferences: z.object({
        want: z.array(z.string()),
        avoid: z.array(z.string())
    }).optional(),
})

/**
 * Schéma pour la création d'un nouveau profil
 * L'id et createdAt seront générés automatiquement
 */
export const createProfileInputSchema = z.object({
    name: z
        .string()
        .min(PROFILE_CONFIG.MIN_NAME_LENGTH, `Name must be at least ${PROFILE_CONFIG.MIN_NAME_LENGTH} character`)
        .max(PROFILE_CONFIG.MAX_NAME_LENGTH, `Name must be at most ${PROFILE_CONFIG.MAX_NAME_LENGTH} characters`)
        .transform((val) => val.trim()),
    avatarUri: base64ImageUriSchema.optional(),
    isHost: z.boolean().optional().default(false),
    preferences: z.object({
        want: z.array(z.string()),
        avoid: z.array(z.string())
    }).optional(),
})

/**
 * Schéma pour la mise à jour d'un profil existant
 */
export const updateProfileInputSchema = z.object({
    id: uuidSchema,
    name: z
        .string()
        .min(PROFILE_CONFIG.MIN_NAME_LENGTH)
        .max(PROFILE_CONFIG.MAX_NAME_LENGTH)
        .transform((val) => val.trim())
        .optional(),
    // null permet de supprimer l'avatar, undefined le laisse inchangé
    avatarUri: z.union([base64ImageUriSchema, z.null()]).optional(),
    preferences: z.object({
        want: z.array(z.string()),
        avoid: z.array(z.string())
    }).optional(),
})

/**
 * Schéma pour l'état complet du store
 * Utilisé pour valider les données persistées dans localStorage
 */
export const profileStoreStateSchema = z.object({
    profiles: z.array(localPlayerProfileSchema),
    hostProfileId: z.string().nullable(),
})

// ========================================
// TYPE INFERENCE
// ========================================

export type LocalPlayerProfileData = z.infer<typeof localPlayerProfileSchema>
export type CreateProfileInputData = z.infer<typeof createProfileInputSchema>
export type UpdateProfileInputData = z.infer<typeof updateProfileInputSchema>
export type ProfileStoreStateData = z.infer<typeof profileStoreStateSchema>

// ========================================
// VALIDATION HELPERS
// ========================================

/**
 * Valide un profil et retourne le résultat avec les erreurs éventuelles
 */
export function validateProfile(data: unknown) {
    return localPlayerProfileSchema.safeParse(data)
}

/**
 * Valide les données de création d'un profil
 */
export function validateCreateProfileInput(data: unknown) {
    return createProfileInputSchema.safeParse(data)
}

/**
 * Valide les données de mise à jour d'un profil
 */
export function validateUpdateProfileInput(data: unknown) {
    return updateProfileInputSchema.safeParse(data)
}

/**
 * Valide l'état complet du store
 * Utile pour la migration ou la récupération de données corrompues
 */
export function validateProfileStoreState(data: unknown) {
    return profileStoreStateSchema.safeParse(data)
}
