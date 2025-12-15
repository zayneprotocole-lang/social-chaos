/**
 * Store Zustand pour la gestion des liens Mentor/Élève (GOAT/Chèvre)
 *
 * Système de relations entre joueurs basé sur les résultats de parties.
 * Le gagnant (GOAT) devient le Mentor du perdant (Chèvre).
 * Ce lien donne accès à l'action "Accompagnement" dans la prochaine partie ensemble.
 * Persisté dans localStorage.
 *
 * Actions principales :
 * - createLink: Crée un lien Mentor/Élève
 * - getActiveLink: Récupère un lien actif entre deux profils
 * - consumeLink: Marque un lien comme consommé (après une partie)
 * - renewLink: Réactive un lien (même GOAT/Chèvre lors d'une nouvelle partie)
 * - markAccompagnementUsed: Marque l'action Accompagnement comme utilisée
 * - deleteLink: Supprime un lien
 *
 * Hooks utilitaires :
 * - useHasAccompagnement: Vérifie si deux profils ont un lien actif
 * - useLinksForProfile: Récupère tous les liens d'un profil
 * - detectActiveDuos: Détecte les duos actifs dans une liste de joueurs
 * - enrichPlayersWithAccompagnement: Enrichit les joueurs avec les données d'accompagnement
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MentorEleveLink } from '@/types/mentor-eleve'

// ========================================
// STORE INTERFACE
// ========================================

interface MentorEleveStore {
  links: MentorEleveLink[]

  // Création
  createLink: (mentorProfileId: string, eleveProfileId: string) => void

  // Lecture
  getActiveLink: (
    profileId1: string,
    profileId2: string
  ) => MentorEleveLink | null
  getConsumedLink: (
    profileId1: string,
    profileId2: string
  ) => MentorEleveLink | null
  hasActiveLink: (profileId1: string, profileId2: string) => boolean
  getLinksForProfile: (profileId: string) => MentorEleveLink[]

  // Mise à jour
  consumeLink: (linkId: string) => void // Marque isConsumed = true
  renewLink: (linkId: string) => void // Remet isConsumed = false (si même GOAT/Chèvre)
  updateLink: (
    linkId: string,
    mentorProfileId: string,
    eleveProfileId: string
  ) => void // Mise à jour des rôles
  markAccompagnementUsed: (linkId: string, byMentor: boolean) => void
  resetAccompagnementUsage: (linkId: string) => void

  // Suppression
  deleteLink: (linkId: string) => void
  deleteConsumedLinks: () => void // Supprime tous les liens isConsumed = true
  deleteLinksForProfile: (profileId: string) => void
}

// ========================================
// STORE IMPLEMENTATION
// ========================================

export const useMentorEleveStore = create<MentorEleveStore>()(
  persist(
    (set, get) => ({
      links: [],

      // ========================================
      // CRÉATION
      // ========================================

      createLink: (mentorProfileId, eleveProfileId) => {
        // Vérifier si un lien existe déjà entre ces deux profils
        const existing = get().getActiveLink(mentorProfileId, eleveProfileId)

        if (existing) {
          // Mettre à jour les rôles si le lien existe déjà (renverse potentiellement Mentor/Élève)
          set((state) => ({
            links: state.links.map((link) =>
              link.id === existing.id
                ? {
                    ...link,
                    mentorProfileId,
                    eleveProfileId,
                    createdAt: Date.now(),
                    isConsumed: false,
                    mentorUsedAccompagnement: false,
                    eleveUsedAccompagnement: false,
                  }
                : link
            ),
          }))
          return
        }

        // Créer un nouveau lien
        const newLink: MentorEleveLink = {
          id: crypto.randomUUID(),
          mentorProfileId,
          eleveProfileId,
          createdAt: Date.now(),
          isConsumed: false,
          mentorUsedAccompagnement: false,
          eleveUsedAccompagnement: false,
        }

        set((state) => ({
          links: [...state.links, newLink],
        }))
      },

      // ========================================
      // LECTURE
      // ========================================

      getActiveLink: (profileId1, profileId2) => {
        return (
          get().links.find(
            (link) =>
              !link.isConsumed &&
              ((link.mentorProfileId === profileId1 &&
                link.eleveProfileId === profileId2) ||
                (link.mentorProfileId === profileId2 &&
                  link.eleveProfileId === profileId1))
          ) || null
        )
      },

      getConsumedLink: (profileId1, profileId2) => {
        return (
          get().links.find(
            (link) =>
              link.isConsumed &&
              ((link.mentorProfileId === profileId1 &&
                link.eleveProfileId === profileId2) ||
                (link.mentorProfileId === profileId2 &&
                  link.eleveProfileId === profileId1))
          ) || null
        )
      },

      hasActiveLink: (profileId1, profileId2) => {
        return get().getActiveLink(profileId1, profileId2) !== null
      },

      getLinksForProfile: (profileId) => {
        return get().links.filter(
          (link) =>
            link.mentorProfileId === profileId ||
            link.eleveProfileId === profileId
        )
      },

      // ========================================
      // MISE À JOUR
      // ========================================

      consumeLink: (linkId) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === linkId ? { ...link, isConsumed: true } : link
          ),
        }))
      },

      renewLink: (linkId) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === linkId
              ? {
                  ...link,
                  isConsumed: false,
                  mentorUsedAccompagnement: false,
                  eleveUsedAccompagnement: false,
                }
              : link
          ),
        }))
      },

      updateLink: (linkId, mentorProfileId, eleveProfileId) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === linkId
              ? {
                  ...link,
                  mentorProfileId,
                  eleveProfileId,
                  isConsumed: false,
                  mentorUsedAccompagnement: false,
                  eleveUsedAccompagnement: false,
                  createdAt: Date.now(),
                }
              : link
          ),
        }))
      },

      markAccompagnementUsed: (linkId, byMentor) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === linkId
              ? {
                  ...link,
                  ...(byMentor
                    ? { mentorUsedAccompagnement: true }
                    : { eleveUsedAccompagnement: true }),
                }
              : link
          ),
        }))
      },

      resetAccompagnementUsage: (linkId) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === linkId
              ? {
                  ...link,
                  mentorUsedAccompagnement: false,
                  eleveUsedAccompagnement: false,
                }
              : link
          ),
        }))
      },

      // ========================================
      // SUPPRESSION
      // ========================================

      deleteLink: (linkId) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== linkId),
        }))
      },

      deleteConsumedLinks: () => {
        set((state) => ({
          links: state.links.filter((link) => !link.isConsumed),
        }))
      },

      deleteLinksForProfile: (profileId) => {
        set((state) => ({
          links: state.links.filter(
            (link) =>
              link.mentorProfileId !== profileId &&
              link.eleveProfileId !== profileId
          ),
        }))
      },
    }),
    {
      name: 'mentor-eleve-links',
    }
  )
)

// ========================================
// HELPER HOOKS
// ========================================

/**
 * Hook utilitaire pour vérifier si deux profils ont un lien Accompagnement actif
 */
export function useHasAccompagnement(
  profileId1: string | undefined,
  profileId2: string | undefined
): boolean {
  return useMentorEleveStore((state) => {
    if (!profileId1 || !profileId2) return false
    return state.hasActiveLink(profileId1, profileId2)
  })
}

/**
 * Get all links for a given profile
 */
export function useLinksForProfile(profileId: string | undefined) {
  return useMentorEleveStore((state) =>
    profileId ? state.getLinksForProfile(profileId) : []
  )
}

/**
 * Detect active Mentor/Élève duos among a list of players
 * @param players List of players in the current game
 * @returns List of active duos with both profile and player IDs
 */
export function detectActiveDuos(
  players: { id: string; profileId?: string; name: string }[]
): ActiveDuo[] {
  const allLinks = useMentorEleveStore.getState().links
  const activeDuos: ActiveDuo[] = []

  // Filter players with profiles
  const playersWithProfile = players.filter((p) => p.profileId)

  // Check each pair of players
  for (let i = 0; i < playersWithProfile.length; i++) {
    for (let j = i + 1; j < playersWithProfile.length; j++) {
      const player1 = playersWithProfile[i]
      const player2 = playersWithProfile[j]

      // Find link between these two profiles
      const link = allLinks.find(
        (l) =>
          !l.isConsumed &&
          ((l.mentorProfileId === player1.profileId &&
            l.eleveProfileId === player2.profileId) ||
            (l.mentorProfileId === player2.profileId &&
              l.eleveProfileId === player1.profileId))
      )

      if (link) {
        activeDuos.push({
          linkId: link.id,
          mentorPlayerId:
            link.mentorProfileId === player1.profileId
              ? player1.id
              : player2.id,
          elevePlayerId:
            link.eleveProfileId === player1.profileId ? player1.id : player2.id,
          mentorProfileId: link.mentorProfileId,
          eleveProfileId: link.eleveProfileId,
        })

        // Reset usage counters for this new game
        useMentorEleveStore.getState().resetAccompagnementUsage(link.id)
      }
    }
  }

  return activeDuos
}

/**
 * Enrich players with accompagnement data based on detected duos
 * Call this at game start to populate hasAccompagnement, partnerId, etc.
 */
export function enrichPlayersWithAccompagnement<
  T extends { id: string; profileId?: string; name: string },
>(players: T[], activeDuos: ActiveDuo[]): T[] {
  return players.map((player) => {
    // Find if this player is part of any active duo
    const duoAsMentor = activeDuos.find((d) => d.mentorPlayerId === player.id)
    const duoAsEleve = activeDuos.find((d) => d.elevePlayerId === player.id)
    const duo = duoAsMentor || duoAsEleve

    if (duo) {
      const partnerId = duoAsMentor ? duo.elevePlayerId : duo.mentorPlayerId
      const partner = players.find((p) => p.id === partnerId)

      return {
        ...player,
        hasAccompagnement: true,
        accompagnementPartnerId: partnerId,
        accompagnementPartnerName: partner?.name || 'Inconnu',
        accompagnementUsed: false,
      }
    }

    return {
      ...player,
      hasAccompagnement: false,
      accompagnementPartnerId: undefined,
      accompagnementPartnerName: undefined,
      accompagnementUsed: false,
    }
  })
}

// Import ActiveDuo type for export
import { ActiveDuo } from '@/types/mentor-eleve'
export type { ActiveDuo }
