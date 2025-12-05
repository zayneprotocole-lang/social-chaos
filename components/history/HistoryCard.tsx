'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  ChevronDown,
  Skull,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { LocalHistoryItem } from '@/types/history'
import { useState } from 'react'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'

interface HistoryCardProps {
  game: LocalHistoryItem
}

export function HistoryCard({ game }: HistoryCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd MMM yyyy HH:mm', { locale: fr })
  }

  const difficultyLabel = DIFFICULTY_CONFIG[game.difficulty]?.name || 'Inconnu'

  // Calculate total players
  const totalPlayers = 2 + (game.otherPlayers?.length || 0)

  return (
    <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Calendar className="text-primary h-4 w-4" />
            {formatDate(game.playedAt)}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {difficultyLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rounds Played */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {game.totalRounds} Tours
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {totalPlayers} Joueurs
          </div>
        </div>

        {/* Winner - Le GOAT */}
        {game.winner && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
            <Trophy className="h-5 w-5 flex-shrink-0 text-yellow-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-yellow-500/80 uppercase">
                Le GOAT 🐐
              </p>
              <p className="truncate font-bold text-yellow-500">
                {game.winner.name}
              </p>
              <p className="text-xs text-yellow-500/60">
                {game.winner.score} pts
              </p>
            </div>
          </div>
        )}

        {/* Loser - La Chèvre */}
        {game.loser && game.winner?.id !== game.loser?.id && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <Skull className="h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-red-500/80 uppercase">
                La Chèvre 🐐
              </p>
              <p className="truncate font-bold text-red-500">
                {game.loser.name}
              </p>
              <p className="text-xs text-red-500/60">
                {game.loser.score} pts
              </p>
            </div>
          </div>
        )}

        {/* Other Players - Collapsible */}
        {game.otherPlayers && game.otherPlayers.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="text-muted-foreground flex w-full items-center justify-between rounded p-2 text-sm transition-colors hover:bg-white/5">
              <span>Voir les autres joueurs ({game.otherPlayers.length})</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {game.otherPlayers.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="font-medium">
                    #{index + 3} {player.name}
                  </span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Categories */}
        {game.categories && game.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
