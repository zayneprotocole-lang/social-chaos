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
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useSessionPlayers } from '@/lib/queries/historyQueries'
import type { SessionDocument, SessionPlayerDocument } from '@/types'
import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'

interface HistoryCardProps {
  game: SessionDocument
}

export function HistoryCard({ game }: HistoryCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Fetch players when the component mounts.
  const { data: players, isLoading } = useSessionPlayers(game.id)

  const formatDate = (dateOrTimestamp: Date | Timestamp | null | undefined) => {
    if (!dateOrTimestamp) return 'Date inconnue'
    // Check if it has toDate method (Firestore Timestamp)
    const date =
      dateOrTimestamp instanceof Timestamp
        ? dateOrTimestamp.toDate()
        : (dateOrTimestamp as Date)
    return format(date, 'dd MMM yyyy HH:mm', { locale: fr })
  }

  return (
    <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Calendar className="text-primary h-4 w-4" />
            {formatDate(game.playedAt || game.endedAt)}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {game.difficultyLabel || 'Inconnu'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rounds Played */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {game.roundsPlayed || game.roundsCompleted} Tours
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {players ? (
              players.length
            ) : (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}{' '}
            Joueurs
          </div>
        </div>

        {/* Winner - Le GOAT */}
        {game.winnerName && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
            <Trophy className="h-5 w-5 flex-shrink-0 text-yellow-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-yellow-500/80 uppercase">
                Le GOAT 🐐
              </p>
              <p className="truncate font-bold text-yellow-500">
                {game.winnerName}
              </p>
            </div>
          </div>
        )}

        {/* Loser - La Chèvre */}
        {game.loserName && game.winnerName !== game.loserName && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <Skull className="h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-red-500/80 uppercase">
                La Chèvre 🐐
              </p>
              <p className="truncate font-bold text-red-500">
                {game.loserName}
              </p>
            </div>
          </div>
        )}

        {/* Other Players - Collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="text-muted-foreground flex w-full items-center justify-between rounded p-2 text-sm transition-colors hover:bg-white/5">
            <span>Voir tous les joueurs</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1">
            {isLoading || !players || players.length === 0 ? (
              <div className="flex justify-center py-2">
                <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
              </div>
            ) : (
              players.map((player: SessionPlayerDocument, index: number) => (
                <div
                  key={player.id || index}
                  className="flex items-center justify-between rounded bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="font-medium">
                    #{index + 1} {player.name}
                  </span>
                  <span className="text-muted-foreground">
                    {player.score} pts
                  </span>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
