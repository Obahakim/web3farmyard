import type { Metadata } from 'next'
import VideoCatalogueClient from './VideoCatalogueClient'

export const metadata: Metadata = {
  title: 'Video Learning Shelf',
  description: 'A private preview of the Web3Farmyard video learning catalogue.',
  robots: { index: false, follow: false, noarchive: true },
}

export default function VideosPage() {
  return <VideoCatalogueClient />
}
