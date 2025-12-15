'use client'

import { useEffect, useState, useMemo } from 'react'
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
import { useMentorEleveStore } from '@/lib/store/useMentorEleveStore'

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
const AccompagnementModal = dynamic(() =>
  import('@/components/game/AccompagnementModal').then((m) => ({
    default: m.AccompagnementModal,
  }))
)

export default function GamePage() {
  const params = useParams()
  const {
    session,
    currentPlayer,
    isGameFinished,
    MOCK_DARES,
    isLoading,
    isFetching,
  } = useGameSession(params.id as string)

  const {
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
    handleTogglePause,
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

  // Accompagnement state
  const [isAccompagnementModalOpen, setIsAccompagnementModalOpen] =
    useState(false)
  const [accompagnementUsedThisGame, setAccompagnementUsedThisGame] =
    useState(false)
  const [isAccompagnementActive, setIsAccompagnementActive] = useState(false)
  const [accompagnateurName, setAccompagnateurName] = useState<string | null>(
    null
  )
  const [isTimerPausedForAccompagnement, setIsTimerPausedForAccompagnement] =
    useState(false)
  const [timerResetTrigger, setTimerResetTrigger] = useState(0) // Increment to force timer reset

  // Fallback time for when startedAt is not available (computed once via lazy initializer)
  const [fallbackTime] = useState(() => Date.now())

  const links = useMentorEleveStore((s) => s.links)
  const markAccompagnementUsed = useMentorEleveStore(
    (s) => s.markAccompagnementUsed
  )

  // Find active duo for current player
  // Only show links that existed BEFORE this game started (prevent mid-game bonus appearing)
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const accompagnementInfo = useMemo(() => {
    if (!currentPlayer?.profileId || !session?.players) return null

    // Get game start time (Firestore Timestamp or Date)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startedAt = session.startedAt as any
    const gameStartTime =
      startedAt instanceof Date
        ? startedAt.getTime()
        : startedAt?.toMillis?.() || fallbackTime

    for (const link of links) {
      // Skip consumed links or links created AFTER this game started
      if (link.isConsumed) continue
      if (link.createdAt > gameStartTime) continue

      const isMentor = link.mentorProfileId === currentPlayer.profileId
      const isEleve = link.eleveProfileId === currentPlayer.profileId

      if (isMentor || isEleve) {
        const partnerProfileId = isMentor
          ? link.eleveProfileId
          : link.mentorProfileId
        const partner = session.players.find(
          (p) => p.profileId === partnerProfileId
        )

        if (partner) {
          const alreadyUsed = isMentor
            ? link.mentorUsedAccompagnement
            : link.eleveUsedAccompagnement
          return {
            linkId: link.id,
            isMentor,
            partnerName: partner.name,
            used: alreadyUsed || accompagnementUsedThisGame,
          }
        }
      }
    }
    return null
  }, [
    currentPlayer?.profileId,
    session?.players,
    session?.startedAt,
    links,
    accompagnementUsedThisGame,
    fallbackTime,
  ])

  // Open modal and PAUSE timer
  const handleAccompagnement = () => {
    setIsTimerPausedForAccompagnement(true)
    setIsAccompagnementModalOpen(true)
  }

  // Close modal WITHOUT invoking - RESUME timer
  const handleCloseAccompagnement = () => {
    setIsAccompagnementModalOpen(false)
    setIsTimerPausedForAccompagnement(false)
    // Timer continues from where it was
  }

  // Invoke - RESET timer, mark action used, grey out other actions
  const handleInvokeAccompagnement = () => {
    if (accompagnementInfo) {
      markAccompagnementUsed(
        accompagnementInfo.linkId,
        accompagnementInfo.isMentor
      )
      setAccompagnementUsedThisGame(true)
      setIsAccompagnementActive(true)
      setAccompagnateurName(accompagnementInfo.partnerName)
    }
    setIsAccompagnementModalOpen(false)
    setIsTimerPausedForAccompagnement(false)
    // Trigger timer reset by incrementing the reset trigger
    setTimerResetTrigger((prev) => prev + 1)
  }

  // Reset accompagnement active state on turn change
  useEffect(() => {
    setIsAccompagnementActive(false)
    setAccompagnateurName(null)
    setAccompagnementUsedThisGame(false)
    setIsTimerPausedForAccompagnement(false)
  }, [session?.currentTurnPlayerId])

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
        <OptionsMenu
          players={session.players}
          currentTurnPlayerId={session.currentTurnPlayerId}
          onTogglePause={handleTogglePause}
          session={session}
        />
      </div>

      {/* Game Sidebar - Replaces GameProgress, PlayerList, and TurnIndicator */}
      <GameSidebar
        session={session}
        isSwapping={isSwapping}
        onPlayerClick={handlePlayerClick}
        swapUsedByPlayerIds={session.swapUsedByPlayerIds}
      />

      {/* Main Game Area - Adjusted padding for desktop sidebar */}
      <div className="relative flex flex-1 flex-col items-center justify-center space-y-6 p-4 pb-48 md:pr-72 md:pb-4">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Timer - Only visible after card is revealed (for difficulty >= 2) */}
        {isCardRevealed && (
          <div className="relative z-10 w-full max-w-md">
            {/* Abandon/Passer button - Always visible when playing */}
            {gameStatus === 'PLAYING' && controlStep === 'ACTION' && (
              <Button
                onClick={handleAbandon}
                variant={
                  (session?.settings.difficulty || 1) === 1
                    ? 'outline'
                    : 'destructive'
                }
                size="sm"
                className={cn(
                  'absolute -top-12 right-0 px-3 py-1 text-xs',
                  (session?.settings.difficulty || 1) === 1
                    ? 'border-white/30 hover:border-white/50'
                    : 'shadow-[0_0_10px_var(--destructive)]'
                )}
              >
                <Skull className="mr-1 h-3 w-3" />
                {(session?.settings.difficulty || 1) === 1
                  ? 'PASSER'
                  : 'ABANDON'}
              </Button>
            )}
            {/* Timer only for difficulty >= 2 */}
            {(session?.settings.difficulty || 1) >= 2 && (
              <GameTimer
                key={`${session.turnCounter}-${timerResetTrigger}`} // Force remount on turn change or invoke
                duration={session.settings.timerDuration}
                isActive={
                  isTimerActive && !isOnGoing && !isTimerPausedForAccompagnement
                }
                onComplete={handleTimerComplete}
                isGolden={isOnGoing}
              />
            )}
          </div>
        )}

        {/* Current Player Indicator */}
        {session.currentDare && (
          <div className="z-30 mb-4 text-center">
            <p className="text-lg font-bold text-white/90">
              <span className="text-primary text-xl">{currentPlayer.name}</span>
            </p>
            <p className="animate-pulse text-sm text-white/60">
              à toi de jouer !
            </p>
          </div>
        )}

        {/* The Card */}
        <div className="perspective-1000 relative z-20 w-full">
          {session.currentDare && (
            <DareCard dare={session.currentDare} isVisible={isCardRevealed} />
          )}

          {/* Accompagnement Active Indicator */}
          {isAccompagnementActive && accompagnateurName && (
            <div className="mt-4 flex animate-pulse items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-400">
              <span className="text-xl">🤝</span>
              <span className="font-bold">
                Accompagné par {accompagnateurName}
              </span>
            </div>
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
            accompagnementAvailable={!!accompagnementInfo}
            accompagnementUsed={accompagnementInfo?.used}
            accompagnementTargetName={accompagnementInfo?.partnerName}
            onAccompagnement={handleAccompagnement}
            actionsDisabled={
              isAccompagnementModalOpen || isAccompagnementActive
            }
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

      {/* Accompagnement Modal */}
      {accompagnementInfo && (
        <AccompagnementModal
          isOpen={isAccompagnementModalOpen}
          onClose={handleCloseAccompagnement}
          onInvoke={handleInvokeAccompagnement}
          targetName={accompagnementInfo.partnerName}
        />
      )}
    </motion.div>
  )
}
