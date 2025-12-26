'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@/lib/types'
import { Sparkles, RefreshCw, ArrowLeftRight, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// Color configuration for each action type with RGB values for animated glow
const ACTION_COLORS = {
  green: {
    bg: 'bg-green-500/20',
    border: 'border-green-500',
    text: 'text-green-400',
    glowRgb: '34, 197, 94',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    glowRgb: '6, 182, 212',
  },
  orange: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500',
    text: 'text-orange-400',
    glowRgb: '249, 115, 22',
  },
  indigo: {
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500',
    text: 'text-indigo-400',
    glowRgb: '99, 102, 241',
  },
} as const

type ColorKey = keyof typeof ACTION_COLORS

// Symboles de coin pour chaque couleur
const CORNER_SYMBOLS = {
  green: '✦',
  cyan: '↻',
  orange: '⇄',
  indigo: '♦',
} as const

/**
 * Calcule la rotation pour une carte dans un éventail
 * @param index Position de la carte (0-based)
 * @param total Nombre total de cartes
 * @returns Angle de rotation en degrés
 */
const getFanRotation = (index: number, total: number): number => {
  if (total <= 1) return 0
  // Spread de 24° total (-12° à +12°)
  const spread = 24
  const step = spread / (total - 1)
  return -spread / 2 + step * index
}

interface ActionCardProps {
  icon: React.ReactNode
  label: string
  count: number
  color: ColorKey
  disabled: boolean
  selected: boolean
  onClick: () => void
  // Props pour l'éventail
  index: number
  total: number
  isFanLayout: boolean
}

const ActionCard = ({
  icon,
  label,
  count,
  color,
  disabled,
  selected,
  onClick,
  index,
  total,
  isFanLayout,
}: ActionCardProps) => {
  const colors = ACTION_COLORS[color]
  const rotation = isFanLayout ? getFanRotation(index, total) : 0
  const cornerSymbol = CORNER_SYMBOLS[color]

  // Box shadows pour les différents états
  const baseShadow = '0 10px 25px rgba(0, 0, 0, 0.3)'
  const hoverGlow = `0 0 25px rgba(${colors.glowRgb}, 0.5), 0 0 50px rgba(${colors.glowRgb}, 0.3), ${baseShadow}`
  const selectedGlow = `0 0 35px rgba(${colors.glowRgb}, 0.7), 0 0 70px rgba(${colors.glowRgb}, 0.4), ${baseShadow}`

  return (
    <motion.button
      className={cn(
        // Taille carte responsive
        'relative h-20 w-14 rounded-xl min-[390px]:h-24 min-[390px]:w-16 min-[430px]:h-28 min-[430px]:w-20',
        // Structure
        'flex flex-col items-center justify-between p-1.5 min-[390px]:p-2',
        // Glassmorphism
        'border-2 backdrop-blur-md',
        colors.bg,
        colors.border,
        colors.text,
        // Transform origin en bas pour rotation naturelle
        'origin-bottom',
        // États
        disabled ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer'
      )}
      style={{
        marginLeft: isFanLayout && index > 0 ? '-12px' : '0',
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      initial={{
        opacity: 0,
        y: 30,
        rotate: rotation,
        boxShadow: baseShadow,
      }}
      animate={{
        opacity: 1,
        y: selected ? -30 : 0,
        scale: selected ? 1.15 : 1,
        rotate: rotation,
        zIndex: selected ? 20 : total - index,
        boxShadow: selected ? selectedGlow : baseShadow,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              y: -15,
              scale: 1.08,
              zIndex: 15,
              boxShadow: hoverGlow,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.95,
              boxShadow: baseShadow,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: index * 0.08,
      }}
    >
      {/* Coin supérieur gauche */}
      <div className="absolute top-1.5 left-1.5 flex flex-col items-center leading-none">
        <span className="text-[10px] font-bold">{count}</span>
        <span className="text-xs">{cornerSymbol}</span>
      </div>

      {/* Coin inférieur droit (inversé) */}
      <div className="absolute right-1.5 bottom-1.5 flex rotate-180 flex-col items-center leading-none">
        <span className="text-[10px] font-bold">{count}</span>
        <span className="text-xs">{cornerSymbol}</span>
      </div>

      {/* Icône centrale (grande) */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          className="text-2xl min-[390px]:text-3xl"
          animate={{
            scale: selected ? 1.2 : 1,
            filter: selected ? 'drop-shadow(0 0 8px currentColor)' : 'none',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Label en bas */}
      <span className="hidden text-[8px] font-bold tracking-wider uppercase opacity-90 min-[390px]:block min-[430px]:text-[9px]">
        {label}
      </span>

      {/* Effet de reflet/verre */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 via-transparent to-transparent" />

      {/* Bordure interne subtile */}
      <div className="pointer-events-none absolute inset-[1px] rounded-[10px] border border-white/10" />
    </motion.button>
  )
}

interface ActionDockProps {
  currentPlayer: Player
  layout?: 'default' | 'fan'
  onJoker: () => void
  onReroll: () => void
  onSwap: () => void
  // Accompagnement props
  accompagnementAvailable?: boolean
  accompagnementUsed?: boolean
  onAccompagnement?: () => void
  // Actions disabled when Accompagnement is invoked
  actionsDisabled?: boolean
}

const ActionDock = React.memo(
  ({
    currentPlayer,
    layout = 'default',
    onJoker,
    onReroll,
    onSwap,
    accompagnementAvailable = false,
    accompagnementUsed = false,
    onAccompagnement,
    actionsDisabled = false,
  }: ActionDockProps) => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null)

    const handleActionClick = (action: string, callback: () => void) => {
      if (actionsDisabled) return
      setSelectedAction(action)
      setTimeout(() => {
        callback()
        setSelectedAction(null)
      }, 300)
    }

    // Build list of available actions
    const actions = []

    if (currentPlayer.jokersLeft > 0) {
      actions.push({
        id: 'joker',
        icon: <Sparkles className="h-6 w-6" />,
        label: 'Joker',
        count: currentPlayer.jokersLeft,
        color: 'green' as ColorKey,
        onClick: () => handleActionClick('joker', onJoker),
      })
    }

    if (currentPlayer.rerollsLeft > 0) {
      actions.push({
        id: 'reroll',
        icon: <RefreshCw className="h-6 w-6" />,
        label: 'Reroll',
        count: currentPlayer.rerollsLeft,
        color: 'cyan' as ColorKey,
        onClick: () => handleActionClick('reroll', onReroll),
      })
    }

    if (currentPlayer.exchangeLeft > 0) {
      actions.push({
        id: 'swap',
        icon: <ArrowLeftRight className="h-6 w-6" />,
        label: 'Swap',
        count: currentPlayer.exchangeLeft,
        color: 'orange' as ColorKey,
        onClick: () => handleActionClick('swap', onSwap),
      })
    }

    if (accompagnementAvailable && !accompagnementUsed && onAccompagnement) {
      actions.push({
        id: 'duo',
        icon: <Users className="h-6 w-6" />,
        label: 'Duo',
        count: 1,
        color: 'indigo' as ColorKey,
        onClick: () => handleActionClick('duo', onAccompagnement),
      })
    }

    // If no actions available, don't render
    if (actions.length === 0) {
      return null
    }

    const isFanLayout = layout === 'fan'

    return (
      <div
        className={cn(
          'flex items-end justify-center py-2',
          isFanLayout && 'perspective-[800px]'
        )}
      >
        {actions.map((action, index) => (
          <ActionCard
            key={action.id}
            icon={action.icon}
            label={action.label}
            count={action.count}
            color={action.color}
            disabled={actionsDisabled}
            selected={selectedAction === action.id}
            onClick={action.onClick}
            index={index}
            total={actions.length}
            isFanLayout={isFanLayout}
          />
        ))}
      </div>
    )
  }
)

ActionDock.displayName = 'ActionDock'
export default ActionDock
