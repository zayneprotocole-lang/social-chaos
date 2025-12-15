import React from 'react'
import { GameSession, Player } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, Dices, RefreshCw, Shuffle, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'

interface ActionDockProps {
    session: GameSession
    currentPlayer: Player
    isOnGoing: boolean
    setIsOnGoing: (value: boolean) => void
    onValidate: () => void
    onJoker: () => void
    onReroll: () => void
    onSwap: () => void
    // Accompagnement props
    accompagnementAvailable?: boolean
    accompagnementUsed?: boolean
    accompagnementTargetName?: string
    onAccompagnement?: () => void
    // Actions disabled when Accompagnement is invoked
    actionsDisabled?: boolean
}

const ActionDock = React.memo(({
    session,
    currentPlayer,
    isOnGoing,
    setIsOnGoing,
    onValidate,
    onJoker,
    onReroll,
    onSwap,
    accompagnementAvailable = false,
    accompagnementUsed = false,
    accompagnementTargetName,
    onAccompagnement,
    actionsDisabled = false
}: ActionDockProps) => {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm z-30">
            {/* Action Cards Row */}
            <div className="flex justify-center gap-3">
                {/* Joker */}
                {currentPlayer.jokersLeft > 0 && (
                    <Button
                        onClick={onJoker}
                        disabled={actionsDisabled}
                        variant="secondary"
                        className={cn(
                            "flex-1 h-12 bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 relative overflow-hidden group",
                            actionsDisabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        <Dices className="w-5 h-5 mr-2" />
                        <span className="font-bold">JOKER ({currentPlayer.jokersLeft})</span>
                    </Button>
                )}

                {/* Reroll */}
                {currentPlayer.rerollsLeft > 0 && (
                    <Button
                        onClick={onReroll}
                        disabled={actionsDisabled}
                        variant="secondary"
                        className={cn(
                            "flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50 relative overflow-hidden group",
                            actionsDisabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        <RefreshCw className="w-5 h-5 mr-2" />
                        <span className="font-bold">REROLL ({currentPlayer.rerollsLeft})</span>
                    </Button>
                )}

                {/* Swap */}
                {currentPlayer.exchangeLeft > 0 && (
                    <Button
                        onClick={onSwap}
                        disabled={actionsDisabled}
                        variant="secondary"
                        className={cn(
                            "flex-1 h-12 bg-orange-600 hover:bg-orange-500 text-white border border-orange-400/50 relative overflow-hidden group",
                            actionsDisabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-white/20 to-orange-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        <Shuffle className="w-5 h-5 mr-2" />
                        <span className="font-bold">SWAP ({currentPlayer.exchangeLeft})</span>
                    </Button>
                )}
            </div>

            {/* Accompagnement Row (if available) */}
            {accompagnementAvailable && onAccompagnement && (
                <div className="flex justify-center">
                    <Button
                        onClick={onAccompagnement}
                        disabled={accompagnementUsed}
                        variant="secondary"
                        className={cn(
                            "flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/50 relative overflow-hidden group",
                            accompagnementUsed && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/20 to-indigo-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        <Handshake className="w-5 h-5 mr-2" />
                        <span className="font-bold">
                            {accompagnementUsed ? 'ACCOMPAGNEMENT UTILISÉ' : `ACCOMPAGNEMENT`}
                        </span>
                        {accompagnementTargetName && !accompagnementUsed && (
                            <span className="ml-1 text-xs opacity-80">({accompagnementTargetName})</span>
                        )}
                    </Button>
                </div>
            )}

            {/* Main Actions Row */}
            <div className="flex gap-4">
                {/* V8.0: En Cours Toggle Button */}
                {(session?.settings.difficulty || 1) >= 2 && (
                    <Button
                        onClick={() => setIsOnGoing(!isOnGoing)}
                        variant="outline"
                        className={cn(
                            "flex-1 py-6 text-lg font-bold shadow-[0_0_20px_currentColor] transition-all",
                            isOnGoing
                                ? "bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-400"
                                : "border-white/30 hover:border-white/60"
                        )}
                    >
                        <Clock className="w-5 h-5 mr-2" />
                        EN COURS
                    </Button>
                )}

                {/* Validated Button */}
                <Button
                    onClick={onValidate}
                    style={{
                        backgroundColor: DIFFICULTY_CONFIG[session?.settings.difficulty || 1].color,
                        boxShadow: `0 0 20px ${DIFFICULTY_CONFIG[session?.settings.difficulty || 1].color}`
                    }}
                    className={cn(
                        "flex-1 py-6 text-lg font-bold text-black hover:opacity-90"
                    )}
                >
                    DÉFI VALIDÉ
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    )
})

ActionDock.displayName = 'ActionDock'
export default ActionDock
