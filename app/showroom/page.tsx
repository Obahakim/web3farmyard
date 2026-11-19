import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllChains } from '@/lib/defillama'
import { generateShowroomMetadata } from '@/lib/metadata'
import {
  generateDatasetSchema,
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from '@/lib/schema'
import ShowroomGrid from './ShowroomGrid'

export const metadata: Metadata = generateShowroomMetadata()

export default async function ShowroomPage() {
  const chains = await getAllChains()

  const datasetSchema = generateDatasetSchema({
    name: 'DeFi Chain TVL, DEX Volume, and NFT Volume Rankings',
    description: 'DeFi chains ranked by TVL, 24-hour DEX trading volume, and 24-hour NFT trading volume',
    url: 'https://www.web3farmyard.com/showroom',
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    creator: 'Web3Farmyard',
    keywords: ['DeFi', 'TVL', 'DEX volume', 'NFT volume', 'blockchain rankings', 'chain metrics'],
  }, false)

  const showroomSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com',
        name: 'Web3Farmyard',
        description: 'Track DeFi chains by TVL, 24-hour DEX volume, and 24-hour NFT trading volume.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/showroom#webpage',
        url: 'https://www.web3farmyard.com/showroom',
        name: 'DeFi Chain Rankings — Web3Farmyard',
        description: 'DeFi chains ranked by TVL, 24-hour DEX volume, and 24-hour NFT trading volume.',
        isPartOfId: 'https://www.web3farmyard.com/#website',
        primaryImage: { url: 'https://www.web3farmyard.com/og-showroom.png', width: 1200, height: 630 },
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
        inLanguage: 'en-US',
      }, false),
      datasetSchema,
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(showroomSchema) }}
      />

      <Nav />

      <div className="showroom-page">
        <div className="showroom-ticker">
          <div className="showroom-ticker-track">
            <span>DEFI LLAMA · DAILY SNAPSHOT · TVL · 24H TVL CHANGE · 24H DEX VOLUME · 24H NFT VOLUME</span>
            <span aria-hidden="true">DEFI LLAMA · DAILY SNAPSHOT · TVL · 24H TVL CHANGE · 24H DEX VOLUME · 24H NFT VOLUME</span>
          </div>
        </div>

        <main className="showroom-content">
          <section className="showroom-hero">
            <div>
              <div className="showroom-kicker">MARKET DATA <span> / </span> CHAIN INDEX</div>
              <h1>Chain market overview</h1>
              <p>
                Compare blockchain ecosystems by total value locked, decentralized exchange activity,
                and NFT trading volume.
              </p>
            </div>
            <div className="showroom-update-card">
              <span className="showroom-update-dot" aria-hidden="true" />
              <div>
                <span>UPDATE CYCLE</span>
                <strong>Every 24 hours</strong>
              </div>
            </div>
          </section>

          <section className="showroom-panel" aria-labelledby="showroom-rankings-heading">
            <div className="showroom-panel-heading">
              <div>
                <span>MARKET OVERVIEW</span>
                <h2 id="showroom-rankings-heading">Top chains</h2>
              </div>
              <p>{chains.length} networks indexed · 50 results per ranking</p>
            </div>
            <ShowroomGrid initialChains={chains} initialUpdatedAt={new Date().toISOString()} />
          </section>

          <section className="showroom-about">
            <span>ABOUT THE DATA</span>
            <h2>One place to compare chain activity.</h2>
            <p>
              Total value locked (TVL) measures assets deposited in DeFi protocols. DEX and NFT
              volumes show reported trading activity over 24 hours. Data is sourced from DeFiLlama
              and the Showroom snapshot refreshes once daily.
            </p>
            <p>
              NFT rankings include only chains with reported NFT trading data. TVL change is shown
              alongside each chain where available.
            </p>
          </section>
        </main>
      </div>

      <Footer />
    </>
  )
}