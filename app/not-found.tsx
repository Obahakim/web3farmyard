import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="max-w-[1100px] mx-auto px-7 py-24 text-center">
        <div style={{fontSize:64,marginBottom:16}}>💀</div>
        <h1 className="font-serif text-4xl font-bold text-dark mb-4">404 — Page Not Found</h1>
        <p className="text-base mb-8" style={{color:'#666'}}>
          This page is dead. Check the URL or head back to the Farmyard.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-primary">← HOME</Link>
          <Link href="/airdrops" className="btn-outline">🌾 AIRDROPS</Link>
          <Link href="/junkyard" className="btn-outline">☠️ JUNKYARD</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
