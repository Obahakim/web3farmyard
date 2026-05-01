import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1a6b00] mb-4">Web3Farmyard</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Learn Web3, find airdrops, farm profitably. A guide for beginners.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-[#1a6b00] transition">Home</Link></li>
              <li><Link href="/onboarding/day-1" className="text-gray-400 hover:text-[#1a6b00] transition">Onboarding</Link></li>
              <li><Link href="/toolkit" className="text-gray-400 hover:text-[#1a6b00] transition">Toolkit</Link></li>
              <li><Link href="/airdrops" className="text-gray-400 hover:text-[#1a6b00] transition">Airdrops</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-[#1a6b00] transition">Blog</Link></li>
              <li><Link href="/junkyard" className="text-gray-400 hover:text-[#1a6b00] transition">Junkyard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition">MetaMask</a></li>
              <li><a href="https://uniswap.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition">Uniswap</a></li>
              <li><a href="https://aave.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition">Aave</a></li>
              <li><a href="https://galxe.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition">Galxe</a></li>
              <li><a href="https://taskon.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition">TaskOn</a></li>
              <li><a href="https://zealy.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition">Zealy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://twitter.com/web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition flex items-center gap-2">
                  <span>𝕏 Twitter</span>
                  <span className="text-xs text-gray-600">@web3farmyard</span>
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition flex items-center gap-2">
                  <span>🎵 TikTok</span>
                  <span className="text-xs text-gray-600">@web3farmyard</span>
                </a>
              </li>
              <li>
                <a href="https://discord.gg/web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition flex items-center gap-2">
                  <span>🎮 Discord</span>
                </a>
              </li>
              <li>
                <a href="https://t.me/web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1a6b00] transition flex items-center gap-2">
                  <span>💬 Telegram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; 2024 Web3Farmyard. Not financial advice. DYOR (Do Your Own Research).
            </p>
            <div className="flex gap-6 text-sm">
              <a href="https://twitter.com/web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1a6b00] transition">
                Twitter
              </a>
              <a href="https://tiktok.com/@web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1a6b00] transition">
                TikTok
              </a>
              <a href="https://discord.gg/web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1a6b00] transition">
                Discord
              </a>
              <a href="https://t.me/web3farmyard" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1a6b00] transition">
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}