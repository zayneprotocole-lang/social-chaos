'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Settings, Volume2, LogOut, Save } from 'lucide-react'

import { Player } from '@/lib/types'
import PausePlayerManager from './PausePlayerManager'
import { useSavedGameStore } from '@/lib/store/useSavedGameStore'
import { useGameStore } from '@/lib/store/useGameStore'
import { GameSession } from '@/types/index'

interface OptionsMenuProps {
    onEndGame?: () => void
    players?: Player[]
    currentTurnPlayerId?: string
    onTogglePause?: (playerId: string, isPaused: boolean) => void
    session?: GameSession | null // For saving
}

export default function OptionsMenu({
    onEndGame,
    players,
    currentTurnPlayerId,
    onTogglePause,
    session
}: OptionsMenuProps) {
    const router = useRouter()
    const [volume, setVolume] = useState([50])
    const saveGame = useSavedGameStore(s => s.saveGame)
    const deleteGame = useSavedGameStore(s => s.deleteGame)
    const setActiveSession = useGameStore(s => s.setActiveSession)

    const handleEndGame = () => {
        // Delete any saved game to prevent phantom "resume" button
        deleteGame()
        setActiveSession(null, null)

        if (onEndGame) {
            onEndGame()
        } else {
            // Default behavior: go to home
            router.push('/')
        }
    }

    const handleSaveAndQuit = () => {
        if (session) {
            saveGame(session)
            console.log('✅ Partie sauvegardée!')
        }
        router.push('/')
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm border-white/20"
                >
                    <Settings className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/90 border-l border-primary/20 text-white w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-primary font-black uppercase tracking-widest flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Options
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-8 h-full overflow-y-auto pb-10">
                    {/* Volume Control */}
                    <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-white">
                            <Volume2 className="w-4 h-4" />
                            Volume
                        </Label>
                        <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">{volume[0]}%</p>
                    </div>

                    {/* Player Management (Pause) */}
                    {players && onTogglePause && (
                        <div className="pt-4 border-t border-white/10">
                            <PausePlayerManager
                                players={players}
                                currentTurnPlayerId={currentTurnPlayerId}
                                onTogglePause={onTogglePause}
                            />
                        </div>
                    )}

                    {/* Save and Quit Button */}
                    {session && (
                        <div className="pt-4 border-t border-white/10">
                            <Button
                                onClick={handleSaveAndQuit}
                                variant="secondary"
                                className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Save className="w-4 h-4" />
                                Sauvegarder et quitter
                            </Button>
                        </div>
                    )}

                    {/* End Game Button */}
                    <div className="pt-4 border-t border-white/10">
                        <Button
                            onClick={handleEndGame}
                            variant="destructive"
                            className="w-full flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Terminer la Partie
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
