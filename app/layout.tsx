import Providers from '@/components/Providers'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dynamic Table Manager',
  description: 'Manage your data table with sorting, search, and pagination',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

