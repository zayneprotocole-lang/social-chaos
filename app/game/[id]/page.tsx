'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import DareCard from '@/components/game/DareCard'
import GameTimer from '@/components/game/GameTimer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Skull } from 'lucide-react'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'
import { cn } from '@/lib/utils'
import { useGameSession } from '@/hooks/useGameSession'
import { useGameFlow } from '@/hooks/useGameFlow'
import { useGameActions } from '@/hooks/useGameActions'

// New UI Components
import GameProgress from '@/components/game/GameProgress'
import PlayerListVertical from '@/components/game/PlayerListVertical'
import TurnIndicator from '@/components/game/TurnIndicator'
import ActionDock from '@/components/game/ActionDock'

// Lazy-loaded components (non-critical for initial render)
const SentencePopup = dynamic(() => import('@/components/game/SentencePopup'))
const GameEndScreen = dynamic(() => import('@/components/game/GameEndScreen'))
const OptionsMenu = dynamic(() => import('@/components/game/OptionsMenu'))
const AbandonOverlay = dynamic(() => import('@/components/game/AbandonOverlay'))

export default function GamePage() {
  const params = useParams()
  const { session, currentPlayer, isMyTurn, isGameFinished, MOCK_DARES } =
    useGameSession(params.id as string)

  const {
    isCardVisible,
    gameStatus,
    controlStep,
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
    handleSentenceNext,
  } = useGameFlow(session ?? null, MOCK_DARES)

  const {
    isSwapping,
    handlePlayerClick,
    handleJoker,
    handleReroll,
    handleSwap,
  } = useGameActions(
    session?.id,
    currentPlayer,
    session?.currentDare,
    MOCK_DARES,
    handleNextTurn
  )

  // Determine background based on difficulty (Apocalypse is now Violet)
  const getBackgroundClass = () => {
    const diff = session?.settings.difficulty || 1
    return DIFFICULTY_CONFIG[diff].backgroundClass
  }

  if (!session || !currentPlayer)
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Chargement...
      </div>
    )

  if (isGameFinished) {
    return <GameEndScreen players={session.players} />
  }

  return (
    <div
      className={cn(
        'pb-safe flex min-h-screen flex-col bg-gradient-to-b transition-colors duration-1000',
        getBackgroundClass()
      )}
    >
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
      <div className="relative flex flex-1 flex-col items-center justify-center space-y-6 p-4 pr-56">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Turn Indicator - Above Card */}
        <TurnIndicator currentPlayer={currentPlayer} />

        {/* Timer */}
        <div className="relative z-10 w-full max-w-md">
          {/* Abandon button moved next to timer */}
          {gameStatus === 'PLAYING' &&
            controlStep === 'ACTION' &&
            (session?.settings.difficulty || 1) >= 2 && (
              <Button
                onClick={handleAbandon}
                variant="destructive"
                size="sm"
                className="absolute -top-12 right-0 px-3 py-1 text-xs shadow-[0_0_10px_var(--destructive)]"
              >
                <Skull className="mr-1 h-3 w-3" />
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
        <div className="perspective-1000 relative z-20 w-full">
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
            className="z-30 w-full max-w-xs animate-bounce py-8 text-2xl font-black shadow-[0_0_30px_var(--primary)]"
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
