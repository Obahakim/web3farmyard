import type { Metadata } from 'next'
import VideoWatchClient from './VideoWatchClient'

export const metadata: Metadata = {
  title: 'Video Lesson',
  description: 'A private preview of a Web3Farmyard video lesson.',
  robots: { index: false, follow: false, noarchive: true },
}

export default function VideoWatchPage() {
  return <VideoWatchClient />
}
