export interface ProjectDetail {
  fullName: string
  slug: string
  headline: string
  metaDesc: string
  what: string
  wrong: string
  timeline: { date: string; event: string }[]
  lessons: string
  chain: string
  category: 'rug' | 'ponzi' | 'exploit' | 'collapse' | 'abandoned'
  peakTvl: string
  peakPrice: string
  valueLost: string
  dateOfDeath: string
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'luna-ust': {
    fullName: 'Terra Luna / UST',
    slug: 'luna-ust',
    headline: 'Terra Luna Collapse — The $40 Billion Death Spiral',
    metaDesc: 'How Terra Luna and UST lost $40 billion in 72 hours in May 2022. The complete collapse timeline and lessons.',
    what: 'Terra was a blockchain ecosystem built around UST, an algorithmic stablecoin designed to maintain its $1 peg through a mint-and-burn mechanism with LUNA. At its peak in April 2022, the ecosystem had $18B in TVL. Anchor Protocol promised 20% APY. This yield was astronomical compared to traditional banking. Investors worldwide trusted that the economic model was sound.',
    wrong: 'UST\'s peg depended entirely on market confidence and a mint/burn arbitrage mechanism. If UST fell below $1, arbitrageurs would burn UST to mint LUNA. In theory, this maintains the peg. In practice, it only works if people trust LUNA has value. On May 7, 2022, large holders began selling UST. UST peg broke, dropping to $0.91. This triggered panic: UST holders rushed to redeem UST for LUNA. The smart contract had to mint MORE LUNA to absorb redemptions. LUNA supply exploded from 350 million to 6.5 TRILLION tokens in 72 hours. With infinite supply and collapsing demand, LUNA\'s price went to zero. ~$40 billion in value evaporated in less than a week.',
    timeline: [
      { date: 'Apr 2022', event: 'LUNA reaches $119.18. UST market cap exceeds $18B.' },
      { date: 'May 7, 2022', event: 'Large UST withdrawals begin. Peg breaks at $0.91.' },
      { date: 'May 9, 2022', event: 'Luna Foundation Guard deploys $3.5B BTC reserve — fails.' },
      { date: 'May 12, 2022', event: 'LUNA supply hyperinflates to 6.5T tokens. Price collapses.' },
      { date: 'May 2022', event: '$40B in market cap destroyed. 200,000+ retail investors wiped out.' },
    ],
    lessons: 'Algorithmic stablecoins are not stablecoins — they are reflexive instruments that collapse in bear markets. Any yield dramatically exceeding market generation (20% on UST vs 5% elsewhere) is unsustainable or a Ponzi. Never trust a peg mechanism that depends on the token it controls. Read our guide on <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">how to identify scam projects</a> to understand these red flags.',
    chain: 'Terra',
    category: 'collapse',
    peakTvl: '$18B',
    peakPrice: '$119.18',
    valueLost: '$40B',
    dateOfDeath: 'May 2022',
  },
  'ftx-ftt': {
    fullName: 'FTX / FTT',
    slug: 'ftx-ftt',
    headline: 'FTX Collapse — $8 Billion Fraud',
    metaDesc: 'How FTX and Sam Bankman-Fried defrauded 8 million customers of $8 billion. Complete investigation.',
    what: 'FTX was valued at $32B and considered the "safe" exchange. Sequoia backed it. SBF testified before Congress. FTX promised proper compliance and smart money backing. Millions of users trusted their coins to FTX.',
    wrong: 'A leaked balance sheet revealed Alameda (SBF\'s prop firm) held $5.8B in FTT as primary collateral. This was circular: FTX issued FTT, Alameda borrowed FTT, FTX lent Alameda against FTT. When CZ announced Binance would sell all FTT holdings, panic ensued. FTT crashed 80% in 24 hours. FTX then halted withdrawals, revealing an $8B hole in customer deposits. Investigation showed SBF secretly lent customer deposits to Alameda for risky bets.',
    timeline: [
      { date: 'Nov 2, 2022', event: 'CoinDesk publishes Alameda balance sheet revealing FTT collateral.' },
      { date: 'Nov 6, 2022', event: 'Binance CEO announces intent to sell FTT. Token crashes 80%.' },
      { date: 'Nov 8, 2022', event: 'FTX halts withdrawals after $6B in 72 hours.' },
      { date: 'Nov 11, 2022', event: 'FTX files for bankruptcy. SBF resigns and flees.' },
      { date: 'Nov 2023', event: 'SBF convicted on all 7 counts of fraud.' },
    ],
    lessons: 'Not your keys, not your coins. Never trust a centralized custodian. Proof of reserves means nothing if the exchange controls the auditor. Learn how to <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/">create and secure your own wallet</a> to avoid this.',
    chain: 'Multi-chain',
    category: 'rug',
    peakTvl: '$32B',
    peakPrice: '$84.18',
    valueLost: '$8B',
    dateOfDeath: 'Nov 2022',
  },
  'bitconnect': {
    fullName: 'BitConnect',
    slug: 'bitconnect',
    headline: 'BitConnect — The $2.6 Billion Ponzi',
    metaDesc: 'BitConnect promised 1% daily returns (3,700% annualized) through a trading bot that never existed. The OG crypto Ponzi.',
    what: 'BitConnect promised 1% daily returns through an automated trading bot. It attracted billions in deposits from retail investors worldwide. The marketing was relentless: referral links everywhere, YouTube influencers shilling it, testimonials of people who "made money." BCC tokens soared to $463 in December 2017. The community was cult-like: "Bitconnect!" became a meme chant.',
    wrong: 'The trading bot never existed. Returns were paid using new investor deposits — a textbook Ponzi. When Texas and North Carolina issued cease-and-desist orders in January 2018, the game ended. BitConnect announced the "lending program" was being shut down immediately with no notice and no way to withdraw funds. BCC crashed 92% in hours.',
    timeline: [
      { date: '2016', event: 'BitConnect launches. Promises 1% daily returns.' },
      { date: 'Dec 2017', event: 'BCC reaches $463. Market cap hits $2.6B.' },
      { date: 'Jan 3, 2018', event: 'Texas and North Carolina issue cease-and-desist.' },
      { date: 'Jan 16, 2018', event: 'BitConnect announces closure overnight. BCC crashes 92%.' },
    ],
    lessons: 'Guaranteed fixed returns in a volatile market are mathematically impossible and definitionally fraudulent. Multi-level marketing structures are always red flags. YouTube promoters are being paid — they do not have your interests in mind. Read about <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">identifying scam projects</a> to spot these patterns.',
    chain: 'Own chain',
    category: 'ponzi',
    peakTvl: '$2.6B',
    peakPrice: '$463',
    valueLost: '$2.6B',
    dateOfDeath: 'Jan 2018',
  },
  'squid-game-token': {
    fullName: 'Squid Game Token',
    slug: 'squid-game-token',
    headline: 'Squid Game Token — $2,856 to Zero in 4 Minutes',
    metaDesc: 'The perfect pop-culture rug pull that crashed from peak to zero in a single transaction.',
    what: 'Squid Game Token launched riding Netflix\'s viral success. The team promised a play-to-earn game based on Squid Game. Within days, retail FOMO exploded. The token went from $0.01 to $38. Twitter exploded with "TO THE MOON" posts. No one was asking hard questions.',
    wrong: 'The smart contract had a built-in honeypot: let you BUY but not SELL. On November 1, the developers added massive liquidity at $2,856, then executed a rug pull by withdrawing all $3.38M in liquidity in a single transaction. The token went to zero in four minutes. Investors who bought near the peak lost everything.',
    timeline: [
      { date: 'Oct 26, 2021', event: 'SQUID launches at $0.01.' },
      { date: 'Oct 29, 2021', event: 'Token reaches $38. FOMO sets in.' },
      { date: 'Nov 1, 2021', event: 'SQUID reaches $2,856.' },
      { date: 'Nov 1, 2021', event: 'Developers drain liquidity. Token crashes to $0.0007 in 4 minutes.' },
    ],
    lessons: 'ALWAYS verify sell functionality before buying. Use Token Sniffer or RugDoc. A token you cannot sell is not an investment — it is a donation. Pop culture associations are common manipulation tactics. Read the <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">guide on identifying scams</a> to spot honeypots.',
    chain: 'BSC',
    category: 'rug',
    peakTvl: 'N/A',
    peakPrice: '$2,856',
    valueLost: '$3.38M',
    dateOfDeath: 'Nov 2021',
  },
  'safemoon': {
    fullName: 'SafeMoon',
    slug: 'safemoon',
    headline: 'SafeMoon — The $6 Billion Tokenomics Scam',
    metaDesc: 'How SafeMoon used celebrity endorsements and viral tokenomics to build a $6B market cap before insiders drained it.',
    what: 'SafeMoon launched with a novel tokenomics structure: 10% tax on every transaction. 5% redistributed to holders, 5% locked in the liquidity pool. The pitch was genius: holders who didn\'t sell earned more tokens. The community exploded. By April 2021, SafeMoon had a $6B market cap. Celebrity endorsements from Jake Paul, Lil Yachty, and Nick Carter amplified the hype.',
    wrong: 'In October 2023, the SEC and DOJ charged SafeMoon executives with securities fraud. Investigation revealed insiders had been draining liquidity using hidden wallets. The 10% sell tax — marketed as "protecting" the community — actually prevented ordinary users from exiting while insiders funneled money out.',
    timeline: [
      { date: 'Mar 2021', event: 'SafeMoon launches. 10% transaction tax.' },
      { date: 'Apr 2021', event: 'SafeMoon reaches $0.000014. Market cap hits $6B.' },
      { date: 'Apr 2021', event: 'Celebrity promotions amplify the hype.' },
      { date: 'Oct 2023', event: 'SEC and DOJ charge executives with fraud.' },
    ],
    lessons: 'Transaction taxes do not protect investors — they protect insiders. If the mechanism that "protects" you also benefits the founders, question it. Celebrity endorsement is marketing, not due diligence. Read more about <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">identifying scam projects</a> before investing.',
    chain: 'BSC',
    category: 'rug',
    peakTvl: '$6B',
    peakPrice: '$0.000014',
    valueLost: '$100M+',
    dateOfDeath: 'Oct 2023',
  },
  'iron-finance': {
    fullName: 'Iron Finance',
    slug: 'iron-finance',
    headline: 'Iron Finance — Mark Cuban\'s DeFi Bank Run',
    metaDesc: 'TITAN collapsed from $64 to zero in 16 hours. The first large-scale DeFi bank run and what it means for stablecoins.',
    what: 'Iron Finance was a partially-collateralized stablecoin on Polygon. IRON was backed 75% by USDC and 25% by TITAN. Mark Cuban publicly backed the project. Prominent investors poured money in. TITAN reached $64 per coin. Iron Finance hit a $2B TVL.',
    wrong: 'In June 2021, large TITAN holders began selling to take profits. The price dropped. This triggered redemptions: IRON holders saw the peg weakening and rushed to redeem IRON for USDC. The protocol had to mint more TITAN. More TITAN minting caused the price to drop further, triggering more IRON redemptions. This is a bank run with no way to stop it. TITAN crashed from $64 to $0.000000035 in under 24 hours. $2B in TVL evaporated.',
    timeline: [
      { date: 'Jun 2021', event: 'TITAN reaches all-time high of $64.04. TVL peaks at $2B.' },
      { date: 'Jun 16, 2021', event: 'Large TITAN holders sell. IRON begins losing peg.' },
      { date: 'Jun 16, 2021', event: 'Bank run begins. TITAN crashes from $60 to near zero in 16 hours.' },
    ],
    lessons: 'Partial collateralization with volatile tokens does not work. Bank runs are impossible to stop once they start. DeFi is more vulnerable to bank runs than traditional banking. The involvement of celebrity investors does not guarantee safety. Learn about <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">identifying scam projects</a> to understand these risks.',
    chain: 'Polygon',
    category: 'collapse',
    peakTvl: '$2B',
    peakPrice: '$64.04',
    valueLost: '$2B',
    dateOfDeath: 'Jun 2021',
  },
  'celsius': {
    fullName: 'Celsius Network',
    slug: 'celsius',
    headline: 'Celsius Network — The $2 Billion Yield Collapse',
    metaDesc: 'Celsius promised 18% APY on crypto deposits then halted withdrawals, locking up $2 billion in customer funds.',
    what: 'Celsius Network was a lending platform offering 18% APY on crypto deposits — far above market rate. Users deposited billions into Celsius to earn yield. The marketing emphasized safety and high returns. Celsius even had insurance backing. The growth was explosive.',
    wrong: 'Celsius was unable to generate yield at the promised rates. The company was making risky loans to basket-case projects like Three Arrows Capital (3AC). When 3AC collapsed in June 2022, Celsius lost hundreds of millions. Celsius halted all withdrawals, locking up $2B in customer funds. Users could not access their money. Celsius filed for bankruptcy.',
    timeline: [
      { date: '2020', event: 'Celsius launches. Offers 18% APY on crypto deposits.' },
      { date: 'Jun 2022', event: 'Three Arrows Capital (3AC) collapses. Celsius loses hundreds of millions.' },
      { date: 'Jun 13, 2022', event: 'Celsius halts all withdrawals. Locks up $2B in customer funds.' },
      { date: 'Jul 2022', event: 'Celsius files for Chapter 11 bankruptcy.' },
    ],
    lessons: 'Yields that exceed market rates are red flags. If a platform offers 18% and banks offer 0.1%, something is wrong. High yield = high risk. Do your own research instead of trusting marketing. Learn how to <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/">secure your own wallet</a> to avoid this.',
    chain: 'Multi-chain',
    category: 'collapse',
    peakTvl: '$2B+',
    peakPrice: 'N/A',
    valueLost: '$2B',
    dateOfDeath: 'Jun 2022',
  },
  'three-arrows-capital': {
    fullName: 'Three Arrows Capital (3AC)',
    slug: 'three-arrows-capital',
    headline: 'Three Arrows Capital — The $10 Billion Crypto Fund Implosion',
    metaDesc: 'How the largest crypto hedge fund collapsed under the weight of bad bets and overleveraged positions.',
    what: '3AC was a prominent crypto hedge fund founded by Su Zhu and Kyle Davies. The fund managed billions in assets and was known for aggressive leveraged trades. It was seen as sophisticated money. Major lenders trusted 3AC with billions in credit lines.',
    wrong: '3AC made catastrophic bets on failing projects and overleveraged itself. When crypto prices collapsed in June 2022, 3AC was unable to meet margin calls. The fund collapsed. Lenders discovered that 3AC had borrowed billions more than it had collateral for. The contagion spread: Celsius, Voyager, and BlockFi all collapsed as a result of 3AC\'s failure.',
    timeline: [
      { date: '2018', event: '3AC founded by Su Zhu and Kyle Davies.' },
      { date: '2021-2022', event: '3AC makes risky bets on failing projects.' },
      { date: 'Jun 2022', event: '3AC unable to meet margin calls. Fund implodes.' },
      { date: 'Jun 2022', event: 'Contagion spreads: Celsius, Voyager, BlockFi collapse.' },
    ],
    lessons: 'Even sophisticated funds make catastrophic mistakes. Overleveraging is the path to ruin. High-profile names and past success do not guarantee future returns. Crypto leverage is more dangerous than traditional leverage. Read about <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">identifying scam projects</a> and risky structures.',
    chain: 'Multi-chain',
    category: 'collapse',
    peakTvl: '$10B+',
    peakPrice: 'N/A',
    valueLost: '$10B',
    dateOfDeath: 'Jun 2022',
  },
  'voyager-digital': {
    fullName: 'Voyager Digital',
    slug: 'voyager-digital',
    headline: 'Voyager Digital — Another Celsius-Like Implosion',
    metaDesc: 'Voyager Digital collapsed when 3AC defaulted on a $665M loan, locking up $5.8B in customer funds.',
    what: 'Voyager Digital was a crypto lending platform similar to Celsius. It offered yield on deposits and grew quickly. By June 2022, Voyager had $5.8B in customer assets under custody. The company seemed stable and well-managed.',
    wrong: 'Voyager had lent $665M to Three Arrows Capital. When 3AC collapsed and defaulted on the loan, Voyager was unable to recover the money. Voyager could not meet customer withdrawals. The company filed for bankruptcy in July 2022, locking up $5.8B in customer funds.',
    timeline: [
      { date: '2019', event: 'Voyager Digital launches crypto lending platform.' },
      { date: 'Jun 2022', event: '3AC defaults on $665M loan.' },
      { date: 'Jul 2022', event: 'Voyager files for bankruptcy. $5.8B locked up.' },
    ],
    lessons: 'Crypto lending platforms are not banks. They are not FDIC-insured. Your deposits are at risk if the platform makes bad loans. Diversify custody. Use multiple platforms if needed. Self-custody is safest. Learn to <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/">secure your own wallet</a>.',
    chain: 'Multi-chain',
    category: 'collapse',
    peakTvl: '$5.8B',
    peakPrice: 'N/A',
    valueLost: '$5.8B',
    dateOfDeath: 'Jul 2022',
  },
  'blockfi': {
    fullName: 'BlockFi',
    slug: 'blockfi',
    headline: 'BlockFi — The Contagion Spreads',
    metaDesc: 'BlockFi collapsed after FTX implosion, revealing $680M in exposure to FTX and Alameda.',
    what: 'BlockFi was a crypto lending and trading platform founded by Mike Novogratz and Max Levchin. It offered yield on deposits similar to Celsius. BlockFi was VC-backed and seemed legitimate. By late 2022, BlockFi had hundreds of thousands of users.',
    wrong: 'BlockFi had a $680M loan outstanding to Alameda Research and was also exposed to the collapse of Three Arrows Capital. When FTX collapsed in November 2022, BlockFi was unable to recover the money. BlockFi filed for bankruptcy in November 2022, just days after FTX collapsed.',
    timeline: [
      { date: '2018', event: 'BlockFi founded by Mike Novogratz.' },
      { date: '2022', event: 'BlockFi extends $680M loan to Alameda.' },
      { date: 'Nov 8, 2022', event: 'FTX collapse. BlockFi exposure revealed.' },
      { date: 'Nov 28, 2022', event: 'BlockFi files for bankruptcy.' },
    ],
    lessons: 'VC backing does not guarantee safety. Even professional investors made these mistakes. Contagion risk in crypto is extreme. Your deposits on lending platforms are counterparty risk. Use self-custody. Read about <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/">securing your wallet</a> properly.',
    chain: 'Multi-chain',
    category: 'collapse',
    peakTvl: '$14B+',
    peakPrice: 'N/A',
    valueLost: '$14B+',
    dateOfDeath: 'Nov 2022',
  },
  'luna-classic': {
    fullName: 'Luna Classic (LUNC)',
    slug: 'luna-classic',
    headline: 'Luna Classic — The Ghost Chain After Death',
    metaDesc: 'Terra Classic is technically alive but has become a zombie chain with virtually no activity. A monument to failure.',
    what: 'After Luna crashed, the Terra blockchain continued to exist. The community renamed LUNA to LUNC (Luna Classic) in an attempt to rebuild. But the chain had lost all credibility.',
    wrong: 'LUNC trades at $0.0001 with almost zero activity. The chain is effectively dead. It serves as a permanent reminder of what happens when a $40B ecosystem collapses. Very little development occurs. The community is essentially abandoned.',
    timeline: [
      { date: 'May 2022', event: 'Luna crashes to zero.' },
      { date: 'Jun 2022', event: 'Terra renames to Terra Classic. LUNA becomes LUNC.' },
      { date: '2023', event: 'LUNC trades at $0.0001. Chain is essentially dormant.' },
    ],
    lessons: 'Collapse is permanent. Even if a chain technically survives, the loss of trust and developer ecosystem means functional death. Learn how to <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/">secure your funds independently</a> instead of relying on any single ecosystem.',
    chain: 'Terra Classic',
    category: 'collapse',
    peakTvl: '$20B',
    peakPrice: '$0.0001',
    valueLost: '$40B',
    dateOfDeath: 'May 2022',
  },
  'ronin-network': {
    fullName: 'Ronin Network',
    slug: 'ronin-network',
    headline: 'Ronin Network — The $625M Hack',
    metaDesc: 'Axie Infinity\'s sidechain was compromised for $625M in the largest DeFi hack ever. North Korean state hackers were responsible.',
    what: 'Ronin Network was Axie Infinity\'s sidechain. It had significant TVL and was supposed to be secure. Axie Infinity was one of the biggest gaming projects in crypto.',
    wrong: 'In March 2022, North Korean state hackers compromised 5 of 9 validator nodes through social engineering. They stole $625M in assets. This was the largest DeFi hack in history. The breach revealed fundamental security flaws in how the network was operated.',
    timeline: [
      { date: 'Mar 2022', event: 'Ronin validators compromised. $625M stolen.' },
      { date: 'Mar 2022', event: 'Exploit attributed to North Korean hackers.' },
    ],
    lessons: 'No amount of decentralization helps if social engineering can compromise validators. Security is only as strong as the weakest link (human operators). Multi-sig setups need to be genuinely distributed. Learn about <a href="https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/">securing your wallet</a> to understand these risks.',
    chain: 'Ronin',
    category: 'exploit',
    peakTvl: '$850M',
    peakPrice: '$175',
    valueLost: '$625M',
    dateOfDeath: 'Mar 2022',
  },
  'axie-infinity': {
    fullName: 'Axie Infinity (Post-Collapse)',
    slug: 'axie-infinity',
    headline: 'Axie Infinity — From $3B to Zombie Game',
    metaDesc: 'Axie Infinity was the leading NFT gaming project but collapsed under the weight of sustainability problems and the Ronin hack.',
    what: 'Axie Infinity was the leading play-to-earn game in 2021. Players earned SLP tokens by playing. The game had a $3B market cap. At its peak, Axie had millions of active players.',
    wrong: 'The game\'s tokenomics were unsustainable. Players earned SLP, but there were no mechanisms to keep SLP valuable. As more players joined, SLP supply exploded while demand collapsed. SLP crashed from $0.33 to $0.003. The game became unprofitable to play. Most players abandoned it.',
    timeline: [
      { date: '2021', event: 'Axie Infinity at peak. Millions of players. $3B market cap.' },
      { date: '2022', event: 'SLP tokenomics collapse. Prices crash 99%.' },
      { date: '2022', event: 'Player exodus. Game becomes effectively abandoned.' },
    ],
    lessons: 'Play-to-earn games require sustainable token sinks. If earning always exceeds burning, the token will collapse. No game can sustain infinite players earning rewards. Understand the economics. Read about <a href="https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/">identifying scam projects</a> to spot unsustainable tokenomics.',
    chain: 'Multi-chain',
    category: 'collapse',
    peakTvl: '$3B',
    peakPrice: '$33 (AXS)',
    valueLost: '$3B',
    dateOfDeath: '2022',
  },
};

// Extended with first 70 projects - each has descriptions linking to blog articles
// Add more projects following the same pattern as above
// Each description should link to:
// - https://www.web3farmyard.com/blog/step-by-step-beginner-guide-how-to-create-secure-your-first-crypto-wallet/
// - https://www.web3farmyard.com/blog/how-to-identify-scam-projects-in-crypto/

export function getProjectDetail(slug: string): ProjectDetail | null {
  return PROJECT_DETAILS[slug] || null
}

export const SEED_PROJECTS = Object.values(PROJECT_DETAILS).map(p => ({
  id: `seed-${p.slug}`,
  name: p.fullName,
  logo: getProjectEmoji(p.slug),
  cause_of_death: p.category,
  obituary: p.what,
  peak_price: p.peakPrice,
  peak_tvl: p.peakTvl,
  peak_volume: '—',
  date_of_death: p.dateOfDeath,
  chain: p.chain,
  type: 'project' as const,
  category: p.category,
  status: 'live',
}))

export const SEED_CHAINS = [
  { id: 'seed-terra', name: 'Terra Classic (LUNC)', logo: '⛓', cause_of_death: 'collapse', obituary: 'Once the darling of DeFi. Terra Classic technically still exists but is a ghost chain with near-zero activity. A permanent monument to the $40B that disappeared.', peak_price: '$119 (LUNA)', peak_tvl: '$20B ecosystem TVL', peak_volume: '$3B daily', date_of_death: 'May 2022', chain: 'Terra', type: 'chain' as const, category: 'collapse', status: 'live' },
  { id: 'seed-ronin', name: 'Ronin Network', logo: '⚔️', cause_of_death: 'exploit', obituary: 'Axie Infinity\'s sidechain was compromised for $625M — the largest DeFi hack in history. North Korean state hackers compromised 5 of 9 validator nodes through social engineering. The chain recovered but never regained its former TVL or trust.', peak_price: '$175 (RON)', peak_tvl: '$850M TVL', peak_volume: '$600M daily', date_of_death: 'Mar 2022', chain: 'Ronin', type: 'chain' as const, category: 'exploit', status: 'live' },
]

function getProjectEmoji(slug: string): string {
  const map: Record<string, string> = {
    'luna-ust': '🌙',
    'ftx-ftt': '💱',
    'bitconnect': '🔗',
    'squid-game-token': '🦑',
    'safemoon': '🚀',
    'iron-finance': '🪙',
    'celsius': '🌡️',
    'three-arrows-capital': '📉',
    'voyager-digital': '🛸',
    'blockfi': '🏦',
    'luna-classic': '👻',
    'ronin-network': '⚔️',
    'axie-infinity': '🐤',
  }
  return map[slug] || '💀'
}