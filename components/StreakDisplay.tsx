'use client'

import { useState, useEffect } from 'react'

export default function StreakDisplay() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('farmingStreak') || '0'
    setStreak(parseInt(saved))
  }, [])

  if (streak === 0) return null

  return (
    <div className="fixed bottom-24 right-6 z-50 bg-white border border-[#1a6b00] rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="font-mono text-xs text-[#1a6b00]">CURRENT STREAK</div>
        <div className="font-bold text-lg text-[#1a6b00]">{streak} days</div>
      </div>
    </div>
  )
}