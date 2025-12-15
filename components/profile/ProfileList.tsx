'use client'

/**
 * Composant de liste et gestion des profils locaux
 * 
 * Features:
 * - Affiche tous les profils stockés localement
 * - Actions: éditer, supprimer, définir comme hôte
 * - Badge "Hôte" sur le profil principal
 * - Bouton nouveau profil
 * - Dialog de confirmation de suppression
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Crown,
    Pencil,
    Trash2,
    Plus,
    UserCheck,
    Users
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { useProfileStore, useProfiles, useHostProfile } from '@/lib/store/useProfileStore'
import { ProfileCreator } from './ProfileCreator'
import { DeleteProfileDialog } from './DeleteProfileDialog'
import { LocalPlayerProfile } from '@/types/profile'

// ========================================
// TYPES
// ========================================

export interface ProfileListProps {
    /** Callback quand un profil est sélectionné (optionnel) */
    onProfileSelect?: (profile: LocalPlayerProfile) => void
    /** Masquer le bouton de création */
    hideCreateButton?: boolean
    /** Classes CSS additionnelles */
    className?: string
}

// ========================================
// ANIMATION VARIANTS
// ========================================

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
}

// ========================================
// COMPOSANT
// ========================================

export function ProfileList({
    onProfileSelect,
    hideCreateButton = false,
    className = '',
}: ProfileListProps) {
    // Store
    const profiles = useProfiles()
    const hostProfile = useHostProfile()
    const deleteProfile = useProfileStore((s) => s.deleteProfile)
    const setHostProfile = useProfileStore((s) => s.setHostProfile)

    // State
    const [editingProfile, setEditingProfile] = useState<LocalPlayerProfile | null>(null)
    const [showCreator, setShowCreator] = useState(false)
    const [profileToDelete, setProfileToDelete] = useState<LocalPlayerProfile | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    /**
     * Génère les initiales d'un nom
     */
    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

    /**
     * Ouvre l'éditeur pour un profil
     */
    const handleEdit = useCallback((profile: LocalPlayerProfile) => {
        setEditingProfile(profile)
        setShowCreator(false)
    }, [])

    /**
     * Ouvre le dialog de suppression
     */
    const handleDeleteRequest = useCallback((profile: LocalPlayerProfile) => {
        setProfileToDelete(profile)
    }, [])

    /**
     * Confirme la suppression
     */
    const handleDeleteConfirm = useCallback(
        async (profileId: string) => {
            setIsDeleting(true)
            try {
                deleteProfile(profileId)
                setProfileToDelete(null)
            } finally {
                setIsDeleting(false)
            }
        },
        [deleteProfile]
    )

    /**
     * Définit un profil comme hôte
     */
    const handleSetHost = useCallback(
        (profileId: string) => {
            setHostProfile(profileId)
        },
        [setHostProfile]
    )

    /**
     * Callback après création/édition réussie
     */
    const handleProfileSuccess = useCallback(() => {
        setEditingProfile(null)
        setShowCreator(false)
    }, [])

    /**
     * Annule l'édition/création
     */
    const handleCancel = useCallback(() => {
        setEditingProfile(null)
        setShowCreator(false)
    }, [])

    // Mode création/édition
    if (showCreator || editingProfile) {
        return (
            <ProfileCreator
                profile={editingProfile ?? undefined}
                onSuccess={handleProfileSuccess}
                onCancel={handleCancel}
                setAsHost={!hostProfile && !editingProfile}
                className={className}
            />
        )
    }

    return (
        <div className={`w-full max-w-md mx-auto ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users className="size-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Profils</h2>
                    <Badge variant="secondary" className="ml-2">
                        {profiles.length}
                    </Badge>
                </div>
            </div>

            {/* Liste des profils */}
            {profiles.length === 0 ? (
                // État vide
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                        <User className="size-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">Aucun profil créé</p>
                    <Button onClick={() => setShowCreator(true)} className="gap-2">
                        <Plus className="size-4" />
                        Créer mon profil
                    </Button>
                </motion.div>
            ) : (
                <>
                    {/* Liste */}
                    <motion.div
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {profiles.map((profile) => {
                                const isHost = profile.id === hostProfile?.id || profile.isHost

                                return (
                                    <motion.div
                                        key={profile.id}
                                        variants={itemVariants}
                                        layout
                                        exit="exit"
                                        className={`
                      relative flex items-center gap-3 p-3 rounded-xl border transition-all
                      ${isHost
                                                ? 'bg-primary/5 border-primary/30 shadow-sm shadow-primary/10'
                                                : 'bg-card/50 border-border hover:bg-card/80'
                                            }
                    `}
                                    >
                                        {/* Avatar */}
                                        <Avatar className={`size-12 ${isHost ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                                            {profile.avatarUri ? (
                                                <AvatarImage src={profile.avatarUri} alt={profile.name} />
                                            ) : (
                                                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                                                    {getInitials(profile.name)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-foreground truncate">
                                                    {profile.name}
                                                </span>
                                                {isHost && (
                                                    <Badge className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 border-0">
                                                        <Crown className="size-3" />
                                                        Hôte
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Créé le {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            {/* Set as Host */}
                                            {!isHost && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleSetHost(profile.id)}
                                                    title="Définir comme hôte"
                                                    className="text-muted-foreground hover:text-primary"
                                                >
                                                    <UserCheck className="size-4" />
                                                </Button>
                                            )}

                                            {/* Edit */}
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleEdit(profile)}
                                                title="Modifier"
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>

                                            {/* Delete */}
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleDeleteRequest(profile)}
                                                title="Supprimer"
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>

                                        {/* Click to select (optional) */}
                                        {onProfileSelect && (
                                            <button
                                                onClick={() => onProfileSelect(profile)}
                                                className="absolute inset-0 rounded-xl"
                                                aria-label={`Sélectionner ${profile.name}`}
                                            />
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {/* Bouton nouveau profil */}
                    {!hideCreateButton && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4"
                        >
                            <Button
                                variant="outline"
                                onClick={() => setShowCreator(true)}
                                className="w-full gap-2 border-dashed"
                            >
                                <Plus className="size-4" />
                                Nouveau profil
                            </Button>
                        </motion.div>
                    )}
                </>
            )}

            {/* Dialog de suppression */}
            <DeleteProfileDialog
                profile={profileToDelete}
                isOpen={!!profileToDelete}
                onClose={() => setProfileToDelete(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    )
}

export default ProfileList
