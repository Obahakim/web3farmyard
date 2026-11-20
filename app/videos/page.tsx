import type { Metadata } from 'next'
import VideoCatalogueClient from './VideoCatalogueClient'

export const metadata: Metadata = {
  title: 'NFT Videos, Tutorials & Live Streaming Guides',
  description: 'Watch NFT tutorials, NFT marketplace walkthroughs, minting guides, Web3 creator interviews and NFT live-streaming sessions on Web3Farmyard.',
  keywords: ['NFT videos', 'NFT tutorials', 'NFT live streaming', 'NFT livestream', 'NFT marketplace tutorial', 'how to mint an NFT', 'NFT creator interviews', 'Web3 videos', 'blockchain tutorials', 'crypto education'],
  alternates: { canonical: 'https://web3farmyard.com/videos/' },
  openGraph: { title: 'Videos | Web3Farmyard', description: 'NFT tutorials, marketplace walkthroughs, minting guides and Web3 creator videos.', url: 'https://web3farmyard.com/videos/', siteName: 'Web3Farmyard', type: 'website' },
}

export default function VideosPage() {
  return <VideoCatalogueClient />
}
