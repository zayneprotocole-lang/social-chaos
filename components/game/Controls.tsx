'use client'

import { Button } from '@/components/ui/button'
import { Shuffle, Repeat, RefreshCw, Play, ArrowRight } from 'lucide-react'
import { Player } from '@/lib/types'
import { cn } from '@/lib/utils'

export type ControlStep = 'START' | 'ACTION'

interface ControlsProps {
    player: Player
    step: ControlStep
    onStart: () => void
    onNext: () => void
    onJoker: () => void
    onReroll: () => void
    onSwap: () => void
    disabled: boolean
}

export default function Controls({
    player,
    step,
    onStart,
    onNext,
    onJoker,
    onReroll,
    onSwap,
    disabled
}: ControlsProps) {
    return (
        <div className="w-full flex flex-col gap-6 items-center">

            {/* Main Action Area */}
            <div className="w-full max-w-sm">
                {step === 'START' && (
                    <Button
                        onClick={onStart}
                        disabled={disabled}
                        className="w-full h-20 text-xl font-black uppercase tracking-widest animate-pulse shadow-[0_0_20px_var(--primary)]"
                    >
                        <Play className="mr-2 h-6 w-6" /> Commencer le Défi
                    </Button>
                )}

                {step === 'ACTION' && (
                    <Button
                        onClick={onNext}
                        disabled={disabled}
                        className="w-full h-20 text-xl font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_#2563eb]"
                    >
                        Prochain Joueur <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                )}
            </div>

            {/* Power Cards Dock */}
            <div className="w-full max-w-md flex justify-center gap-4 mt-4">
                {player.jokersLeft > 0 && (
                    <PowerCard
                        icon={Shuffle}
                        label="JOKER"
                        count={player.jokersLeft}
                        onClick={onJoker}
                        disabled={disabled}
                        color="border-primary text-primary"
                    />
                )}
                {player.rerollsLeft > 0 && (
                    <PowerCard
                        icon={RefreshCw}
                        label="REROLL"
                        count={player.rerollsLeft}
                        onClick={onReroll}
                        disabled={disabled}
                        color="border-secondary text-secondary"
                    />
                )}
                {player.exchangeLeft > 0 && (
                    <PowerCard
                        icon={Repeat}
                        label="SWAP"
                        count={player.exchangeLeft}
                        onClick={onSwap}
                        disabled={disabled}
                        color="border-orange-500 text-orange-500"
                    />
                )}
            </div>
        </div>
    )
}

function PowerCard({ icon: Icon, label, count, onClick, disabled, color }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex flex-col items-center justify-center w-20 h-28 bg-black/80 border-2 rounded-xl transition-all duration-300 relative",
                color,
                disabled ? "opacity-30 grayscale cursor-not-allowed" : "hover:scale-110 hover:shadow-[0_0_15px_currentColor] cursor-pointer"
            )}
        >
            <div className="flex-1 flex items-center justify-center">
                <Icon className="w-8 h-8" />
            </div>
            <div className="w-full bg-white/10 py-1 text-[10px] font-bold text-center uppercase tracking-wider">
                {label}
            </div>
        </button>
    )
}
