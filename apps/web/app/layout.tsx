import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Providers from './Provider'
import { WebSocketProvider } from '@/lib/context/WebSocketContext'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Social Media: LaRa',
  description: 'Developed by Captain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <Providers>            
          {/* <WebSocketProvider > */}
            {children}          
          {/* </WebSocketProvider> */}
        </Providers>
      </body>
    </html>
  )
}
