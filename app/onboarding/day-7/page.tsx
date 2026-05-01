// Day 7: Graduation - Ready for Airdrops

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { saveOnboardingProgress } from '@/lib/supabase'
import { trackOnboardingProgress } from '@/lib/analytics'

export default function Day7Page() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [streak, setStreak] = useState(0)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    trackOnboardingProgress(7, 'started')
    
    const savedUsername = localStorage.getItem('farmerUsername') || ''
    const savedEmail = localStorage.getItem('farmerEmail') || ''
    const savedStreak = parseInt(localStorage.getItem('farmingStreak') || '0')
    const savedDays = JSON.parse(localStorage.getItem('completedDays') || '[]')

    setUsername(savedUsername)
    setEmail(savedEmail)
    setStreak(savedStreak)
    setCompletedDays(savedDays)
    setCompleted(savedDays.includes(7))
  }, [])

  const markDayComplete = async () => {
    const newStreak = streak + 1
    const newDays = [...new Set([...completedDays, 7])]

    setStreak(newStreak)
    setCompletedDays(newDays)
    setCompleted(true)

    localStorage.setItem('farmingStreak', newStreak.toString())
    localStorage.setItem('completedDays', JSON.stringify(newDays))

    if (email) await saveOnboardingProgress(email, newStreak, newDays)
    trackOnboardingProgress(7, 'completed')
  }

  const progress = Math.round((completedDays.length / 7) * 100)

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm font-medium">Day 7 of 7</div>
          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-[#1a6b00] rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="font-mono text-xs text-[#1a6b00]">🔥 {streak} day streak</div>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-serif text-6xl font-bold text-[#0a0a0a] mb-4">🎉 Congratulations, {username || 'Farmer'}!</h1>
          <p className="text-xl text-gray-600 mb-8">You have completed the full 7-day Web3Farmyard onboarding cycle.</p>

          <div className="bg-gradient-to-br from-[#1a6b00]/10 to-[#c8ff00]/10 border-2 border-[#1a6b00] rounded-2xl p-8 mb-8">
            <h2 className="font-serif text-2xl font-bold text-[#1a6b00] mb-4">What You've Learned:</h2>
            <ul className="text-left space-y-3 text-gray-700 max-w-lg mx-auto">
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span>Created and secured your first crypto wallet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span>Executed real swaps on decentralized exchanges</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span>Bridged tokens between different blockchains</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span>Lent tokens on DeFi lending protocols and earned yield</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span>Completed on-chain quests and built your reputation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span>Understand how the Web3 ecosystem works</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
            <h3 className="font-bold text-blue-900 mb-3 text-lg">What's Next?</h3>
            <p className="text-gray-700 mb-6">
              You now have a real on-chain footprint and verified activity across multiple protocols. This is exactly what airdrops look for. You're ready to claim.
            </p>
            <p className="text-gray-700 font-medium">
              Go to the Airdrops page and start farming. Pick 1-2 active airdrops and complete the tasks. Combine what you learned in Days 1-6 with airdrop opportunities.
            </p>
          </div>
        </div>

        <button 
          onClick={markDayComplete} 
          disabled={completed} 
          className={`w-full py-6 rounded-3xl font-medium text-xl transition-all mb-6 ${
            completed 
              ? 'bg-green-100 text-green-700 cursor-default' 
              : 'bg-[#1a6b00] text-white hover:bg-[#0f4600]'
          }`}
        >
          {completed ? 'Cycle Complete' : 'Mark Day 7 as Complete'}
        </button>

        {completed && (
          <div className="space-y-4 text-center">
            <Link href="/airdrops" className="block bg-[#1a6b00] text-white px-12 py-5 rounded-3xl text-xl font-medium hover:bg-[#0f4600] transition-all">
               Go to Airdrops Page →
            </Link>
            <Link href="/toolkit" className="block border-2 border-[#1a6b00] text-[#1a6b00] px-12 py-5 rounded-3xl text-xl font-medium hover:bg-[#f0f8e8] transition-all">
              🛠️ Explore Full Toolkit
            </Link>
            <div className="text-center text-gray-600 mt-8">
              <p className="font-serif text-2xl text-[#0a0a0a] mb-2">WAGMI 🌾</p>
              <p className="text-sm">Stay consistent. Keep learning. Your farming journey has just begun.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
