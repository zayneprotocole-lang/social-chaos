'use client'

import { useState } from 'react'
import { Settings2, Save } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/lib/store/useProfileStore'
import { CategoryPreferencesSelector } from '@/components/profile/CategoryPreferencesSelector'
import { useLobbyStore } from '@/lib/store/useLobbyStore'

interface PlayerPreferencesDialogProps {
    profileId: string
    trigger?: React.ReactNode
}

export function PlayerPreferencesDialog({
    profileId,
    trigger
}: PlayerPreferencesDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const updateProfile = useProfileStore((s) => s.updateProfile)
    const getProfile = useProfileStore((s) => s.getProfileById)

    // Sync with Lobby Store
    const lobbyPlayers = useLobbyStore((s) => s.players)
    const updateLobbyPreferences = useLobbyStore((s) => s.updatePlayerPreferences)

    const profile = getProfile(profileId)
    const [preferences, setPreferences] = useState(
        profile?.preferences ?? { want: [], avoid: [] }
    )

    // Reset local state when opening
    const handleOpenChange = (open: boolean) => {
        if (open && profile) {
            setPreferences(profile.preferences ?? { want: [], avoid: [] })
        }
        setIsOpen(open)
    }

    const handleSave = () => {
        if (!profile) return

        // 1. Update Persistent Profile
        updateProfile({
            id: profileId,
            preferences
        })

        // 2. Update Lobby Player if present
        const lobbyPlayer = lobbyPlayers.find(p => p.profileId === profileId)
        if (lobbyPlayer) {
            updateLobbyPreferences(lobbyPlayer.id, preferences)
        }

        setIsOpen(false)
    }

    if (!profile) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon-sm" className="size-8">
                        <Settings2 className="size-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Préférences de {profile.name}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <CategoryPreferencesSelector
                        preferences={preferences}
                        onChange={setPreferences}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="size-4" />
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
