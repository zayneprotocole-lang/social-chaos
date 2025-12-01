'use client'

import { useParams } from 'next/navigation'
import DareCard from '@/components/game/DareCard'
import GameTimer from '@/components/game/GameTimer'
import SentencePopup from '@/components/game/SentencePopup'
import { Button } from '@/components/ui/button'
import { ArrowRight, Skull } from 'lucide-react'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'
import { cn } from '@/lib/utils'
import OptionsMenu from '@/components/game/OptionsMenu'
import GameEndScreen from '@/components/game/GameEndScreen'
import { useGameSession } from '@/hooks/useGameSession'
import { useGameFlow } from '@/hooks/useGameFlow'
import { useGameActions } from '@/hooks/useGameActions'

// New UI Components
import GameProgress from '@/components/game/GameProgress'
import PlayerListVertical from '@/components/game/PlayerListVertical'
import TurnIndicator from '@/components/game/TurnIndicator'
import ActionDock from '@/components/game/ActionDock'
import AbandonOverlay from '@/components/game/AbandonOverlay'

export default function GamePage() {
    const params = useParams()
    const { session, currentPlayer, isMyTurn, isGameFinished, MOCK_DARES } = useGameSession(params.id as string)

    const {
        isCardVisible,
        gameStatus,
        controlStep,
        setControlStep,
        isSentenceOpen,
        setIsSentenceOpen,
        currentPenalty,
        isAbandonConfirmOpen,
        isTimerActive,
        isOnGoing,
        setIsOnGoing,
        startTurn,
        handleTimerComplete,
        handleNextTurn,
        handleValidateChallenge,
        handleAbandon,
        confirmAbandon,
        cancelAbandon,
        handleSentenceNext
    } = useGameFlow(session, MOCK_DARES)

    const {
        isSwapping,
        handlePlayerClick,
        handleJoker,
        handleReroll,
        handleSwap
    } = useGameActions(currentPlayer, MOCK_DARES, handleNextTurn)

    // Determine background based on difficulty (Apocalypse is now Violet)
    const getBackgroundClass = () => {
        const diff = session?.settings.difficulty || 1
        return DIFFICULTY_CONFIG[diff].backgroundClass
    }

    if (!session || !currentPlayer) return <div className="flex items-center justify-center h-screen bg-black text-white">Chargement...</div>

    if (isGameFinished) {
        return <GameEndScreen players={session.players} />
    }

    return (
        <div className={cn(
            "min-h-screen flex flex-col pb-safe transition-colors duration-1000 bg-gradient-to-b",
            getBackgroundClass()
        )}>
            {/* Options Menu - Top Right */}
            <div className="fixed top-4 right-4 z-50">
                <OptionsMenu />
            </div>

            {/* Game Progress Display */}
            <GameProgress session={session} />

            {/* Player List - Always Visible Sidebar */}
            <PlayerListVertical
                session={session}
                currentPlayer={currentPlayer}
                isSwapping={isSwapping}
                onPlayerClick={handlePlayerClick}
            />

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative p-4 pr-56">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

                {/* Turn Indicator - Above Card */}
                <TurnIndicator currentPlayer={currentPlayer} />

                {/* Timer */}
                <div className="w-full max-w-md z-10 relative">
                    {/* Abandon button moved next to timer */}
                    {gameStatus === 'PLAYING' && controlStep === 'ACTION' && (session?.settings.difficulty || 1) >= 2 && (
                        <Button
                            onClick={handleAbandon}
                            variant="destructive"
                            size="sm"
                            className="absolute -top-12 right-0 text-xs px-3 py-1 shadow-[0_0_10px_var(--destructive)]"
                        >
                            <Skull className="w-3 h-3 mr-1" />
                            ABANDON
                        </Button>
                    )}
                    <GameTimer
                        duration={session.settings.timerDuration}
                        isActive={isTimerActive && !isOnGoing}
                        onComplete={handleTimerComplete}
                        isGolden={isOnGoing}
                    />
                </div>

                {/* The Card */}
                <div className="w-full relative z-20 perspective-1000">
                    {session.currentDare && (
                        <DareCard dare={session.currentDare} isVisible={isCardVisible} />
                    )}
                </div>

                {/* Buttons Below Card */}
                {gameStatus === 'PLAYING' && controlStep === 'ACTION' && (
                    <ActionDock
                        session={session}
                        currentPlayer={currentPlayer}
                        isOnGoing={isOnGoing}
                        setIsOnGoing={setIsOnGoing}
                        onValidate={() => handleValidateChallenge(currentPlayer.id)}
                        isMyTurn={isMyTurn}
                        onJoker={handleJoker}
                        onReroll={handleReroll}
                        onSwap={handleSwap}
                    />
                )}

                {/* Start Button (Draw Card) */}
                {gameStatus === 'IDLE' && (
                    <Button
                        onClick={startTurn}
                        className="w-full max-w-xs py-8 text-2xl font-black animate-bounce shadow-[0_0_30px_var(--primary)] z-30"
                    >
                        TIRER UNE CARTE <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                )}
            </div>

            <SentencePopup
                isOpen={isSentenceOpen}
                onClose={() => setIsSentenceOpen(false)}
                onNext={handleSentenceNext}
                penaltyText={currentPenalty}
            />

            {/* Abandon Confirmation Overlay */}
            <AbandonOverlay
                isOpen={isAbandonConfirmOpen}
                onCancel={cancelAbandon}
                onConfirm={confirmAbandon}
            />
        </div>
    )
}
