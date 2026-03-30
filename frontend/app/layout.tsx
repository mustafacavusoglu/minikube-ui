import type { Metadata } from 'next'
import { Red_Hat_Display, Red_Hat_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NamespaceProvider } from '@/contexts/namespace-context'
import './globals.css'

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: '--font-sans'
});

const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'MiniKube Console',
  description: 'OpenShift-style Kubernetes Dashboard for Minikube',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${redHatDisplay.variable} ${redHatMono.variable} font-sans antialiased`}>
        <NamespaceProvider>
          {children}
        </NamespaceProvider>
        <Analytics />
      </body>
    </html>
  )
}
