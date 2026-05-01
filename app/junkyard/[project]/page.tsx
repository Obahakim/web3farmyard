import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getProjectDetail, PROJECT_DETAILS } from '@/lib/junkyard-data'

interface Props {
  params: Promise<{ project: string }>
}

export async function generateStaticParams() {
  return Object.keys(PROJECT_DETAILS).map(project => ({ project }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await params
  const detail = getProjectDetail(project)
  if (!detail) return { title: 'Project Not Found' }

  return {
    title: detail.headline,
    description: detail.metaDesc,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { project } = await params
  const detail = getProjectDetail(project)
  if (!detail) notFound()

  return (
    <>
      <Nav />

      <div style={{ background: '#eef0f4', minHeight: '100vh' }}>
        <div className="max-w-[1100px] mx-auto px-7 py-8">
          
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex gap-2 font-mono text-[9px] flex-wrap" style={{ listStyle: 'none', color: '#999' }}>
              <li><Link href="/" style={{ color: '#1a6b00' }}>Home</Link></li>
              <li>/</li>
              <li><Link href="/junkyard" style={{ color: '#cc0000' }}>Junkyard</Link></li>
              <li>/</li>
              <li>{detail.fullName}</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="flex items-center gap-4 mb-8">
            <span style={{ fontSize: 52 }}>💀</span>
            <div>
              <span 
                className="font-mono text-[9px] font-bold px-3 py-1 rounded-full" 
                style={{ background: '#ff4d4d22', color: '#cc0000' }}
              >
                {detail.category.toUpperCase()}
              </span>
              <h1 className="font-serif font-bold text-dark text-4xl">
                {detail.headline}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section className="glass p-6">
              <h2 className="font-serif text-xl font-bold mb-3">What was {detail.fullName}?</h2>
              <p className="text-sm" style={{ color: '#444', lineHeight: 1.85 }}>{detail.what}</p>
            </section>

            <section className="p-6" style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 16 }}>
              <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#991b1b' }}>What Went Wrong?</h2>
              <p className="text-sm" style={{ color: '#7f1d1d', lineHeight: 1.85 }}>{detail.wrong}</p>
            </section>

            <section className="glass p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Lessons Learned</h2>
              <p className="text-sm" style={{ color: '#444', lineHeight: 1.85 }}>{detail.lessons}</p>
            </section>
          </div>

          <div className="flex gap-3 flex-wrap mt-10">
            <Link href="/toolkit" className="btn-primary">🛠️ Go to Web3 Toolkit</Link>
            <Link href="/junkyard" className="btn-outline">← Back to Junkyard</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}