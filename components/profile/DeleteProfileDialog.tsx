'use client'

/**
 * Dialog de confirmation de suppression de profil
 * Utilisé par ProfileList pour confirmer avant suppression
 */

import { AlertTriangle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LocalPlayerProfile } from '@/types/profile'

// ========================================
// TYPES
// ========================================

export interface DeleteProfileDialogProps {
    /** Profil à supprimer (null = dialog fermé) */
    profile: LocalPlayerProfile | null
    /** État d'ouverture */
    isOpen: boolean
    /** Callback pour fermer */
    onClose: () => void
    /** Callback de confirmation */
    onConfirm: (profileId: string) => void
    /** Chargement en cours */
    isDeleting?: boolean
}

// ========================================
// COMPOSANT
// ========================================

export function DeleteProfileDialog({
    profile,
    isOpen,
    onClose,
    onConfirm,
    isDeleting = false,
}: DeleteProfileDialogProps) {
    if (!profile) return null

    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-destructive/10">
                            <AlertTriangle className="size-5 text-destructive" />
                        </div>
                        <DialogTitle>Supprimer le profil</DialogTitle>
                    </div>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>

                {/* Profile Preview */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <Avatar className="size-12">
                        {profile.avatarUri ? (
                            <AvatarImage src={profile.avatarUri} alt={profile.name} />
                        ) : (
                            <AvatarFallback className="bg-primary/20 text-primary font-medium">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <p className="font-medium text-foreground">{profile.name}</p>
                        {profile.isHost && (
                            <span className="text-xs text-primary">Profil hôte</span>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onConfirm(profile.id)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteProfileDialog
