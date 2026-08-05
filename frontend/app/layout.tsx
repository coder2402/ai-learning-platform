import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MathAI - AI-Powered Mathematics Learning Platform',
  description: 'Socratic step-by-step math tutoring with hints, test paper generator, and comprehensive theory.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
