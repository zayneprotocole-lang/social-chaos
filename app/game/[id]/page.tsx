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

    // Get game start time (can be Date, Timestamp, or undefined)
    const startedAt = session.startedAt
    let gameStartTime: number
    if (startedAt instanceof Date) {
      gameStartTime = startedAt.getTime()
    } else if (
      startedAt &&
      typeof startedAt === 'object' &&
      'toMillis' in startedAt
    ) {
      // Firestore Timestamp
      gameStartTime = (startedAt as { toMillis: () => number }).toMillis()
    } else {
      gameStartTime = fallbackTime
    }

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
        'flex h-screen flex-col overflow-hidden bg-gradient-to-b px-3 py-2 transition-colors duration-1000 min-[390px]:px-4 min-[390px]:py-3 min-[430px]:py-4',
        getBackgroundClass()
      )}
    >
      {/* Background Image */}
      <div className="pointer-events-none fixed inset-0 bg-[url('/game-background.png')] bg-cover bg-center opacity-30" />

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 bg-[url('/grid.svg')] opacity-5" />

      {/* Decorative Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Purple orb - top left */}
        <motion.div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Cyan orb - bottom right */}
        <motion.div
          className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        {/* Pink orb - center right */}
        <motion.div
          className="absolute top-1/2 -right-16 h-64 w-64 -translate-y-1/2 rounded-full bg-pink-500/15 blur-3xl"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </div>

      {/* 1. Zone joueurs + manche - HAUT */}
      <div className="relative z-10 flex-none">
        <GameSidebar
          session={session}
          layout="horizontal"
          isSwapping={isSwapping}
          onPlayerClick={handlePlayerClick}
          swapUsedByPlayerIds={session.swapUsedByPlayerIds}
        />
      </div>

      {/* 2. Timer - Sous les joueurs */}
      {isCardRevealed && (session?.settings.difficulty || 1) >= 2 && (
        <div className="relative z-30 mt-1 flex-none">
          <GameTimer
            key={`${session.turnCounter}-${timerResetTrigger}`}
            duration={session.settings.timerDuration}
            isActive={
              isTimerActive && !isOnGoing && !isTimerPausedForAccompagnement
            }
            onComplete={handleTimerComplete}
            isGolden={isOnGoing}
          />
        </div>
      )}

      {/* 3. Zone centrale - PREND L'ESPACE RESTANT */}
      <div className="relative z-20 flex min-h-0 flex-1 flex-col items-center justify-center">
        {/* Deck de cartes */}
        <div className="deck-container w-full max-w-xs">
          {session.currentDare && (
            <DareCard dare={session.currentDare} isVisible={isCardRevealed} />
          )}

          {/* Accompagnement Active Indicator */}
          {isAccompagnementActive && accompagnateurName && (
            <div className="mt-2 flex animate-pulse items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-1.5 text-xs text-indigo-400">
              <span>🤝</span>
              <span className="font-bold">
                Accompagné par {accompagnateurName}
              </span>
            </div>
          )}
        </div>

        {/* Start Button (Draw Card) - IDLE state */}
        {gameStatus === 'IDLE' && (
          <Button
            onClick={startTurn}
            className="z-30 mt-3 w-full max-w-xs animate-bounce py-5 text-lg font-black shadow-[0_0_30px_var(--primary)]"
          >
            TIRER UNE CARTE <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* 4. Zone de contrôle - FIXE EN BAS */}
      {gameStatus === 'PLAYING' && controlStep === 'ACTION' && (
        <div className="relative z-30 flex-none space-y-1.5 pb-1">
          {/* Boutons validation - EN COURS + DÉFI VALIDÉ */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => setIsOnGoing(!isOnGoing)}
              variant={isOnGoing ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-10 rounded-xl px-4 text-xs font-semibold transition-all min-[390px]:h-11 min-[390px]:px-5 min-[390px]:text-sm min-[430px]:h-12 min-[430px]:px-6',
                isOnGoing
                  ? 'border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              )}
            >
              ⏳ EN COURS
            </Button>
            <Button
              onClick={() => handleValidateChallenge(currentPlayer.id)}
              className="h-10 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500 px-5 text-xs font-bold text-white shadow-lg shadow-purple-500/40 transition-all hover:scale-105 hover:shadow-purple-500/60 min-[390px]:h-11 min-[390px]:px-6 min-[390px]:text-sm min-[430px]:h-12 min-[430px]:px-8"
            >
              ✓ DÉFI VALIDÉ
            </Button>
          </div>

          {/* Ligne secondaire : Abandon + Options */}
          <div className="mt-1 flex items-center justify-center gap-4">
            <button
              onClick={handleAbandon}
              className={cn(
                'flex h-9 items-center gap-1.5 rounded-lg px-3 min-[390px]:h-10 min-[390px]:px-4',
                'text-xs font-medium transition-all min-[390px]:text-sm',
                'border border-red-500/30 bg-red-500/10 text-red-400',
                'hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300'
              )}
            >
              <Skull className="h-3.5 w-3.5 min-[390px]:h-4 min-[390px]:w-4" />
              <span>Abandon</span>
            </button>
            <OptionsMenu
              players={session.players}
              currentTurnPlayerId={session.currentTurnPlayerId}
              onTogglePause={handleTogglePause}
              session={session}
            />
          </div>

          {/* Éventail d'actions */}
          <ActionDock
            layout="fan"
            currentPlayer={currentPlayer}
            onJoker={handleJoker}
            onReroll={handleReroll}
            onSwap={handleSwap}
            accompagnementAvailable={!!accompagnementInfo}
            accompagnementUsed={accompagnementInfo?.used}
            onAccompagnement={handleAccompagnement}
            actionsDisabled={
              isAccompagnementModalOpen || isAccompagnementActive
            }
          />
        </div>
      )}

      {/* Popups et Overlays */}
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

      <AbandonOverlay
        isOpen={isAbandonConfirmOpen}
        onCancel={cancelAbandon}
        onConfirm={confirmAbandon}
        penaltyText={currentPenalty}
      />

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
