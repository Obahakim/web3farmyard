import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import FloatingChat from '@/components/FloatingChat'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.web3farmyard.com'),
  title: {
    default: 'Web3Farmyard — Live DeFi Data, Airdrops & Crypto Graveyard',
    template: '%s | Web3Farmyard',
  },
  description: 'Live DeFi chain metrics, curated crypto airdrops, and the most comprehensive record of failed Web3 projects. Your edge in the next cycle.',
  keywords: ['crypto airdrops', 'DeFi metrics', 'live TVL', 'crypto graveyard', 'rug pulls', 'blockchain data', 'web3 farming'],
  authors: [{ name: 'Web3Farmyard', url: 'https://www.web3farmyard.com' }],
  creator: 'Web3Farmyard',
  publisher: 'Web3Farmyard',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.web3farmyard.com',
    siteName: 'Web3Farmyard',
    title: 'Web3Farmyard — Live DeFi Data, Airdrops & Crypto Graveyard',
    description: 'Live DeFi chain metrics, curated crypto airdrops, and the most comprehensive record of failed Web3 projects.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web3Farmyard',
    description: 'Live DeFi data, airdrops, and the crypto graveyard.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzBhMGEwYSIvPjxyZWN0IHg9IjkiIHk9IjE0IiB3aWR0aD0iMTMiIGhlaWdodD0iNyIgcng9IjEiIGZpbGw9IiNjOGZmMDAiLz48cmVjdCB4PSIxNiIgeT0iMTAiIHdpZHRoPSI3IiBoZWlnaHQ9IjYiIHJ4PSIxIiBmaWxsPSIjYzhmZjAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIyMiIgcj0iNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzhmZjAwIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjIyIiByPSIyIiBmaWxsPSIjYzhmZjAwIi8+PC9zdmc+",
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c8ff00',
}

const TRACTOR_FAVICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzBhMGEwYSIvPjxyZWN0IHg9IjkiIHk9IjE0IiB3aWR0aD0iMTMiIGhlaWdodD0iNyIgcng9IjEiIGZpbGw9IiNjOGZmMDAiLz48cmVjdCB4PSIxNiIgeT0iMTAiIHdpZHRoPSI3IiBoZWlnaHQ9IjYiIHJ4PSIxIiBmaWxsPSIjYzhmZjAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIyMiIgcj0iNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzhmZjAwIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjIyIiByPSIyIiBmaWxsPSIjYzhmZjAwIi8+PC9zdmc+"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href={TRACTOR_FAVICON} />
        {/* Fonts: preconnect first, then stylesheet for best performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://api.llama.fi" />
        <link rel="preconnect" href="https://icons.llama.fi" />
        <link rel="dns-prefetch" href="https://lzanqqvvpwccrtprzxvu.supabase.co" />

        {/* Google Analytics (GA4) — tracks the whole domain, unified with the /blog Measurement ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-53RS0CQD48"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-53RS0CQD48');
          `}
        </Script>
      </head>
      <body>{children}
  <FloatingChat />

        {/* tawk.to live chat + visitor monitoring widget */}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/6a4ab6c48a10cd1d4aadb564/default';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
</body>

    </html>
  )
}