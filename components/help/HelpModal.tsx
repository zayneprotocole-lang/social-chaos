'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  HelpCircle,
  X,
  FileText,
  BookOpen,
  Sparkles,
  Zap,
  RefreshCw,
  ArrowLeftRight,
  Handshake,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'changelog' | 'rules'

// ========================================
// CHANGELOG DATA
// ========================================

const CHANGELOG = [
  {
    version: '1.2.0',
    date: '12 Décembre 2024',
    current: true,
    changes: [
      'Système Mentor/Élève avec action Accompagnement',
      'Mode Progressif adaptatif à toutes les durées',
      'Écran de chargement avec animation',
      "Système de bulles d'aide (tips)",
      'Bouton Premium et boutique',
    ],
  },
  {
    version: '1.1.0',
    date: '5 Décembre 2024',
    changes: [
      'Gestion des invités temporaires',
      'Sauvegarde et reprise de partie',
      'Préférences de catégories par joueur',
      'Historique des parties',
    ],
  },
  {
    version: '1.0.0',
    date: '1 Décembre 2024',
    changes: [
      'Lancement initial de Social Chaos',
      '4 niveaux de difficulté',
      'Actions Joker, Re-roll, Swap',
      'Mode Solo et Multijoueurs',
    ],
  },
]

// ========================================
// RULES DATA
// ========================================

const RULES_SECTIONS = [
  {
    title: '🎯 Concept',
    content:
      'Social Chaos est un jeu de gages en groupe. Chaque joueur doit réaliser des défis pour gagner des points. Le joueur avec le plus de points devient le GOAT, celui avec le moins devient la Chèvre.',
  },
  {
    title: '🎮 Déroulement',
    content:
      "À tour de rôle, chaque joueur tire une carte de gage. Il a un temps limité (selon la difficulté) pour réaliser le défi. S'il réussit, il gagne des points. S'il abandonne, il reçoit une sentence et perd des points.",
  },
  {
    title: '🃏 Actions',
    items: [
      {
        icon: Sparkles,
        name: 'Joker',
        desc: 'Passe le gage sans pénalité (1 par partie)',
      },
      {
        icon: RefreshCw,
        name: 'Re-roll',
        desc: 'Tire une nouvelle carte (1 par partie)',
      },
      {
        icon: ArrowLeftRight,
        name: 'Swap',
        desc: 'Échange le gage avec un autre joueur (1 par partie)',
      },
      {
        icon: Handshake,
        name: 'Accompagnement',
        desc: 'Réalise le défi en duo avec ton partenaire Mentor/Élève',
      },
    ],
  },
  {
    title: '🎚️ Difficultés',
    items: [
      { icon: Zap, name: 'Soft', desc: 'Pas de timer, gages faciles' },
      { icon: Zap, name: 'Spicy', desc: 'Timer 90s, gages pimentés' },
      { icon: Zap, name: 'Intense', desc: 'Timer 60s, gages corsés' },
      { icon: Zap, name: 'Apocalypse', desc: 'Timer 45s, gages extrêmes' },
    ],
  },
  {
    title: '🏆 Fin de partie',
    content:
      "À la fin de tous les tours, les scores sont comptés. Le GOAT (gagnant) devient le Mentor de la Chèvre (perdant). Ce lien spécial leur donne accès à l'action Accompagnement pour leur prochaine partie ensemble.",
  },
]

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('rules')

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-gray-900/95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <HelpCircle className="text-primary mx-auto h-10 w-10" />
            <h2 className="mt-2 text-xl font-bold text-white">
              Aide & Informations
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 pb-2">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('rules')}
              className={cn(
                'flex-1 gap-2',
                activeTab === 'rules'
                  ? 'bg-primary/20 text-primary border-primary/50'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <BookOpen className="h-4 w-4" />
              Règles
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('changelog')}
              className={cn(
                'flex-1 gap-2',
                activeTab === 'changelog'
                  ? 'bg-primary/20 text-primary border-primary/50'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <FileText className="h-4 w-4" />
              Mises à jour
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="h-[400px] px-4 pb-6">
            <AnimatePresence mode="wait">
              {activeTab === 'changelog' && (
                <motion.div
                  key="changelog"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {CHANGELOG.map((release) => (
                    <div
                      key={release.version}
                      className={cn(
                        'rounded-lg border p-3',
                        release.current
                          ? 'bg-primary/10 border-primary/30'
                          : 'border-white/10 bg-white/5'
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={cn(
                            'font-bold',
                            release.current ? 'text-primary' : 'text-white'
                          )}
                        >
                          v{release.version}
                          {release.current && (
                            <span className="bg-primary/20 ml-2 rounded px-2 py-0.5 text-xs">
                              Actuelle
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-white/40">
                          {release.date}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {release.changes.map((change, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-white/70"
                          >
                            <span className="text-primary mt-1">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'rules' && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {RULES_SECTIONS.map((section) => (
                    <div
                      key={section.title}
                      className="rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <h3 className="mb-2 font-bold text-white">
                        {section.title}
                      </h3>
                      {section.content && (
                        <p className="text-sm text-white/70">
                          {section.content}
                        </p>
                      )}
                      {section.items && (
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-start gap-2"
                            >
                              <item.icon className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-medium text-white">
                                  {item.name}
                                </span>
                                <span className="ml-2 text-sm text-white/60">
                                  {item.desc}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

interface HelpButtonProps {
  onClick: () => void
  className?: string
}

/**
 * Help button for the home page
 * Simple icon button
 */
export function HelpButton({ onClick, className }: HelpButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="icon"
      className={cn(
        'bg-background/80 border-white/20 backdrop-blur-sm',
        'hover:border-primary/50 hover:bg-primary/10',
        'hover:text-primary text-white/60',
        className
      )}
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  )
}
