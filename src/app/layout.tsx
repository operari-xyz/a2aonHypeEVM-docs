import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HyperEVM USDT0 Facilitator - API Documentation',
  description: 'Complete documentation for the HyperEVM USDT0 Custom Facilitator service that enables agent-to-agent USDT0 transactions using EIP-3009 transferWithAuthorization with facilitator-paid gas fees.',
  keywords: ['HyperEVM', 'USDT0', 'Facilitator', 'EIP-3009', 'Blockchain', 'API', 'Documentation'],
  authors: [{ name: 'HyperEVM Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'HyperEVM USDT0 Facilitator - API Documentation',
    description: 'Complete documentation for the HyperEVM USDT0 Custom Facilitator service',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0a0a0a]">
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
