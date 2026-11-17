import type { Metadata } from 'next'
import { generateBreadcrumbListSchema } from './schema'

/**
 * Generate metadata for a Showroom chain page
 * IMPORTANT: Uses the rich description from chain-data.ts in the meta tag
 */
export function generateChainMetadata(
  chainName: string,
  chainTvl: string,
  chainContent: { description: string; category: string },
  rank: number,
  slug: string
): Metadata {
  // Extract first sentence from the rich description for the meta tag
  const firstSentence = chainContent.description.split('.')[0] + '.'

  // Build a richer meta description
  const metaDescription = `${chainName} blockchain — Rank #${rank} with ${chainTvl} in DeFi. ${firstSentence}`

  return {
    title: `${chainName} Blockchain — TVL & DeFi Data | Web3Farmyard`,
    description: metaDescription,
    keywords: [
      `${chainName} blockchain`,
      `${chainName} TVL`,
      'DeFi data',
      'daily chain metrics',
      chainContent.category.toLowerCase(),
    ],
    alternates: {
      canonical: `https://www.web3farmyard.com/showroom/${slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${chainName} Blockchain — Daily Data | Web3Farmyard`,
      description: metaDescription,
      url: `https://www.web3farmyard.com/showroom/${slug}`,
      images: [
        {
          url: 'https://www.web3farmyard.com/og-showroom.png',
          width: 1200,
          height: 630,
          alt: `${chainName} DeFi metrics`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${chainName} Blockchain — Web3Farmyard`,
      description: metaDescription,
      images: ['https://www.web3farmyard.com/og-showroom.png'],
    },
  }
}

/**
 * Generate metadata for Showroom index page with Dataset schema
 */
export function generateShowroomMetadata(): Metadata {
  return {
    title: 'DeFi Chain Rankings — TVL & DEX Volume | Web3Farmyard',
    description:
      'Track DeFi chains ranked by total value locked and 24-hour DEX trading volume, with 24-hour TVL changes. Daily snapshot data from DeFiLlama.',
    keywords: [
      'DeFi rankings',
      'TVL tracker',
      'blockchain rankings',
      'DeFi metrics',
      'Ethereum TVL',
      'Solana TVL',
      'chain comparison',
    ],
    alternates: {
      canonical: 'https://www.web3farmyard.com/showroom',
    },
    openGraph: {
      type: 'website',
      title: 'DeFi Chain Rankings | Web3Farmyard',
      description: 'Track DeFi chains by TVL and 24-hour DEX trading volume, with 24-hour TVL changes',
      url: 'https://www.web3farmyard.com/showroom',
      images: [
        {
          url: 'https://www.web3farmyard.com/og-showroom.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

/**
 * Generate metadata for Airdrops page with FAQ schema
 * FIX: Function name matches import (generateAirdropPageMetadata)
 */
export function generateAirdropPageMetadata(): Metadata {
  return {
    title: 'Live Crypto Airdrops 2026 — Curated & Risk-Rated | Web3Farmyard',
    description:
      'Browse verified crypto airdrop opportunities with risk ratings, deadlines, and step-by-step tasks. Learn how to evaluate airdrops safely without getting rugged.',
    keywords: [
      'crypto airdrops',
      'airdrop 2026',
      'token airdrops',
      'how to claim airdrops',
      'airdrop guide',
      'low risk airdrops',
      'airdrop farming',
    ],
    alternates: {
      canonical: 'https://www.web3farmyard.com/airdrops',
    },
    openGraph: {
      type: 'website',
      title: 'Live Crypto Airdrops 2026 | Web3Farmyard',
      description: 'Curated airdrop opportunities with risk ratings and step-by-step tasks',
      url: 'https://www.web3farmyard.com/airdrops',
      images: [
        {
          url: 'https://www.web3farmyard.com/og-airdrops.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

/**
 * Generate metadata for Junkyard page
 */
export function generateJunkyardMetadata(): Metadata {
  return {
    title: 'The Crypto Graveyard — Every Major Rug Pull, Ponzi & Collapse',
    description:
      'A permanent archive of every major crypto failure: rug pulls, Ponzi schemes, exchange collapses, and smart contract exploits. Luna, FTX, BitConnect, and more.',
    keywords: [
      'crypto failures',
      'rug pulls',
      'Ponzi schemes',
      'Luna collapse',
      'FTX fraud',
      'crypto scams',
      'DeFi exploits',
    ],
    alternates: {
      canonical: 'https://www.web3farmyard.com/junkyard',
    },
    openGraph: {
      type: 'website',
      title: 'The Crypto Graveyard — Web3 Failures Archive',
      description: '29+ documented crypto failures with timelines, peak values, and lessons learned',
      url: 'https://www.web3farmyard.com/junkyard',
      images: [
        {
          url: 'https://www.web3farmyard.com/og-junkyard.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

/**
 * Generate metadata for Toolkit page
 */
export function generateToolkitMetadata(): Metadata {
  return {
    title: 'Web3 Toolkit — 30+ Essential Tools for Crypto Farming | Web3Farmyard',
    description:
      'Curated Web3 tools: wallets, DEXs, bridges, lending protocols, analytics, and airdrop platforms. Everything beginners need to start farming safely.',
    keywords: [
      'web3 tools',
      'crypto wallets',
      'DeFi protocols',
      'blockchain tools',
      'airdrop platforms',
      'crypto toolkit',
    ],
    alternates: {
      canonical: 'https://www.web3farmyard.com/toolkit',
    },
    openGraph: {
      type: 'website',
      title: 'Web3 Toolkit | Web3Farmyard',
      description: 'Complete toolkit for Web3 farmers with 30+ verified tools',
      url: 'https://www.web3farmyard.com/toolkit',
    },
  }
}

/**
 * Generate metadata for Onboarding pages
 */
export function generateOnboardingMetadata(day: number): Metadata {
  const titles: Record<number, string> = {
    1: 'Day 1: Create Your Wallet & Claim Testnet ETH',
    2: 'Day 2: Master Swaps, Bridges & Lending',
    3: 'Day 3: Task Farming & Building Your Network',
    4: 'Day 4: Zealy Quests & Community Engagement',
    5: 'Day 5: Galxe Credentials & Web3 Socials',
    6: 'Day 6: Practice & Advanced Learning',
    7: 'Day 7: Graduation & Start Airdrop Farming',
  }

  const descriptions: Record<number, string> = {
    1: 'Learn to create a secure MetaMask wallet, copy your address safely, and claim free testnet ETH to practice with. No real money needed.',
    2: 'Execute real swaps, bridges, and lending transactions on Uniswap, Stargate, and Aave. Understand approvals and security.',
    3: 'Join TaskOn, create social accounts, and start earning points and token rewards from completing tasks.',
    4: 'Complete Zealy XP quests, understand the gamification system, and build your on-chain reputation.',
    5: 'Set up Galxe for on-chain credentials, create your X (Twitter) presence, and network in Web3 communities.',
    6: 'Practice swaps, bridges, and lending again. Read advanced blog articles and explore the full toolkit.',
    7: 'Congratulations! You now have the skills to identify and claim airdrops safely. Start farming.',
  }

  return {
    title: `${titles[day] || `Day ${day}`} | 7-Day Web3 Onboarding | Web3Farmyard`,
    description: descriptions[day] || `Day ${day} of the Web3Farmyard onboarding program.`,
    keywords: [
      'web3 learning',
      'onboarding',
      `day ${day}`,
      'crypto tutorial',
      'DeFi education',
    ],
    alternates: {
      canonical: `https://www.web3farmyard.com/onboarding/day-${day}`,
    },
    openGraph: {
      type: 'website',
      title: `${titles[day]} | Web3Farmyard`,
      description: descriptions[day] || `Day ${day} of your Web3 journey`,
      url: `https://www.web3farmyard.com/onboarding/day-${day}`,
    },
  }
}

/**
 * Generate metadata for homepage
 */
export function generateHomepageMetadata(): Metadata {
  return {
    title: 'Web3Farmyard | DeFi Learning, Airdrop Tracker & Crypto Graveyard – Earn While You Learn',
    description:
      'Start your first Web3 farming cycle. Learn DeFi, track live chain data, evaluate airdrops safely, and explore the crypto graveyard. Real on-chain experience for beginners.',
    keywords: [
      'Web3 learning',
      'DeFi beginner',
      'crypto tutorial',
      'airdrop tracker',
      'blockchain education',
      'earn crypto',
      'crypto farming',
    ],
    alternates: {
      canonical: 'https://www.web3farmyard.com',
    },
    openGraph: {
      type: 'website',
      title: 'Web3Farmyard | Learn DeFi & Earn While You Learn',
      description: 'Your guide to DeFi, airdrops, and blockchain security',
      url: 'https://www.web3farmyard.com',
      images: [
        {
          url: 'https://www.web3farmyard.com/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

/**
 * Helper to generate breadcrumb schema for use in script tags
 */
export function generateBreadcrumbSchemaScript(breadcrumbs: Array<{ name: string; url: string }>) {
  return JSON.stringify(generateBreadcrumbListSchema(breadcrumbs))
}