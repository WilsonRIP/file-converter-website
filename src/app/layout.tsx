import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Alfa_Slab_One } from 'next/font/google'
import './globals.css'
import 'react-datepicker/dist/react-datepicker.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { WEBSITE_NAME } from '@/lib/types'
import { ThemeProvider } from '@/app/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import AuthButton from './components/AuthButton'
import Link from 'next/link'
import { AuthProvider } from 'better-auth/react'

// Optimize font loading
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

const alfaSlabOne = Alfa_Slab_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alfa-slab-one',
  display: 'swap',
})

// Enhanced viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// Enhanced metadata configuration
export const metadata: Metadata = {
  title: {
    template: `%s | ${WEBSITE_NAME}`,
    default: WEBSITE_NAME,
  },
  description: `Official website for ${WEBSITE_NAME}`,
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  // Update with your actual domain when deploying
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    siteName: WEBSITE_NAME,
    title: WEBSITE_NAME,
    description: `Official website for ${WEBSITE_NAME}`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: WEBSITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: WEBSITE_NAME,
    description: `Official website for ${WEBSITE_NAME}`,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${alfaSlabOne.variable} from-background bg-gradient-to-br via-blue-900/10 to-teal-900/20 antialiased dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-900/10`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="website-theme"
          >
            <header className="bg-white shadow-sm dark:bg-gray-800">
              <nav className="container mx-auto flex items-center justify-between px-4 py-3">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  <Link href="/">{WEBSITE_NAME}</Link>
                </h1>
                <AuthButton />
              </nav>
            </header>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </AuthProvider>
  )
}
