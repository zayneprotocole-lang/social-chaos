'use client'

/**
 * Composant de sélection de profils pour le lobby
 * 
 * Features:
 * - Affiche les profils sous forme de chips/badges
 * - Click pour toggle sélection
 * - L'hôte est pré-sélectionné par défaut
 * - Profils sélectionnés = colorés, non sélectionnés = grisés
 * - Option pour créer un nouveau profil rapidement
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Crown, User, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { useProfiles, useHostProfile, useHasHostProfile } from '@/lib/store/useProfileStore'
import { ProfileCreator } from './ProfileCreator'
import { LocalPlayerProfile } from '@/types/profile'

// ========================================
// TYPES
// ========================================

export interface ProfileSelectorProps {
    /** IDs des profils sélectionnés */
    selectedIds: string[]
    /** Callback quand la sélection change */
    onSelectionChange: (selectedIds: string[]) => void
    /** Nombre minimum de joueurs requis */
    minPlayers?: number
    /** Nombre maximum de joueurs */
    maxPlayers?: number
    /** Callback pour ouvrir la gestion des profils */
    onManageProfiles?: () => void
    /** Classes CSS additionnelles */
    className?: string
}

// ========================================
// ANIMATION VARIANTS
// ========================================

const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
}

// ========================================
// COMPOSANT PROFILE CHIP
// ========================================

interface ProfileChipProps {
    profile: LocalPlayerProfile
    isSelected: boolean
    isHost: boolean
    onToggle: () => void
    disabled?: boolean
}

function ProfileChip({
    profile,
    isSelected,
    isHost,
    onToggle,
    disabled = false,
}: ProfileChipProps) {
    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <motion.button
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            onClick={onToggle}
            disabled={disabled}
            className={`
        relative flex items-center gap-2 px-3 py-2 rounded-full border transition-all
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${isSelected
                    ? 'bg-primary/20 border-primary text-foreground shadow-sm shadow-primary/20'
                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/50'
                }
      `}
        >
            {/* Avatar */}
            <Avatar className={`size-7 ${isSelected ? 'ring-1 ring-primary' : ''}`}>
                {profile.avatarUri ? (
                    <AvatarImage src={profile.avatarUri} alt={profile.name} />
                ) : (
                    <AvatarFallback className="text-xs bg-muted">
                        {initials}
                    </AvatarFallback>
                )}
            </Avatar>

            {/* Nom */}
            <span className="text-sm font-medium max-w-[100px] truncate">
                {profile.name}
            </span>

            {/* Indicateurs */}
            <div className="flex items-center gap-1">
                {isHost && (
                    <Crown className={`size-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                )}

                {/* Checkmark pour sélectionné */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center justify-center size-4 rounded-full bg-primary"
                        >
                            <Check className="size-2.5 text-primary-foreground" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    )
}

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export function ProfileSelector({
    selectedIds,
    onSelectionChange,
    minPlayers = 1,
    maxPlayers = 10,
    onManageProfiles,
    className = '',
}: ProfileSelectorProps) {
    // Store
    const profiles = useProfiles()
    const hostProfile = useHostProfile()
    const hasHostProfile = useHasHostProfile()

    // State pour création rapide
    const [showQuickCreate, setShowQuickCreate] = useState(false)

    // Auto-sélectionner l'hôte au premier rendu si pas de sélection
    useEffect(() => {
        if (selectedIds.length === 0 && hostProfile) {
            onSelectionChange([hostProfile.id])
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Toggle la sélection d'un profil
     */
    const handleToggle = useCallback(
        (profileId: string) => {
            const isCurrentlySelected = selectedIds.includes(profileId)

            if (isCurrentlySelected) {
                // Désélection - vérifier le minimum
                if (selectedIds.length <= minPlayers) {
                    // Impossible de descendre en dessous du minimum
                    return
                }
                onSelectionChange(selectedIds.filter((id) => id !== profileId))
            } else {
                // Sélection - vérifier le maximum
                if (selectedIds.length >= maxPlayers) {
                    // Impossible de dépasser le maximum
                    return
                }
                onSelectionChange([...selectedIds, profileId])
            }
        },
        [selectedIds, minPlayers, maxPlayers, onSelectionChange]
    )

    /**
     * Callback après création rapide
     */
    const handleQuickCreateSuccess = useCallback(
        (profile: LocalPlayerProfile) => {
            setShowQuickCreate(false)
            // Auto-sélectionner le nouveau profil
            if (selectedIds.length < maxPlayers) {
                onSelectionChange([...selectedIds, profile.id])
            }
        },
        [selectedIds, maxPlayers, onSelectionChange]
    )

    /**
     * Obtenir les profils triés (hôte en premier)
     */
    const sortedProfiles = useMemo(() => {
        return [...profiles].sort((a, b) => {
            // Hôte en premier
            if (a.isHost && !b.isHost) return -1
            if (!a.isHost && b.isHost) return 1
            // Puis par date de création
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
    }, [profiles])

    // Mode création rapide
    if (showQuickCreate) {
        return (
            <ProfileCreator
                onSuccess={handleQuickCreateSuccess}
                onCancel={() => setShowQuickCreate(false)}
                setAsHost={!hasHostProfile}
                className={className}
            />
        )
    }

    return (
        <div className={`w-full ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                        Joueurs ({selectedIds.length})
                    </span>
                    {minPlayers > 1 && selectedIds.length < minPlayers && (
                        <span className="text-xs text-destructive">
                            (min. {minPlayers})
                        </span>
                    )}
                </div>

                {onManageProfiles && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onManageProfiles}
                        className="gap-1.5 text-muted-foreground"
                    >
                        <Settings className="size-3.5" />
                        Gérer
                    </Button>
                )}
            </div>

            {/* Liste des profils */}
            {profiles.length === 0 ? (
                // Aucun profil - inciter à créer
                <div className="text-center py-6 rounded-xl border border-dashed border-border bg-muted/20">
                    <User className="size-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                        Créez un profil pour commencer
                    </p>
                    <Button
                        size="sm"
                        onClick={() => setShowQuickCreate(true)}
                        className="gap-1.5"
                    >
                        <Plus className="size-4" />
                        Créer un profil
                    </Button>
                </div>
            ) : (
                <>
                    {/* Chips des profils */}
                    <motion.div
                        layout
                        className="flex flex-wrap gap-2 mb-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {sortedProfiles.map((profile) => {
                                const isSelected = selectedIds.includes(profile.id)
                                const isHost = profile.id === hostProfile?.id || profile.isHost
                                const canDeselect = selectedIds.length > minPlayers

                                return (
                                    <ProfileChip
                                        key={profile.id}
                                        profile={profile}
                                        isSelected={isSelected}
                                        isHost={isHost}
                                        onToggle={() => handleToggle(profile.id)}
                                        disabled={isSelected && !canDeselect}
                                    />
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {/* Bouton ajouter */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQuickCreate(true)}
                        className="gap-1.5 border-dashed w-full sm:w-auto"
                    >
                        <Plus className="size-4" />
                        Nouveau profil
                    </Button>
                </>
            )}

            {/* Info sélection */}
            {profiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                    Cliquez sur un profil pour l&apos;ajouter ou le retirer de la partie
                </p>
            )}
        </div>
    )
}

export default ProfileSelector
