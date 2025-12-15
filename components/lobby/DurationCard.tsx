import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock } from 'lucide-react'
import { GameSession } from '@/lib/types'

interface DurationCardProps {
  roundsTotal: number
  isProgressiveMode: boolean
  session: GameSession | null
  timeEst: { min: number; max: number }
  playerCount: number
  onUpdate: (rounds: number, progressive: boolean) => void
}

export default function DurationCard({
  roundsTotal,
  isProgressiveMode,
  timeEst,
  playerCount,
  onUpdate,
}: DurationCardProps) {
  return (
    <Card className="bg-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" /> Durée de la Partie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre de Tours</Label>
          <Select
            value={roundsTotal.toString()}
            onValueChange={(v) => onUpdate(parseInt(v), isProgressiveMode)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 Tours (Rapide)</SelectItem>
              <SelectItem value="6">6 Tours (Standard)</SelectItem>
              <SelectItem value="8">8 Tours (Long)</SelectItem>
              <SelectItem value="10">10 Tours (Marathon)</SelectItem>
            </SelectContent>
          </Select>
          {playerCount > 0 && (
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" /> Estimation : {timeEst.min} -{' '}
              {timeEst.max} min
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
