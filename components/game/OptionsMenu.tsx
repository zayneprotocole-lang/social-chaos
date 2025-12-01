'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Settings, Volume2, LogOut } from 'lucide-react'

interface OptionsMenuProps {
    onEndGame?: () => void
}

export default function OptionsMenu({ onEndGame }: OptionsMenuProps) {
    const router = useRouter()
    const [volume, setVolume] = useState([50])

    const handleEndGame = () => {
        if (onEndGame) {
            onEndGame()
        } else {
            // Default behavior: go to home
            router.push('/')
        }
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
            <SheetContent side="right" className="bg-black/90 border-l border-primary/20 text-white w-[300px]">
                <SheetHeader>
                    <SheetTitle className="text-primary font-black uppercase tracking-widest flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Options
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-8">
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
