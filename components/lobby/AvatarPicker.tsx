'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AVATARS = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Sora',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
]

interface AvatarPickerProps {
    onComplete: (name: string, avatar: string) => void
}

export default function AvatarPicker({ onComplete }: AvatarPickerProps) {
    const [name, setName] = useState('')
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onComplete(name, selectedAvatar)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-xl border border-border shadow-lg">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-primary">Qui es-tu ?</h2>
                <p className="text-muted-foreground">Choisis ton avatar et ton pseudo</p>
            </div>

            <div className="grid grid-cols-3 gap-4 justify-items-center">
                {AVATARS.map((avatar) => (
                    <div
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`cursor-pointer p-1 rounded-full border-2 transition-all ${selectedAvatar === avatar ? 'border-primary scale-110 shadow-[0_0_15px_var(--primary)]' : 'border-transparent hover:border-muted-foreground'
                            }`}
                    >
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>??</AvatarFallback>
                        </Avatar>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Label htmlFor="username">Ton Pseudo</Label>
                <Input
                    id="username"
                    placeholder="Ex: Le Roi de la Soirée"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50 border-primary/50 focus:border-primary"
                    required
                />
            </div>

            <Button type="submit" className="w-full text-lg font-bold py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_var(--primary)]">
                Rejoindre la partie
            </Button>
        </form>
    )
}
