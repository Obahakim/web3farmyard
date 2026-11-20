import type { Metadata } from 'next'
import VideoWatchClient from './VideoWatchClient'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Web3 Video Lesson',
  description: 'Watch practical NFT and Web3 video lessons from creators and builders.',
  robots: { index: false, follow: true, noarchive: true },
}

export default function VideoWatchPage() {
  return <>
    <Nav />
    <VideoWatchClient />
    <Footer />
  </>
}
