// FILE: app/onboarding/day-2/page.tsx
// Day 2: SWAP, BRIDGE, LEND - Focus on Understanding Approvals

'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'

export default function Day2Page() {
  const [activeTab, setActiveTab] = useState('swap')

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="font-mono text-xs tracking-widest text-[#00ffe0] mb-2">📌 DAY 2 OF 7</div>
          <h1 className="font-serif text-5xl font-bold text-[#0a0a0a] mb-4">Master Swaps, Bridges & Lending</h1>
          <p className="text-lg text-gray-600 mb-6">
            Today you'll execute real transactions: swap tokens, bridge assets between chains, and lend on DeFi. The focus is UNDERSTANDING approvals — not just clicking through them.
          </p>
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-sm text-blue-700">⏱️ 45 minutes</div>
            <div className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-sm text-red-700">⚠️ Pay Attention</div>
            <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm text-green-700">✓ 9 Actions Total</div>
          </div>
        </div>

        {/* Critical Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-6 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-700 flex-shrink-0" size={24} />
            <div>
              <p className="font-bold text-yellow-900">⚠️ Critical: Understand Every Approval</p>
              <p className="text-sm text-yellow-800 mt-2">
                When you approve a token for use in a dApp, you're giving it permission to spend that token on your behalf. ALWAYS read what you're approving for and HOW MUCH. This is how many users lose funds to malicious smart contracts.
              </p>
              <p className="text-sm text-yellow-800 mt-2 font-medium">
                Even though these are testnet transactions (no real money), PRACTICE reading approvals carefully. This habit will protect you with real money later.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'swap', label: '🔄 SWAP (3x)', desc: 'Uniswap ETH ↔ Tokens' },
            { id: 'bridge', label: '🌉 BRIDGE (3x)', desc: 'Move assets between chains' },
            { id: 'lend', label: '💰 LEND (3x)', desc: 'Supply to Aave' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#00ffe0] text-[#00ffe0]'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SWAP TAB */}
        {activeTab === 'swap' && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="font-bold text-blue-900 mb-2">What You'll Do: 3 Swaps on Uniswap</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Swap 1: ETH → Test Token (using contract address: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238)</li>
                <li>✓ Swap 2: Test Token → ETH</li>
                <li>✓ Swap 3: ETH → Test Token (practice the process again)</li>
              </ul>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Step 1: Go to Uniswap</h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="bg-[#00ffe0] text-[#0a0a0a] font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Go to <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="text-[#00ffe0] hover:underline">app.uniswap.org</a></p>
                    <p className="text-sm text-gray-600 mt-1">Make sure you're on the Sepolia network in MetaMask.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-[#00ffe0] text-[#0a0a0a] font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Connect your wallet</p>
                    <p className="text-sm text-gray-600 mt-1">Click "Connect Wallet" and select MetaMask.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-[#00ffe0] text-[#0a0a0a] font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Select "From" token (ETH)</p>
                    <p className="text-sm text-gray-600 mt-1">ETH should be selected by default.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-[#00ffe0] text-[#0a0a0a] font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Select "To" token (Test Token)</p>
                    <p className="text-sm text-gray-600 mt-1">Click the dropdown, paste this contract address: <code className="bg-gray-100 px-2 py-1 rounded text-xs">0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238</code></p>
                    <p className="text-xs text-gray-500 mt-2">💡 Without the contract address, Uniswap won't show the token. That's normal — it's a security feature to prevent fake tokens.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-[#00ffe0] text-[#0a0a0a] font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Enter amount and click "Swap"</p>
                    <p className="text-sm text-gray-600 mt-1">Start with 0.01 ETH. This will trigger a MetaMask popup.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-3">⚠️ When the Approval Popup Appears</h3>
              <p className="text-sm text-red-800 mb-3">MetaMask will show a popup asking you to approve the token transfer. READ CAREFULLY:</p>
              <ul className="text-sm text-red-800 space-y-2">
                <li>✓ What contract is asking permission? (Should be Uniswap's SwapRouter)</li>
                <li>✓ What token is being approved? (Should be ETH)</li>
                <li>✓ How much are you approving? (Should be 0.01 ETH, not infinite)</li>
              </ul>
              <p className="text-sm text-red-800 mt-3 font-medium">
                If anything looks wrong, CLICK REJECT. Never approve infinite amounts for unknown contracts.
              </p>
            </section>

            <section className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="font-bold text-green-900 mb-2">✓ After Swap Completes</p>
              <p className="text-sm text-green-800">Wait 30 seconds. You'll see the Test Token appear in your MetaMask wallet. Now repeat this 2 more times (swap back to ETH, then back to Test Token again).</p>
            </section>
          </div>
        )}

        {/* BRIDGE TAB */}
        {activeTab === 'bridge' && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="font-bold text-blue-900 mb-2">What You'll Do: 3 Bridges with Stargate</p>
              <p className="text-sm text-blue-800">Bridge your testnet ETH between different test networks. This teaches you how assets move across chains.</p>
              <p className="text-xs text-blue-700 mt-2">💡 Bridges are critical DeFi infrastructure. Understanding them prepares you for future cross-chain yield farming and airdrops.</p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">How to Bridge with Stargate</h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="bg-purple-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Go to <a href="https://stargate.finance" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">stargate.finance</a></p>
                    <p className="text-sm text-gray-600 mt-1">Click "Launch App"</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-purple-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Connect wallet and select "From" chain (e.g., Sepolia)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-purple-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Select "To" chain (e.g., a different testnet)</p>
                    <p className="text-sm text-gray-600 mt-1">Available testnets: Sepolia, Mumbai (Polygon), Fuji (Avalanche)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-purple-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Enter amount and bridge</p>
                    <p className="text-sm text-gray-600 mt-1">Start with 0.005 ETH. This teaches you cross-chain transactions.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="font-bold text-yellow-900 mb-2">⏱️ Bridging Takes Time</p>
              <p className="text-sm text-yellow-800">
                Bridges take 10-20 minutes because they're moving assets between different blockchains. This is normal. You might see your tokens temporarily disappear — they're just in transit.
              </p>
            </section>

            <section className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="font-bold text-green-900 mb-2">✓ What You're Learning</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Different blockchains require different addresses</li>
                <li>• Bridges take time because they're verifying transactions across chains</li>
                <li>• Bridging enables yield farming across multiple chains</li>
                <li>• Understanding bridges helps you find better yields elsewhere</li>
              </ul>
            </section>
          </div>
        )}

        {/* LEND TAB */}
        {activeTab === 'lend' && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="font-bold text-blue-900 mb-2">What You'll Do: Lend on Aave (3x)</p>
              <p className="text-sm text-blue-800">Supply your testnet ETH to Aave to earn yield. This teaches you how lending protocols work.</p>
            </div>

            <section className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <p className="font-bold text-orange-900 mb-2">🔥 Why This Matters: DeFi is Lending</p>
              <p className="text-sm text-orange-800">
                Most of DeFi is lending protocols (Aave, Compound, etc.). Users deposit assets to earn yield. Borrowers borrow to trade or leverage. Understanding this one concept unlocks most of DeFi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">How to Lend on Aave</h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Go to <a href="https://aave.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aave.com</a> and click "Open App"</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Make sure you're on Sepolia testnet</p>
                    <p className="text-sm text-gray-600 mt-1">Select network dropdown and choose Sepolia</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Connect your MetaMask wallet</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Find "ETH" in the supply list and click "Supply"</p>
                    <p className="text-sm text-gray-600 mt-1">Enter amount (0.01 ETH) and confirm</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Approve token and confirm transaction</p>
                    <p className="text-sm text-gray-600 mt-1">Again, read the approval carefully!</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="font-bold text-green-900 mb-2">✓ Earning Yield</p>
              <p className="text-sm text-green-800 mb-3">Once you supply, you'll see your balance earn interest in real-time. Aave displays APY (annual percentage yield) for each asset.</p>
              <p className="text-sm text-green-800">
                Repeat this 3 times with different assets if available (ETH, USDC, etc.). This teaches you that yield varies by asset.
              </p>
            </section>
          </div>
        )}

        {/* Day 2 Summary */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gradient-to-r from-[#f0f8e8] to-blue-50 rounded-xl p-8">
            <h3 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-4">✓ Day 2 Complete Checklist</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">Made 3 swaps on Uniswap</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">Bridged tokens between chains</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">Lent on Aave and earned yield</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">Understood approvals and security</span>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              You've now done the three core DeFi actions. Tomorrow you'll connect to real task-earning platforms (TaskOn and Zealy) to start building your on-chain resume.
            </p>
            <Link
              href="/onboarding/day-3"
              className="inline-flex items-center gap-2 bg-[#1a6b00] hover:bg-[#134f00] text-white font-medium px-8 py-4 rounded-xl transition-all"
            >
              Continue to Day 3 <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

// Note: Days 3-7 follow similar structure with links to:
// - TaskOn: https://taskon.xyz/TaskOnClub?task=899234669&invite=CmCh8Vvi
// - Zealy: https://zealy.io
// - Galxe: https://galxe.com
// - Airdrops: /airdrops
// - Blog: /blog
// - Junkyard: /junkyard