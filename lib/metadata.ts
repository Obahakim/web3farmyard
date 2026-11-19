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
    title: 'DeFi Chain Rankings — TVL, DEX & NFT Volume | Web3Farmyard',
    description:
      'Track DeFi chains ranked by total value locked, 24-hour DEX volume, and 24-hour NFT trading volume. Daily snapshot data from DeFiLlama.',
    keywords: [
      'DeFi rankings',
      'TVL tracker',
      'blockchain rankings',
      'DeFi metrics',
      'NFT trading volume',
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
      description: 'Track DeFi chains by TVL, 24-hour DEX volume, and 24-hour NFT trading volume',
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
      'airdrop safety',
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
    title: 'Web3 Toolkit — Essential Tools for Exploring Web3 | Web3Farmyard',
    description:
      'Curated Web3 tools: wallets, DEXs, bridges, lending protocols, analytics, security resources, and airdrop platforms.',
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
      description: 'A practical toolkit of Web3 wallets, DeFi, analytics, and security tools.',
      url: 'https://www.web3farmyard.com/toolkit',
    },
  }
}

/**
 * Generate metadata for Onboarding pages
 */
export function generateOnboardingMetadata(day: number): Metadata {
  const titles: Record<number, string> = {
    1: 'Day 1: Set Up Your Wallet',
    2: 'Day 2: Make Your First Token Swap',
    3: 'Day 3: Explore Blockchain Bridges',
    4: 'Day 4: Understand DeFi Lending',
    5: 'Day 5: Practice Advanced DeFi',
    6: 'Day 6: Try an On-Chain Quest',
    7: 'Day 7: Review & Plan Your Next Steps',
  }

  const descriptions: Record<number, string> = {
    1: 'Create a wallet, learn how to protect its recovery phrase, and understand the basics of signing in to Web3.',
    2: 'Learn how token swaps work, review transaction details, and understand network fees.',
    3: 'Explore how blockchain bridges move assets between networks and what to consider before using one.',
    4: 'Use a testnet to explore lending protocols and understand how supplying assets and interest work.',
    5: 'Build on your knowledge of swaps, bridges, and lending through guided practice.',
    6: 'Complete a guided on-chain quest and learn how to review the activity it creates.',
    7: 'Review the seven lessons and find safe, useful ways to continue exploring Web3.',
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
    title: 'Web3Farmyard — Learn to Navigate Web3 in 7 Simple Steps',
    description:
      'A beginner-friendly Web3 onboarding platform with seven clear steps, practical guides, DeFi rankings, airdrop information, and useful tools.',
    keywords: [
      'Web3 learning',
      'DeFi beginner',
      'crypto tutorial',
      'airdrop tracker',
      'blockchain education',
      'crypto education',
    ],
    alternates: {
      canonical: 'https://www.web3farmyard.com',
    },
    openGraph: {
      type: 'website',
      title: 'Web3Farmyard — Learn Web3 in 7 Simple Steps',
      description: 'Beginner-friendly lessons, practical guides, market data, and tools for exploring Web3.',
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