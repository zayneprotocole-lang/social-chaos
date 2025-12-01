import { getGameHistory } from '@/app/actions/game'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, Calendar, Clock, Users, ChevronDown } from 'lucide-react'
import { Skull } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
    const history = await getGameHistory()

    return (
        <div className="min-h-screen p-4 pb-24 space-y-6 bg-background">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    HISTORIQUE
                </h1>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {history.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>Aucune partie terminée pour le moment.</p>
                    </div>
                ) : (
                    history.map((game: any) => {
                        return (
                            <Card key={game.id} className="bg-card/50 border-primary/20 hover:border-primary/50 transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            {game.playedAt || game.endedAt ? format(new Date(game.playedAt || game.endedAt), 'dd MMM yyyy HH:mm', { locale: fr }) : 'Date inconnue'}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-xs">
                                            {game.difficultyLabel || 'Inconnu'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Rounds Played */}
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {game.roundsPlayed || game.roundsCompleted} Tours
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {game.players.length} Joueurs
                                        </div>
                                    </div>

                                    {/* Winner - Le GOAT */}
                                    {game.winnerName && (
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-3">
                                            <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-yellow-500/80 font-bold uppercase">Le GOAT 🐐</p>
                                                <p className="font-bold text-yellow-500 truncate">{game.winnerName}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Loser - La Chèvre */}
                                    {game.loserName && game.winnerName !== game.loserName && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3">
                                            <Skull className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-red-500/80 font-bold uppercase">La Chèvre 🐐</p>
                                                <p className="font-bold text-red-500 truncate">{game.loserName}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Players - Collapsible */}
                                    {game.players.length > 2 && (
                                        <Collapsible>
                                            <CollapsibleTrigger className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors text-sm text-muted-foreground">
                                                <span>Voir tous les joueurs ({game.players.length})</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="mt-2 space-y-1">
                                                {game.players.map((player: any, index: number) => (
                                                    <div key={player.id} className="flex items-center justify-between px-3 py-2 rounded bg-white/5 text-xs">
                                                        <span className="font-medium">#{index + 1} {player.name}</span>
                                                        <span className="text-muted-foreground">{player.score} pts</span>
                                                    </div>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
