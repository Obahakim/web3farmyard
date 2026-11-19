// FILE: app/components/Footer.tsx
// FOOTER - Discord link only in contact section

import Link from 'next/link'
import { Code, Share2, Mail, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-gray-800 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Branding */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-[#c8ff00]">
              Web3Farmyard
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A beginner-friendly guide to Web3, with practical learning, market data, and useful resources.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-mono text-sm font-bold text-[#00ffe0] mb-4 tracking-wider">
              PLATFORM
            </h4>
            <nav className="space-y-3">
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
                Blog
              </Link>
              <Link href="/airdrops" className="text-gray-400 hover:text-white text-sm transition-colors">
                Airdrops
              </Link>
              <Link href="/toolkit" className="text-gray-400 hover:text-white text-sm transition-colors">
                Toolkit
              </Link>
              <Link href="/showroom" className="text-gray-400 hover:text-white text-sm transition-colors">
                Showroom
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-mono text-sm font-bold text-[#00ffe0] mb-4 tracking-wider">
              RESOURCES
            </h4>
            <nav className="space-y-3">
              <Link href="/onboarding/day-1" className="text-gray-400 hover:text-white text-sm transition-colors">
                7-Day Learning Path
              </Link>
              <Link href="/showroom" className="text-gray-400 hover:text-white text-sm transition-colors">
                Chain Rankings
              </Link>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Docs
              </a>
            </nav>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-mono text-sm font-bold text-[#00ffe0] mb-4 tracking-wider">
              CONTACT US
            </h4>
            <div className="flex flex-col gap-3">
              <a 
                href="https://discord.gg/qqaafeErX" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#00ffe0] transition-colors"
              >
                <Share2 size={18} />
                <span className="text-sm">Discord</span>
              </a>
              <a 
                href="https://twitter.com/web3farmyard" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#00ffe0] transition-colors"
              >
                <Zap size={18} />
                <span className="text-sm">Twitter</span>
              </a>
              <a 
                href="https://github.com/web3farmyard" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#00ffe0] transition-colors"
              >
                <Code size={18} />
                <span className="text-sm">GitHub</span>
              </a>
              <a 
                href="mailto:hello@web3farmyard.com"
                className="flex items-center gap-2 text-gray-400 hover:text-[#00ffe0] transition-colors"
              >
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </a>
            </div>
          </div>

        </div>

        <div className="footer-join">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">Keep learning with us.</h3>
            <p className="text-gray-400">Get new guides and Web3 insights in your inbox.</p>
          </div>
          <Link href="/#join-now" className="footer-join-button">
            Join Now <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-mono">
            © 2026 Web3Farmyard. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
              Disclaimer
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}