/**
 * Types for the Mentor/Élève relationship system
 */

export interface MentorEleveLink {
    id: string                      // UUID unique
    mentorProfileId: string         // ID du profil Mentor (ex-GOAT)
    eleveProfileId: string          // ID du profil Élève (ex-Chèvre)
    createdAt: number               // Timestamp de création
    isConsumed: boolean             // true = utilisé dans une partie, en attente de suppression

    // Tracking des utilisations indépendantes (1 fois chacun par partie)
    mentorUsedAccompagnement: boolean
    eleveUsedAccompagnement: boolean
}

export interface AccompagnementState {
    isActive: boolean
    accompagnateurId?: string       // ID du joueur qui accompagne
    accompagnateurName?: string     // Nom pour l'affichage
    linkId?: string                 // Lien concerné
}

/**
 * ActiveDuo - Detected at game start for players with Mentor/Élève links
 */
export interface ActiveDuo {
    linkId: string                  // ID of the MentorEleveLink
    mentorPlayerId: string          // Player ID (not profile) who is the Mentor
    elevePlayerId: string           // Player ID who is the Élève
    mentorProfileId: string         // Profile ID of Mentor
    eleveProfileId: string          // Profile ID of Élève
}
