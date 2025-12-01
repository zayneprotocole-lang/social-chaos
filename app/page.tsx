'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, Users, Skull, BookHeart, Clock } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')

  const createRoom = () => {
    // Generate a random 4-letter code
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    router.push(`/lobby/${code}?host=true`)
  }

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.length >= 3) {
      router.push(`/lobby/${roomCode.toUpperCase()}`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground overflow-hidden relative">
      {/* Library Button - Top Left */}
      <Button
        onClick={() => router.push('/library')}
        variant="outline"
        className="fixed top-4 left-4 z-50 border-primary/30 hover:border-primary bg-background/80 backdrop-blur-sm"
      >
        <BookHeart className="mr-2 h-4 w-4" />
        Bibliothèque
      </Button>

      {/* History Button - Top Right */}
      <Button
        onClick={() => router.push('/history')}
        variant="outline"
        className="fixed top-4 right-4 z-50 border-primary/30 hover:border-primary bg-background/80 backdrop-blur-sm"
      >
        <Clock className="mr-2 h-4 w-4" />
        Historique
      </Button>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[100px]" />
      </div>

      <div className="text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
          SOCIAL<br />CHAOS
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-md mx-auto">
          Le jeu de soirée qui va détruire votre dignité (et vos amitiés).
        </p>
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-[0_0_50px_-12px_var(--primary)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Prêt à jouer ?</CardTitle>
            <CardDescription className="text-center">Lance une partie locale et détruis des amitiés.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={createRoom}
              className="w-full text-xl py-8 font-bold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-[0_0_20px_var(--primary)] transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-6 w-6" />
              LANCER LA PARTIE
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Multi-joueurs</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skull className="h-6 w-6 text-destructive" />
            <span>Gages Hardcore</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="h-6 w-6 text-secondary" />
            <span>Rythme Rapide</span>
          </div>
        </div>
      </div>
    </main>
  )
}
