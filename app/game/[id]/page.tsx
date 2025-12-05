'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
import GameSidebar from '@/components/game/GameSidebar'
import ActionDock from '@/components/game/ActionDock'
import GameSkeleton from '@/components/game/GameSkeleton'

// Lazy-loaded components (non-critical for initial render)
const SentencePopup = dynamic(() => import('@/components/game/SentencePopup'))
const GameEndScreen = dynamic(() => import('@/components/game/GameEndScreen'))
const OptionsMenu = dynamic(() => import('@/components/game/OptionsMenu'))
const AbandonOverlay = dynamic(() => import('@/components/game/AbandonOverlay'))
const SuccessPopup = dynamic(() => import('@/components/game/SuccessPopup'))

export default function GamePage() {
  const params = useParams()
  const { session, currentPlayer, isGameFinished, MOCK_DARES, isLoading, isFetching } =
    useGameSession(params.id as string)

  const {
    isCardVisible,
    isCardRevealed,
    gameStatus,
    controlStep,
    isSentenceOpen,
    setIsSentenceOpen,
    currentPenalty,
    isAbandonConfirmOpen,
    isTimerActive,
    isOnGoing,
    setIsOnGoing,
    isSuccessPopupOpen,
    handleSuccessPopupComplete,
    isLocalGameFinished,
    startTurn,
    handleTimerComplete,
    finishTurnAndAdvance,
    handleValidateChallenge,
    handleAbandon,
    confirmAbandon,
    cancelAbandon,
    handleSentenceNext,
    handleFastTurnTransition,
  } = useGameFlow(session ?? null, MOCK_DARES)

  const {
    isSwapping,
    setIsSwapping,
    handlePlayerClick,
    handleJoker,
    handleReroll,
    handleSwap,
  } = useGameActions(
    session?.id,
    currentPlayer,
    session?.players, // Pass players list for swap logic
    session?.currentDare,
    session?.swapUsedByPlayerIds, // V9.4: Pass all players who used swap to prevent revenge swap
    MOCK_DARES,
    finishTurnAndAdvance,
    handleFastTurnTransition
  )

  // Reset swap state when dare changes (new turn)
  useEffect(() => {
    setIsSwapping(false)
  }, [session?.currentDare?.id, setIsSwapping])

  // Determine background based on difficulty (Apocalypse is now Violet)
  const getBackgroundClass = () => {
    const diff = session?.settings.difficulty || 1
    return DIFFICULTY_CONFIG[diff].backgroundClass
  }

  // Task 7.3: Instant Shell Interface - Show skeleton while loading
  // Task 8.1: Check isLoading and isFetching for accurate loading state
  if (isLoading || isFetching || !session || !currentPlayer) {
    return <GameSkeleton />
  }

  // Check both local state (immediate) and Firestore state (synced)
  if (isGameFinished || isLocalGameFinished) {
    console.log('🏁 Showing GameEndScreen:', { isGameFinished, isLocalGameFinished })
    return <GameEndScreen players={session.players} session={session} />
  }

  // Task 7.3: Smooth Transition Animation - Fade in content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'pb-safe flex min-h-screen flex-col bg-gradient-to-b transition-colors duration-1000',
        getBackgroundClass()
      )}
    >
      {/* Options Menu - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <OptionsMenu />
      </div>

      {/* Game Sidebar - Replaces GameProgress, PlayerList, and TurnIndicator */}
      <GameSidebar
        session={session}
        isSwapping={isSwapping}
        onPlayerClick={handlePlayerClick}
        swapUsedByPlayerIds={session.swapUsedByPlayerIds}
      />

      {/* Main Game Area - Adjusted padding for desktop sidebar */}
      <div className="relative flex flex-1 flex-col items-center justify-center space-y-6 p-4 md:pr-72 pb-48 md:pb-4">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Timer - Only visible after card is revealed (for difficulty >= 2) */}
        {isCardRevealed && (
          <div className="relative z-10 w-full max-w-md">
            {/* Abandon/Passer button - Always visible when playing */}
            {gameStatus === 'PLAYING' && controlStep === 'ACTION' && (
              <Button
                onClick={handleAbandon}
                variant={(session?.settings.difficulty || 1) === 1 ? "outline" : "destructive"}
                size="sm"
                className={cn(
                  "absolute -top-12 right-0 px-3 py-1 text-xs",
                  (session?.settings.difficulty || 1) === 1
                    ? "border-white/30 hover:border-white/50"
                    : "shadow-[0_0_10px_var(--destructive)]"
                )}
              >
                <Skull className="mr-1 h-3 w-3" />
                {(session?.settings.difficulty || 1) === 1 ? 'PASSER' : 'ABANDON'}
              </Button>
            )}
            {/* Timer only for difficulty >= 2 */}
            {(session?.settings.difficulty || 1) >= 2 && (
              <GameTimer
                key={session.turnCounter} // V9.3: Force remount on every turn
                duration={session.settings.timerDuration}
                isActive={isTimerActive && !isOnGoing}
                onComplete={handleTimerComplete}
                isGolden={isOnGoing}
              />
            )}
          </div>
        )}

        {/* Current Player Indicator */}
        {session.currentDare && (
          <div className="text-center mb-4 z-30">
            <p className="text-lg font-bold text-white/90">
              <span className="text-primary text-xl">{currentPlayer.name}</span>
            </p>
            <p className="text-sm text-white/60 animate-pulse">à toi de jouer !</p>
          </div>
        )}

        {/* The Card */}
        <div className="perspective-1000 relative z-20 w-full">
          {session.currentDare && (
            <DareCard dare={session.currentDare} isVisible={isCardRevealed} />
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

      <SuccessPopup
        isOpen={isSuccessPopupOpen}
        playerName={currentPlayer?.name}
        onAnimationComplete={handleSuccessPopupComplete}
      />

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
        penaltyText={currentPenalty}
      />
    </motion.div>
  )
}
