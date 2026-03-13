import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Heebo } from 'next/font/google'
import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider' // ייבוא הפרובאיידר

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  variable: '--font-heebo',
  display: 'swap', // עוזר לטעינה מהירה יותר של הפונט
})

export const metadata: Metadata = {
  title: 'ראש אמ"ן - הערכת מודיעין אסטרטגית',
  description: 'משחק הטריוויה הגיאופוליטי של המזרח התיכון.',
  manifest: '/manifest.json', // קישור למניפסט
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl">
        <body className={`${heebo.className} antialiased bg-slate-950 text-slate-100`}>
            <ConvexClientProvider>

            {children}
            </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}