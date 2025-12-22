import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BackgroundOrbs from '@/components/ui/BackgroundOrbs'
import { AuthGuard } from '@/components/auth'
import { Toaster } from 'sonner'
import { PWAInstallPrompt, PWAUpdatePrompt } from '@/components/pwa'

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
  title: 'Social Chaos',
  description:
    'Le jeu de soirée ultime qui sème le chaos. Défis, gages et fous rires garantis !',
  manifest: '/manifest.json',
  keywords: ['jeu', 'soirée', 'party game', 'défis', 'gages', 'chaos'],
  authors: [{ name: 'Social Chaos Team' }],
  creator: 'Social Chaos',
  publisher: 'Social Chaos',

  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://socialchaos.app',
    siteName: 'Social Chaos',
    title: 'Social Chaos - Le jeu de soirée ultime',
    description:
      'Le jeu de soirée ultime qui sème le chaos. Défis, gages et fous rires garantis !',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Social Chaos Logo',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary',
    title: 'Social Chaos',
    description: 'Le jeu de soirée ultime qui sème le chaos !',
    images: ['/icons/icon-512x512.png'],
  },

  // Apple Web App meta
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Social Chaos',
  },

  // Icons
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icons/icon-96x96.png',
  },

  // App links
  applicationName: 'Social Chaos',

  // Robots
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#a855f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Additional PWA meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Social Chaos" />

        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />

        {/* Splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1170x2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* Preconnect to Firebase */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
      </head>
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

        {/* PWA Install & Update Prompts */}
        <PWAInstallPrompt />
        <PWAUpdatePrompt />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: 'rgba(15, 15, 25, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </body>
    </html>
  )
}
