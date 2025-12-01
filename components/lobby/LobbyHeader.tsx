import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LobbyHeader() {
    const router = useRouter()

    return (
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/')}
                    className="text-primary hover:text-primary/80"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    LOBBY
                </h1>
            </div>
            <Badge variant="outline" className="text-xs border-primary/50 opacity-50">
                Session Locale
            </Badge>
        </header>
    )
}
