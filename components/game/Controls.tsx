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
  disabled,
}: ControlsProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Main Action Area */}
      <div className="w-full max-w-sm">
        {step === 'START' && (
          <Button
            onClick={onStart}
            disabled={disabled}
            className="h-20 w-full animate-pulse text-xl font-black tracking-widest uppercase shadow-[0_0_20px_var(--primary)]"
          >
            <Play className="mr-2 h-6 w-6" /> Commencer le Défi
          </Button>
        )}

        {step === 'ACTION' && (
          <Button
            onClick={onNext}
            disabled={disabled}
            className="h-20 w-full bg-blue-600 text-xl font-black tracking-widest uppercase shadow-[0_0_20px_#2563eb] hover:bg-blue-500"
          >
            Prochain Joueur <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Power Cards Dock */}
      <div className="mt-4 flex w-full max-w-md justify-center gap-4">
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

interface PowerCardProps {
  icon: React.ElementType
  label: string
  count: number
  onClick: () => void
  disabled: boolean
  color: string
}

function PowerCard({
  icon: Icon,
  label,
  count,
  onClick,
  disabled,
  color,
}: PowerCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-28 w-20 flex-col items-center justify-center rounded-xl border-2 bg-black/80 transition-all duration-300',
        color,
        disabled
          ? 'cursor-not-allowed opacity-30 grayscale'
          : 'cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_currentColor]'
      )}
    >
      <div className="flex flex-1 items-center justify-center">
        <Icon className="h-8 w-8" />
      </div>
      <div className="w-full bg-white/10 py-1 text-center text-[10px] font-bold tracking-wider uppercase">
        {label}
      </div>
    </button>
  )
}
