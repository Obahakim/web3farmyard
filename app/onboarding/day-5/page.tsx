// FILE: app/onboarding/day-5/page.tsx
// Day 5: Lend on Aave

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { saveOnboardingProgress } from '@/lib/supabase'
import { trackOnboardingProgress } from '@/lib/analytics'

export default function Day5Page() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [streak, setStreak] = useState(0)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    trackOnboardingProgress(5, 'started')
    
    const savedUsername = localStorage.getItem('farmerUsername') || ''
    const savedEmail = localStorage.getItem('farmerEmail') || ''
    const savedStreak = parseInt(localStorage.getItem('farmingStreak') || '0')
    const savedDays = JSON.parse(localStorage.getItem('completedDays') || '[]')

    setUsername(savedUsername)
    setEmail(savedEmail)
    setStreak(savedStreak)
    setCompletedDays(savedDays)
    setCompleted(savedDays.includes(5))
  }, [])

  const markDayComplete = async () => {
    const newStreak = streak + 1
    const newDays = [...new Set([...completedDays, 5])]

    setStreak(newStreak)
    setCompletedDays(newDays)
    setCompleted(true)

    localStorage.setItem('farmingStreak', newStreak.toString())
    localStorage.setItem('completedDays', JSON.stringify(newDays))

    if (email) await saveOnboardingProgress(email, newStreak, newDays)
    trackOnboardingProgress(5, 'completed')
  }

  const progress = Math.round((completedDays.length / 7) * 100)

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm font-medium">Day 5 of 7</div>
          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-[#1a6b00] rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="font-mono text-xs text-[#1a6b00]">🔥 {streak} day streak</div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-[#0a0a0a] mb-2">Day 5: Lend on DeFi</h1>
        <p className="text-gray-600 mb-10">Earn interest by lending test tokens on Aave.</p>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10">
          <a href="https://app.aave.com/?marketName=proto_sepolia_v3" target="_blank" rel="noopener noreferrer" className="block w-full py-6 bg-[#1a6b00] text-white text-center rounded-3xl font-medium text-xl mb-6 hover:bg-[#0f4600] transition-all">
            Open Aave Testnet →
          </a>
          <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl text-sm space-y-3">
            <p><strong>How to lend on Aave:</strong></p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to Settings (top right) and enable <strong>Testnets</strong></li>
              <li>Make sure you're on <strong>Sepolia</strong> network</li>
              <li>Connect your wallet</li>
              <li>Click "Supply" and choose a test token (ETH, USDC, DAI)</li>
              <li>Enter amount to lend</li>
              <li>Approve the transaction</li>
              <li>Complete the supply</li>
            </ol>
            <p className="mt-3"><strong>What happens:</strong> Your tokens earn APY (Annual Percentage Yield). This teaches you how lending protocols work, which is crucial for advanced airdrop farming.</p>
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
          {completed ? '✅ Day 5 Completed' : 'Mark Day 5 as Complete'}
        </button>

        {completed && (
          <div className="mt-8 text-center">
            <Link href="/onboarding/day-6" className="inline-block bg-[#1a6b00] text-white px-12 py-5 rounded-3xl text-xl hover:bg-[#0f4600] transition-all">
              Continue to Day 6 →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
