// FILE: app/onboarding/day-1/page.tsx
// DAY 1 - Create Your Wallet (with article links)

import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { CheckCircle2, ArrowRight, BookOpen } from 'lucide-react'

export default function Day1Page() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs text-gray-600 font-bold">PROGRESS</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-[#1a6b00] h-full w-1/7"></div>
            </div>
            <span className="font-mono text-xs text-gray-600">1 / 7</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-mono text-xs font-bold mb-4">
            DAY 1 / 7
          </div>
          <h1 className="font-serif text-5xl font-bold text-[#0a0a0a] mb-4">
            Create Your Wallet
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Your wallet is your identity on-chain. It's like a bank account, but you control it completely. No passwords, no banks, just you and your keys.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 mb-12">
          
          {/* Step 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-50 border-2 border-blue-500 text-blue-700 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#0a0a0a] mb-2">Download Zerion Wallet</h2>
                <p className="text-gray-700 mb-4">
                  Zerion is a secure Web3 wallet for Ethereum and EVM chains. Use it to store testnet funds and interact with dApps.
                </p>
                <a
                  href="https://link.zerion.io/referral?code=8ZXJE6VKK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded-lg transition-all"
                >
                  Download Zerion Wallet
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-green-50 border-2 border-green-500 text-green-700 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#0a0a0a] mb-2">Create a New Wallet</h2>
                <p className="text-gray-700 mb-4">
                  Open Zerion and follow the setup wizard. You'll get a 12-word recovery phrase - this is critical. Never share it with anyone.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  <a
                    href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a6b00] hover:underline"
                  >
                    How to set up your wallet
                  </a>
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-900 font-mono text-sm">
                    ⚠️ <strong>CRITICAL:</strong> Save your 12-word seed phrase in a safe place. If you lose it, you lose access to your funds forever.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-50 border-2 border-purple-500 text-purple-700 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#0a0a0a] mb-2">Verify Your Setup</h2>
                <p className="text-gray-700 mb-4">
                  Zerion will ask you to confirm your seed phrase. Write down the words in order and verify them correctly.
                </p>
                <p className="text-gray-700">
                  Once confirmed, your wallet is live! You now have an Ethereum address you can receive crypto on.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-50 border-2 border-yellow-500 text-yellow-700 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#0a0a0a] mb-2">Get Testnet ETH</h2>
                <p className="text-gray-700 mb-4">
                  Get free Testnet tokens for practice. Go to the faucet, select chain e.g. Sepolia ETH, follow the onscreen prompt, share a tweet and copy the link when prompted to request tokens. Repeat for multiple chains — you are only allowed one request per chain every 24 hours. After request, the tokens take a little time to hit your wallet.
                </p>
                <a
                  href="https://faucet.trade/sepolia-eth-faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                >
                  Get Sepolia Testnet ETH
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Related Articles */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
            <BookOpen size={24} />
            Learn More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/" target="_blank" rel="noopener noreferrer" className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-all block">
              <h3 className="font-bold text-blue-900 mb-2">📚 Wallet Security Guide</h3>
              <p className="text-sm text-blue-800">Learn how to keep your wallet safe from scams and hacks</p>
            </a>
            <Link href="/blog" className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-all">
              <h3 className="font-bold text-purple-900 mb-2">🔑 Understanding Private Keys</h3>
              <p className="text-sm text-purple-800">What are private keys and why they matter</p>
            </Link>
            <Link href="/blog" className="bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:bg-green-100 transition-all">
              <h3 className="font-bold text-green-900 mb-2">⛓️ Introduction to Blockchains</h3>
              <p className="text-sm text-green-800">How blockchain technology works</p>
            </Link>
            <Link href="/toolkit" className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 hover:bg-orange-100 transition-all">
              <h3 className="font-bold text-orange-900 mb-2">🌉 Multi-Chain Wallets</h3>
              <p className="text-sm text-orange-800">Use your wallet on different blockchains</p>
            </Link>
          </div>
        </section>

        {/* Next Day CTA */}
        <div className="bg-gradient-to-r from-[#f0f8e8] to-white rounded-2xl p-12 border-2 border-[#d0e8c0] text-center">
          <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-4">
            Done with Day 1?
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Great job! You now have a wallet and understand how to keep it safe. Tomorrow, we'll learn how to swap tokens and bridge between chains.
          </p>
          <Link
            href="/onboarding/day-2"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded-lg transition-all text-lg"
          >
            Continue to Day 2
            <CheckCircle2 size={20} />
          </Link>
        </div>

      </main>
      <Footer />
    </>
  )
}