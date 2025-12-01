import { Player } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TurnIndicatorProps {
    currentPlayer: Player
}

export default function TurnIndicator({ currentPlayer }: TurnIndicatorProps) {
    return (
        <div className="flex items-center gap-3 z-10">
            <Avatar className="h-12 w-12 border-2 border-primary ring-2 ring-primary/20 shadow-[0_0_15px_var(--primary)]">
                <AvatarImage src={currentPlayer.avatar} />
                <AvatarFallback>{currentPlayer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">C'est le tour de</p>
                <p className="font-black text-2xl leading-none text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    {currentPlayer.name}
                </p>
            </div>
        </div>
    )
}
