import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BackgroundOrbs from '@/components/ui/BackgroundOrbs'
import { AuthGuard } from '@/components/auth'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SocialChaos',
  description: 'Le jeu de soirée ultime qui sème le chaos.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundOrbs />
        <QueryProvider>
          <AuthGuard>
            <div className="relative z-10 min-h-screen">{children}</div>
          </AuthGuard>
          <LoadingScreen />
        </QueryProvider>
      </body>
    </html>
  )
}
