// Day 6: Complete a Quest

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { saveOnboardingProgress } from '@/lib/supabase'
import { trackOnboardingProgress } from '@/lib/analytics'

export default function Day6Page() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [streak, setStreak] = useState(0)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    trackOnboardingProgress(6, 'started')
    
    const savedUsername = localStorage.getItem('farmerUsername') || ''
    const savedEmail = localStorage.getItem('farmerEmail') || ''
    const savedStreak = parseInt(localStorage.getItem('farmingStreak') || '0')
    const savedDays = JSON.parse(localStorage.getItem('completedDays') || '[]')

    setUsername(savedUsername)
    setEmail(savedEmail)
    setStreak(savedStreak)
    setCompletedDays(savedDays)
    setCompleted(savedDays.includes(6))
  }, [])

  const markDayComplete = async () => {
    const newStreak = streak + 1
    const newDays = [...new Set([...completedDays, 6])]

    setStreak(newStreak)
    setCompletedDays(newDays)
    setCompleted(true)

    localStorage.setItem('farmingStreak', newStreak.toString())
    localStorage.setItem('completedDays', JSON.stringify(newDays))

    if (email) await saveOnboardingProgress(email, newStreak, newDays)
    trackOnboardingProgress(6, 'completed')
  }

  const progress = Math.round((completedDays.length / 7) * 100)

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm font-medium">Day 6 of 7</div>
          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-[#1a6b00] rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="font-mono text-xs text-[#1a6b00]">🔥 {streak} day streak</div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-[#0a0a0a] mb-2">Day 6: Complete a Quest</h1>
        <p className="text-gray-600 mb-10">Finish one on-chain quest from Galxe or LayerZero to build your reputation.</p>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10 space-y-4">
          <div>
            <h3 className="font-bold text-[#1a6b00] mb-3 text-lg">Choose one quest platform:</h3>
            <div className="space-y-3">
              <a href="https://galxe.com" target="_blank" rel="noopener noreferrer" className="block py-4 px-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-all">
                🚀 Galxe.com (Recommended for beginners)
              </a>
              <a href="https://taskon.xyz" target="_blank" rel="noopener noreferrer" className="block py-4 px-6 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 font-medium hover:bg-purple-100 transition-all">
                ✨ TaskOn.xyz (Earn real rewards)
              </a>
              <a href="https://zealy.io" target="_blank" rel="noopener noreferrer" className="block py-4 px-6 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium hover:bg-green-100 transition-all">
                📊 Zealy.io (Build XP score)
              </a>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl text-sm mt-4">
            <p><strong>What to do:</strong></p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mt-2">
              <li>Pick ONE of the platforms above</li>
              <li>Connect your wallet (MetaMask or OKX)</li>
              <li>Browse available quests</li>
              <li>Complete at least 1 quest (usually takes 5-15 minutes)</li>
              <li>Confirm completion and take a screenshot</li>
            </ol>
          </div>
        </div>

        <button 
          onClick={markDayComplete} 
          disabled={completed} 
          className={`w-full py-6 rounded-3xl font-medium text-xl transition-all ${
            completed 
              ? 'bg-green-100 text-green-700 cursor-default' 
              : 'bg-[#1a6b00] text-white hover:bg-[#0f4600]'
          }`}
        >
          {completed ? '✅ Day 6 Completed' : 'Mark Day 6 as Complete'}
        </button>

        {completed && (
          <div className="mt-8 text-center">
            <Link href="/onboarding/day-7" className="inline-block bg-[#1a6b00] text-white px-12 py-5 rounded-3xl text-xl hover:bg-[#0f4600] transition-all">
              Continue to Day 7 (Final) →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
