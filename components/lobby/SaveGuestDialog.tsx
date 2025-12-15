'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ProfileCreator } from '@/components/profile/ProfileCreator'
import { LobbyPlayer } from '@/types/lobby'
import { LocalPlayerProfile } from '@/types/profile'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SaveGuestDialogProps {
    guest: LobbyPlayer
    onSaved: (profile: LocalPlayerProfile) => void
    trigger?: React.ReactNode
}

export function SaveGuestDialog({ guest, onSaved, trigger }: SaveGuestDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-colors" title="Sauvegarder ce profil">
                        <Save className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
                <div className="relative">
                    {/* Background blur for the modal */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl -z-10" />
                    <ProfileCreator
                        initialData={{ name: guest.name, avatarUri: guest.avatarUri }}
                        onSuccess={(profile) => {
                            setOpen(false)
                            onSaved(profile)
                        }}
                        onCancel={() => setOpen(false)}
                        className="shadow-2xl"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
