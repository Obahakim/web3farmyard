// Rich static content for chain detail pages
// Built April 2026 — covers all major chains

export interface ChainContent {
  description: string
  launched: string
  consensus: string
  evmCompatible: boolean
  category: string
  highlights: string[]
  website: string
  explorer: string
  why: string      // Why the chain was built
  status: string   // How well it is doing as of April 2026
}

const chains: Record<string, ChainContent> = {
  ethereum: {
    description: "Ethereum is the world's leading smart contract platform and the birthplace of decentralised finance. Launched in 2015 by Vitalik Buterin, it pioneered programmable money and remains the settlement layer for the vast majority of DeFi activity, stablecoins, and NFTs.",
    launched: "July 2015",
    consensus: "Proof of Stake (The Merge, September 2022)",
    evmCompatible: true,
    category: "Layer 1",
    highlights: ["Largest DeFi ecosystem by TVL", "Home to USDC, USDT, DAI", "15,000+ active dApps", "99,000+ active validators"],
    website: "https://ethereum.org",
    explorer: "https://etherscan.io",
    why: "Ethereum was built to extend Bitcoin's vision beyond simple value transfer. Bitcoin proved programmable scarcity was possible; Ethereum proved programmable logic was possible. The founding thesis was that a blockchain with a Turing-complete scripting language could become a decentralised world computer — executing any logic without requiring trust in a central party.",
    status: "As of April 2026, Ethereum remains the undisputed Layer 1 by TVL, holding over $60B in locked value. The Dencun upgrade (March 2024) dramatically reduced Layer 2 fees through proto-danksharding, accelerating adoption of Arbitrum, Base, and Optimism. Ethereum's transition to Proof of Stake has made it deflationary under normal network usage conditions. The roadmap continues through Pectra and Purge upgrades aimed at statelessness and long-term scalability."
  },
  solana: {
    description: "Solana is a high-performance Layer 1 blockchain designed for consumer-grade speed and sub-cent transaction fees. Built by Anatoly Yakovenko and Raj Gokal, it uses a unique Proof of History mechanism to achieve 65,000 theoretical TPS without sharding.",
    launched: "March 2020",
    consensus: "Proof of History + Proof of Stake",
    evmCompatible: false,
    category: "Layer 1",
    highlights: ["Sub-second finality", "~$0.00025 per transaction", "Major memecoin and consumer app hub", "Largest DEX volume outside EVM"],
    website: "https://solana.com",
    explorer: "https://explorer.solana.com",
    why: "Solana was built to solve the impossible triangle of blockchain design — decentralisation, security, and scalability — by betting that single-validator throughput was the right architecture for a chain serving billions of users. The Proof of History invention allowed validators to agree on time without communicating, dramatically reducing coordination overhead.",
    status: "As of April 2026, Solana is in its strongest period since the post-FTX collapse. The Firedancer validator client (Jump Crypto) went live on mainnet, further increasing network resilience. The chain has become the dominant platform for memecoins, consumer payments, and mobile crypto applications. Jupiter Exchange alone processes more swap volume than most EVM chains combined. Monthly active addresses consistently exceed 100 million."
  },
  bsc: {
    description: "BNB Chain (formerly Binance Smart Chain) is an EVM-compatible blockchain built by Binance in 2020. Designed for high throughput and low fees, it sacrifices decentralisation — running with only 21 active validators — to serve retail DeFi users priced out of Ethereum.",
    launched: "September 2020",
    consensus: "Proof of Staked Authority (21 validators)",
    evmCompatible: true,
    category: "Layer 1",
    highlights: ["Second-largest DeFi ecosystem by TVL", "Dominant in Southeast Asia and retail", "PancakeSwap — largest AMM by users", "Sub-$0.01 transactions"],
    website: "https://www.bnbchain.org",
    explorer: "https://bscscan.com",
    why: "BNB Chain was built to give Binance's 150 million users access to DeFi without Ethereum's fees. The decision to clone the Ethereum codebase (EVM compatibility) was deliberate: existing Solidity developers could deploy without modification, accelerating ecosystem growth. The trade-off — 21 centralised validators — was accepted as a pragmatic choice for a chain serving retail, not institutions.",
    status: "As of April 2026, BNB Chain maintains strong retail adoption in Asia and Latin America despite ongoing centralisation criticism. The opBNB Layer 2 has absorbed much of the gaming and NFT traffic. Total ecosystem TVL is approximately $8B. The chain has been plagued by rug pulls but also hosts legitimate protocols like Venus and BiSwap with billions in TVL."
  },
  arbitrum: {
    description: "Arbitrum is the leading Ethereum Layer 2 rollup by TVL, built by Offchain Labs. It uses optimistic rollup technology to inherit Ethereum's security while offering dramatically lower gas costs and faster transaction confirmation.",
    launched: "August 2021",
    consensus: "Optimistic Rollup (settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Largest L2 by TVL consistently", "Home to GMX, Uniswap, Aave", "Arbitrum DAO governs $ARB treasury", "Nitro upgrade reduced fees 10x"],
    website: "https://arbitrum.io",
    explorer: "https://arbiscan.io",
    why: "Arbitrum was built on the insight that Ethereum's compute could be moved off-chain while keeping its security guarantees. The optimistic rollup model — assume all transactions are valid, allow a 7-day challenge window — was chosen over zero-knowledge proofs because it was production-ready sooner and easier for developers to migrate to from Ethereum mainnet.",
    status: "As of April 2026, Arbitrum holds the #1 Layer 2 position by TVL with approximately $18B locked. The Arbitrum Orbit framework has enabled dozens of app-specific chains to settle to Arbitrum rather than Ethereum directly. The $ARB DAO remains one of the largest on-chain treasuries in Web3. Stylus — allowing Rust and C++ smart contracts — opened Arbitrum to non-Solidity developers for the first time."
  },
  base: {
    description: "Base is an Ethereum Layer 2 blockchain built and incubated by Coinbase, launched in August 2023. Built on the OP Stack, Base provides a low-cost, developer-friendly environment for building consumer crypto applications while inheriting Ethereum's security.",
    launched: "August 2023",
    consensus: "Optimistic Rollup (OP Stack, settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Fastest-growing L2 by user count", "Backed by Coinbase's 110M users", "Home to friend.tech, Aerodrome", "OnchainSummer campaigns drove mass adoption"],
    website: "https://base.org",
    explorer: "https://basescan.org",
    why: "Base was built by Coinbase to bridge its 110 million verified users into onchain activity. The thesis was simple: the biggest barrier to crypto adoption is UX, and a chain run by a regulated US company with familiar consumer interfaces could solve that. Base chose the OP Stack (developed by Optimism) to participate in the emerging Superchain ecosystem while contributing to shared sequencer infrastructure.",
    status: "As of April 2026, Base has become the fastest-adopted Layer 2 in Ethereum history. Monthly active addresses exceed 15 million. The chain hosts over $12B in TVL and has become the primary home for social apps, AI-adjacent crypto projects, and Coinbase's own products including Coinbase Wallet and cbBTC. The Superchain interoperability upgrade is live in testnet, aiming to enable seamless asset movement between Base, OP Mainnet, and other OP Stack chains."
  },
  tron: {
    description: "TRON is a blockchain network founded by Justin Sun, focused primarily on stablecoin transfer — particularly USDT — and entertainment content distribution. Despite its controversial origins and centralisation concerns, TRON consistently ranks among the highest-volume chains in the world.",
    launched: "June 2018",
    consensus: "Delegated Proof of Stake (27 Super Representatives)",
    evmCompatible: true,
    category: "Layer 1",
    highlights: ["Largest USDT network by daily transfer volume", "Extremely low fees (<$1 for large transfers)", "Dominant in P2P crypto remittances", "Over $10B USDT circulating"],
    website: "https://tron.network",
    explorer: "https://tronscan.org",
    why: "TRON was built to create a decentralised internet for content creators — a competitor to YouTube and Spotify where creators earn directly. That vision largely failed. What succeeded was the network's efficiency for high-frequency, low-value stablecoin transfers. In markets where USD access is restricted (Iran, Venezuela, parts of Africa), TRON's USDT became a de facto banking system.",
    status: "As of April 2026, TRON remains the #1 network for USDT transfers by volume. Over $50B in USDT sits on TRON. The network processes 5-7 million daily transactions. While DeFi adoption is minimal compared to Ethereum and Solana, TRON's utility as a payment rail is undeniable. Regulatory scrutiny around Justin Sun remains ongoing in multiple jurisdictions."
  },
  optimism: {
    description: "Optimism is an Ethereum Layer 2 using optimistic rollup technology, built by the Optimism Foundation. It is the second-largest L2 by TVL and the foundation of the OP Superchain — a shared infrastructure layer for multiple blockchains including Base, Mode, and others.",
    launched: "December 2021 (mainnet)",
    consensus: "Optimistic Rollup (settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Pioneered retroactive public goods funding", "OP Stack powers Base, Zora, and 20+ chains", "Superchain vision — shared sequencer infrastructure", "Home to Synthetix, Velodrome"],
    website: "https://optimism.io",
    explorer: "https://optimistic.etherscan.io",
    why: "Optimism was built with an explicit public goods thesis: that the most important infrastructure for humanity should be open-source and sustainably funded. The retroactive public goods funding (RetroPGF) model — where the DAO allocates grants based on value already created rather than promised — was an attempt to redesign how open-source projects get paid.",
    status: "As of April 2026, Optimism's own chain (OP Mainnet) holds approximately $8B in TVL and the OP Stack ecosystem collectively processes more transactions than any single L2. The Superchain interoperability upgrade is the most anticipated infrastructure launch in the L2 space. The RetroPGF program has distributed over $100M to public goods contributors."
  },
  polygon: {
    description: "Polygon (PoS) is an EVM-compatible blockchain offering fast, cheap transactions as an Ethereum sidechain. Originally launched as Matic Network in 2019, Polygon expanded into the largest blockchain infrastructure company in the industry, building zero-knowledge proof systems, data availability layers, and enterprise blockchain solutions.",
    launched: "May 2020 (as Matic)",
    consensus: "Proof of Stake (Heimdall + Bor architecture)",
    evmCompatible: true,
    category: "Sidechain / Layer 2",
    highlights: ["Used by Reddit, Disney, Starbucks for blockchain programmes", "Home to Aave v2, QuickSwap", "Polygon zkEVM live on mainnet", "AggLayer connecting multiple chains"],
    website: "https://polygon.technology",
    explorer: "https://polygonscan.com",
    why: "Polygon was built to solve Ethereum's UX problem for everyday users. When CryptoKitties congested Ethereum in 2017 and gas fees made small transactions uneconomical, the Matic team proposed a sidechain with Ethereum's security as a fallback. The vision expanded dramatically — Polygon became an infrastructure provider betting that zero-knowledge proofs would define the next decade of blockchain scaling.",
    status: "As of April 2026, Polygon PoS still holds ~$1.5B in TVL and remains the dominant chain for enterprise blockchain integrations. However, native DeFi activity has migrated substantially to Arbitrum, Base, and Optimism. The POL token migration from MATIC is complete. The AggLayer — Polygon's interoperability layer connecting ZK chains — is live and attracting new rollup deployments."
  },
  avalanche: {
    description: "Avalanche is a high-speed, EVM-compatible Layer 1 blockchain featuring a unique subnet architecture that allows custom blockchains to be created and deployed. Founded by Emin Gün Sirer and built by Ava Labs, it uses a novel Snow consensus protocol achieving sub-second finality.",
    launched: "September 2020",
    consensus: "Snowman (Snow consensus protocol)",
    evmCompatible: true,
    category: "Layer 1",
    highlights: ["Sub-second transaction finality", "Subnet architecture for app-specific chains", "Major institutional DeFi (Trader Joe, Benqi)", "Evergreen subnet for regulated financial institutions"],
    website: "https://avax.network",
    explorer: "https://snowtrace.io",
    why: "Avalanche was built to prove that high performance and decentralisation were not mutually exclusive. The Snow consensus protocol — inspired by gossip protocols rather than leader-based Byzantine fault tolerance — allows sub-second finality with thousands of validators. The subnet model was built to serve regulated industries: banks and financial institutions can run their own permissioned chains that still interoperate with the main network.",
    status: "As of April 2026, Avalanche holds approximately $1.2B in TVL on its C-Chain. The institutional subnet strategy is gaining traction — T. Rowe Price and other asset managers participate in the Evergreen subnet for tokenised securities. Consumer DeFi has been impacted by competition from Base and Arbitrum. AVAX's price performance has been mixed against the broader market."
  },
  sui: {
    description: "Sui is a Layer 1 blockchain built by Mysten Labs, founded by former Meta (Facebook) engineers including Evan Cheng who led the Diem (formerly Libra) blockchain project. It uses the Move programming language and an object-centric data model designed for parallel transaction execution.",
    launched: "May 2023",
    consensus: "Delegated Proof of Stake + Narwhal/Bullshark DAG",
    evmCompatible: false,
    category: "Layer 1",
    highlights: ["Object-based parallel execution model", "Move language for enhanced security", "Sub-second finality at high throughput", "DEEP protocol for native orderbook DEX"],
    website: "https://sui.io",
    explorer: "https://suiscan.xyz",
    why: "Sui was built on a fundamental rethinking of how blockchains represent state. Traditional blockchains store state in accounts; Sui stores state in objects owned by addresses. This object model enables parallel processing of unrelated transactions — if Alice is swapping tokens and Bob is minting an NFT, those operations can execute simultaneously without consensus overhead.",
    status: "As of April 2026, Sui has exceeded all expectations from its 2023 launch. TVL has grown past $2.5B. DEEP (DeepBook's native token) and the DeFi ecosystem around Turbos, Aftermath, and Cetus have become genuinely competitive. Sui's gaming partnerships — particularly with gaming studios building fully on-chain games — differentiate it from Ethereum ecosystem chains."
  },
  aptos: {
    description: "Aptos is a Layer 1 blockchain built by Aptos Labs, founded by Mo Shaikh and Avery Ching, both former Meta engineers who worked on the Diem blockchain. Like Sui, it uses the Move language but takes a different architectural approach with a linear chain structure rather than a DAG.",
    launched: "October 2022",
    consensus: "AptosBFT (DiemBFT variant)",
    evmCompatible: false,
    category: "Layer 1",
    highlights: ["Block-STM parallel execution engine", "Move language security model", "Microsoft Azure integration", "Aptos Pay — real-world payment rails"],
    website: "https://aptoslabs.com",
    explorer: "https://explorer.aptoslabs.com",
    why: "Aptos was built from the learnings of four years spent building Diem at Meta. The team had designed a blockchain intended for billions of users — Aptos inherited that ambition. The Block-STM parallel execution engine, designed to process thousands of transactions simultaneously without conflicting state writes, was the technical core of that ambition.",
    status: "As of April 2026, Aptos holds approximately $1.1B in TVL. The chain has found particular strength in DeFi primitive development — Thala, Aries, and Liquidswap are the leading protocols. Microsoft's Azure infrastructure partnership gives Aptos validator access to enterprise-grade infrastructure. Adoption is steady but less explosive than Sui."
  },
  starknet: {
    description: "StarkNet is an Ethereum Layer 2 using zero-knowledge STARK proofs, built by StarkWare. It uses a custom language called Cairo for smart contract development, offering the highest security guarantees of any L2 through mathematical proof of computation validity.",
    launched: "November 2021 (mainnet alpha)",
    consensus: "ZK-STARK Rollup (settles to Ethereum)",
    evmCompatible: false,
    category: "Layer 2",
    highlights: ["STARK proofs — most secure cryptographic proof system", "Cairo VM — purpose-built for ZK computation", "Account abstraction native to protocol", "Recursive proofs enable infinite scalability"],
    website: "https://starknet.io",
    explorer: "https://starkscan.co",
    why: "StarkWare built StarkNet on the belief that ZK-STARK proofs — which require no trusted setup and rely only on hash functions for security — were the mathematically strongest foundation for a blockchain. Unlike SNARKs (used by zkSync and Polygon), STARKs are quantum-resistant and have proofs that can be recursively composed, meaning one proof can verify millions of computations.",
    status: "As of April 2026, StarkNet holds approximately $800M in TVL and is growing. The STRK token airdrop in 2024 drove significant attention. Ecosystem development has been slower than EVM-compatible L2s due to Cairo's learning curve, but protocols like JediSwap, Ekubo, and zkLend are maturing. The Starknet Foundation's developer grants programme has funded over 400 projects."
  },
  'zksync-era': {
    description: "zkSync Era is an Ethereum Layer 2 using zero-knowledge proofs, built by Matter Labs. It was the first ZK rollup to achieve EVM compatibility — meaning Solidity smart contracts can be deployed without modification — solving the primary adoption barrier for ZK technology.",
    launched: "March 2023",
    consensus: "ZK-SNARK Rollup (PLONK proofs, settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["First EVM-compatible ZK rollup on mainnet", "Native account abstraction", "ZK Stack — framework for ZK-powered chains", "Hyperchains interoperability network"],
    website: "https://zksync.io",
    explorer: "https://explorer.zksync.io",
    why: "Matter Labs built zkSync Era to combine the security of ZK proofs with the developer accessibility of the EVM. Previous ZK rollups required rewriting contracts in custom languages. Era's breakthrough was making the ZK proof system work for arbitrary Solidity code — meaning the entire Ethereum developer ecosystem could deploy with zero modification.",
    status: "As of April 2026, zkSync Era holds approximately $700M in TVL. The ZK token launch disappointed many early users expecting a larger airdrop, creating significant community tension. However, the ZK Stack framework has attracted dozens of new chains deploying as Hyperchains. Matter Labs continues to attract top-tier investors and maintains one of the largest engineering teams in the L2 space."
  },
  blast: {
    description: "Blast is an Ethereum Layer 2 built by Paradigm-backed Blur founder Pacman, focused on native yield for ETH and stablecoins. Unlike other L2s, Blast automatically earns yield on bridged assets through LSTs and T-bills, passing returns to users as a native feature.",
    launched: "February 2024",
    consensus: "Optimistic Rollup (OP Stack, settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Native 4% yield on bridged ETH and USDB", "Controversial early launch with locked funds", "$2.3B TVL at peak", "Strong NFT and gaming ecosystem"],
    website: "https://blast.io",
    explorer: "https://blastscan.io",
    why: "Blast was built on the observation that money sitting in L2 bridges earns zero yield — a massive opportunity cost for users. By integrating with Lido (for ETH staking) and MakerDAO (for USDB stablecoin), Blast's bridge earns yield on all deposited assets and passes it to holders automatically. This yield mechanic became the product's primary differentiator.",
    status: "As of April 2026, Blast holds approximately $1.8B in TVL. The initial controversy — over $2B locked for months before mainnet — has largely been forgotten. The ecosystem has developed a strong identity around yield-bearing games, NFTs, and the Blur NFT marketplace's Blast integration. Native yield continues to function as designed."
  },
  linea: {
    description: "Linea is an Ethereum Layer 2 ZK rollup developed by Consensys — the company behind MetaMask, Infura, and Truffle. It uses a custom zkEVM implementation and benefits from Consensys's existing relationship with millions of MetaMask users.",
    launched: "July 2023",
    consensus: "ZK Rollup (custom zkEVM, settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Built by MetaMask's parent company", "Deep MetaMask wallet integration", "Linea Park onboarding campaigns", "Pantera and backing from major VCs"],
    website: "https://linea.build",
    explorer: "https://lineascan.build",
    why: "Consensys built Linea to create an owned L2 ecosystem connected to MetaMask's 30 million monthly active wallets. The strategic logic: if MetaMask users can be nudged to use Linea by default, the chain acquires a massive distribution advantage without needing to compete purely on technology.",
    status: "As of April 2026, Linea holds approximately $600M in TVL. The MetaMask Swap integration drives significant organic flow. The LINEA token has not yet launched — its anticipated airdrop is one of the most watched upcoming events in the L2 space. Ecosystem growth has been steady through Nile (DEX), LayerBank (lending), and Mendi Finance."
  },
  scroll: {
    description: "Scroll is an Ethereum Layer 2 ZK rollup with a strong focus on open-source development and community governance. Built by a team of Ethereum Foundation researchers, it prioritises technical correctness and decentralisation over speed-to-market.",
    launched: "October 2023",
    consensus: "ZK Rollup (zkEVM, settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Fully open-source ZK circuits", "Strong Ethereum Foundation researcher involvement", "Community-first governance model", "Rigorous audit process before mainnet"],
    website: "https://scroll.io",
    explorer: "https://scrollscan.com",
    why: "Scroll was built by researchers who believed that ZK-proof systems were too important to be proprietary. While StarkWare and Matter Labs built closed-source proof systems, Scroll's circuits, prover code, and verifier contracts are all fully open-source — enabling anyone to audit, fork, or contribute to the security model.",
    status: "As of April 2026, Scroll holds approximately $800M in TVL and has built a loyal developer community. The SCR token launched in October 2024. The focus on correctness over speed has paid off — Scroll has had zero security incidents since mainnet launch. The chain is growing steadily if not explosively."
  },
  mantle: {
    description: "Mantle is an Ethereum Layer 2 backed by BitDAO (now Mantle DAO) with one of the largest treasuries in the L2 space. Built on the OP Stack, Mantle differentiates through a separate data availability layer (EigenDA) and its substantial treasury-funded ecosystem incentives.",
    launched: "July 2023",
    consensus: "Optimistic Rollup (modified OP Stack + EigenDA)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["$3B+ treasury for ecosystem funding", "EigenDA for cheaper data availability", "mETH Protocol — largest ETH LST on Mantle", "Strong gaming and DeFi incentives"],
    website: "https://mantle.xyz",
    explorer: "https://explorer.mantle.xyz",
    why: "Mantle was built to deploy one of the largest crypto treasuries productively. BitDAO had accumulated billions in BIT tokens but lacked a technical platform for its DeFi vision. By building an L2, Mantle created a chain where its treasury could directly fund the ecosystem it owned — a vertically integrated model unlike any other L2.",
    status: "As of April 2026, Mantle holds approximately $1.5B in TVL. The mETH liquid staking token has become the 4th-largest ETH LST by total value. Treasury-funded campaigns continue to attract developers. The integration with EigenDA has successfully reduced transaction costs compared to calldata-based rollups."
  },
  near: {
    description: "NEAR Protocol is a Layer 1 blockchain using sharding to achieve high throughput. Founded by Illia Polosukhin and Alexander Skidanov (former Google engineers), NEAR introduced Nightshade sharding — the first production sharding implementation on a major blockchain.",
    launched: "October 2020",
    consensus: "Nightshade (sharded Proof of Stake)",
    evmCompatible: false,
    category: "Layer 1",
    highlights: ["Production sharding — scales with more validators", "Aurora EVM layer for Solidity contracts", "Human-readable account names", "Chain Abstraction — interact with any chain from NEAR"],
    website: "https://near.org",
    explorer: "https://nearblocks.io",
    why: "NEAR was built on the conviction that sharding — splitting the blockchain's state and computation across multiple parallel shards — was the only architecture that could scale to billions of users without sacrificing decentralisation. The team chose usability as a first principle: NEAR accounts use human-readable names (alice.near) instead of cryptographic hashes.",
    status: "As of April 2026, NEAR holds approximately $400M in TVL and has pivoted strongly to AI infrastructure. The Bitte AI agent marketplace on NEAR has attracted significant developer attention. Chain Abstraction — the ability to sign transactions on any chain using a NEAR account — is the most compelling technical differentiator in NEAR's current roadmap."
  },
  ton: {
    description: "TON (The Open Network) is a blockchain originally designed by Telegram's founders Pavel and Nikolai Durov. After the SEC forced Telegram to abandon the project in 2020, the open-source community continued development. Its deep integration with Telegram's 900 million users makes TON the blockchain with the largest potential non-crypto user base.",
    launched: "November 2019 (community launch after Telegram exit)",
    consensus: "Byzantine Fault Tolerant Proof of Stake",
    evmCompatible: false,
    category: "Layer 1",
    highlights: ["Native Telegram wallet integration", "900M+ Telegram users as potential reach", "Notcoin — first viral Telegram mini-game", "TON DNS and decentralised storage"],
    website: "https://ton.org",
    explorer: "https://tonscan.org",
    why: "TON was designed to be the blockchain layer beneath Telegram — payments, storage, DNS, and smart contracts integrated so deeply into the messaging app that users wouldn't need to know they were using a blockchain. The design spec called for handling Telegram's full transaction load: billions of messages converted to micropayments.",
    status: "As of April 2026, TON holds approximately $600M in DeFi TVL but vastly more in native wallet balances. Notcoin's success and subsequent launches of dozens of Telegram mini-games have driven tens of millions of new crypto wallet creations. The Toncoin payment integration in Telegram has processed billions of dollars in peer-to-peer transfers. Pavel Durov's 2024 arrest in France created temporary uncertainty but the network continued operating without disruption."
  },
  fantom: {
    description: "Fantom is a high-performance, EVM-compatible Layer 1 blockchain using a DAG-based consensus called Lachesis. Founded by South Korean computer scientist Dr. Ahn Byung Ik, it achieved prominence during the 2021 DeFi summer through Fantom Foundation partnerships and Andre Cronje's DeFi protocols.",
    launched: "December 2019",
    consensus: "Lachesis (Directed Acyclic Graph aBFT)",
    evmCompatible: true,
    category: "Layer 1",
    highlights: ["Sub-second transaction finality", "Formerly home to Yearn, Curve, SushiSwap", "Sonic upgrade launched 2025", "Andre Cronje returned as lead developer"],
    website: "https://fantom.foundation",
    explorer: "https://ftmscan.com",
    why: "Fantom was built to solve the 'oracle problem' in supply chain management — verifying real-world data on a blockchain at speed. The pivot to DeFi infrastructure came later when the team recognised that financial applications needed the same properties: speed, finality, and low cost. The Lachesis DAG consensus was chosen for its ability to achieve finality in milliseconds without sacrificing Byzantine fault tolerance.",
    status: "As of April 2026, Fantom is undergoing its most significant evolution through the Sonic upgrade — a complete VM rebuild offering 2,000 TPS with sub-second finality and full EVM compatibility. The FTM → S token migration is in progress. Andre Cronje's return has re-energised the developer community. TVL sits at approximately $300M, below the 2021 peak but growing under the Sonic incentive programme."
  },
  injective: {
    description: "Injective is a Cosmos-based Layer 1 blockchain purpose-built for financial applications. It features a native order book module, cross-chain bridging, and CosmWasm smart contracts, designed to host DEXs, options markets, prediction markets, and other financial primitives natively.",
    launched: "October 2021",
    consensus: "Tendermint BFT (Cosmos SDK)",
    evmCompatible: false,
    category: "Layer 1",
    highlights: ["Native on-chain order book module", "Cross-chain with Ethereum, Cosmos, Solana", "INJ deflationary via weekly burn", "Helix — largest decentralised derivatives exchange"],
    website: "https://injective.com",
    explorer: "https://explorer.injective.network",
    why: "Injective was built to create a blockchain where financial markets are native primitives — not smart contracts running on top of a general-purpose VM. Having order books built into the protocol rather than implemented in Solidity means better performance, lower latency, and no MEV (Miner Extractable Value) from front-running.",
    status: "As of April 2026, Injective holds approximately $500M in TVL and has established itself as the leading Cosmos-based DeFi chain. Helix Exchange processes hundreds of millions in daily derivatives volume. The weekly INJ burn mechanism has made the token deflationary. Black Panther and the Injective Foundation are actively expanding into Real World Asset trading infrastructure."
  },
  osmosis: {
    description: "Osmosis is the leading decentralised exchange and DeFi hub of the Cosmos ecosystem, built as an application-specific chain using the Cosmos SDK. It enables cross-chain swaps between any IBC-connected blockchain without bridges — using native inter-blockchain communication.",
    launched: "June 2021",
    consensus: "Tendermint BFT (Cosmos SDK)",
    evmCompatible: false,
    category: "Application Chain",
    highlights: ["Leading DEX in the Cosmos ecosystem", "IBC-native — no bridges required for 100+ chains", "Supercharged liquidity pools", "Mars Protocol integrated lending"],
    website: "https://osmosis.zone",
    explorer: "https://www.mintscan.io/osmosis",
    why: "Osmosis was built to be the liquidity layer of the Cosmos multichain ecosystem. Unlike DEXs on Ethereum that share a chain with all other applications, Osmosis's application-specific chain dedicates all block space and validator attention to AMM operations — reducing slippage and enabling more sophisticated pool designs.",
    status: "As of April 2026, Osmosis processes over $100M in daily volume and hosts approximately $300M in liquidity. The Supercharged concentrated liquidity upgrade has significantly improved capital efficiency. Osmosis remains the primary routing hub for ATOM, OSMO, and the 100+ IBC-connected assets in the Cosmos ecosystem."
  },
  celo: {
    description: "Celo is an EVM-compatible Layer 1 blockchain designed for mobile-first financial inclusion. Originally a standalone chain, Celo completed its migration to an Ethereum Layer 2 (using OP Stack) in 2024, aiming to combine its mobile accessibility with Ethereum's security and liquidity.",
    launched: "April 2020 (mainnet); 2024 as L2",
    consensus: "OP Stack Rollup (post-2024 migration)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Mobile-first design — phone number identity", "cUSD, cEUR, cBRL native stablecoins", "Strong adoption in Africa and Latin America", "Climate-positive blockchain (carbon offset)"],
    website: "https://celo.org",
    explorer: "https://celoscan.io",
    why: "Celo was built for the 1.4 billion people with smartphones but without bank accounts. By allowing wallet addresses to be linked to phone numbers and running validators on consumer hardware, Celo made the barrier to entry lower than any other chain. The built-in stablecoin mechanism and fee payment in native stablecoins further simplified the user experience.",
    status: "As of April 2026, Celo's L2 migration is complete. The chain processes significant volumes of micro-transactions, particularly in Kenya and Colombia. Valora, the primary mobile wallet, has millions of active users. TVL on the migrated L2 is approximately $100M, smaller than mainnet peaks but more sustainable."
  },
  polygon_zkevm: {
    description: "Polygon zkEVM is a ZK-powered Ethereum Layer 2 built by Polygon Labs, achieving full EVM equivalence using zero-knowledge proofs. It is part of Polygon's broader AggLayer strategy to connect multiple ZK-powered chains under unified bridging infrastructure.",
    launched: "March 2023",
    consensus: "ZK Rollup (custom zkEVM, settles to Ethereum)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Type 2 ZK-EVM — highest level of EVM equivalence", "Part of Polygon AggLayer interoperability", "POL token replacement for MATIC", "Unified bridge with Polygon PoS"],
    website: "https://polygon.technology/polygon-zkevm",
    explorer: "https://zkevm.polygonscan.com",
    why: "Polygon zkEVM was built to give the Polygon ecosystem a ZK foundation after years of operating as a PoS sidechain. The Type 2 zkEVM approach — proving EVM bytecode rather than a new VM — means existing Ethereum contracts are mathematically proven correct, not just compatible.",
    status: "As of April 2026, Polygon zkEVM holds approximately $300M in TVL. Adoption has been solid from existing Polygon PoS ecosystem protocols migrating. The AggLayer is the more strategically significant development — connecting zkEVM, PoS, and third-party ZK chains into a unified interoperability layer."
  },
  mode: {
    description: "Mode is an Ethereum Layer 2 built on the OP Stack, focused on DeFi and incorporating a native fee-sharing mechanism that returns a portion of sequencer revenue to protocols and users. It is part of the Optimism Superchain.",
    launched: "January 2024",
    consensus: "Optimistic Rollup (OP Stack)",
    evmCompatible: true,
    category: "Layer 2",
    highlights: ["Native sequencer fee sharing with dApps", "Superchain member", "Strong DeFi incentive programmes", "Ionic — leading lending protocol"],
    website: "https://mode.network",
    explorer: "https://explorer.mode.network",
    why: "Mode was built on the insight that L2s extract value from their ecosystems without returning it. The fee-sharing model gives protocols a percentage of the sequencer revenue they generate — creating a direct financial incentive to build on Mode that other L2s don't offer.",
    status: "As of April 2026, Mode holds approximately $200M in TVL. The sequencer revenue sharing has attracted a dedicated DeFi ecosystem. The MODE token airdrop drove significant initial attention. Mode is a smaller but growing member of the Superchain ecosystem."
  }
}

export function getChainContent(name: string): ChainContent | null {
  const key = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  const altKey = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return chains[key] || chains[altKey] || chains[name.toLowerCase()] || null
}

export function generateGenericDescription(chain: { name: string; tvl: number; protocols?: number | null }): ChainContent {
  const tvlStr = chain.tvl > 1e9
    ? `$${(chain.tvl / 1e9).toFixed(1)}B`
    : `$${(chain.tvl / 1e6).toFixed(0)}M`

  return {
    description: `${chain.name} is an active blockchain network tracked by DeFiLlama with ${tvlStr} in total value locked across its DeFi ecosystem. ${chain.protocols ? `The chain hosts ${chain.protocols} active protocols spanning lending, DEXs, yield aggregation, and liquid staking.` : 'The chain hosts multiple active DeFi protocols.'}`,
    launched: 'See official documentation',
    consensus: 'See official documentation',
    evmCompatible: false,
    category: 'Blockchain',
    highlights: [
      `${tvlStr} total value locked`,
      chain.protocols ? `${chain.protocols} active protocols` : 'Active DeFi ecosystem',
      'Daily metrics tracked by DeFiLlama',
    ],
    website: `https://${chain.name.toLowerCase().replace(/\s+/g, '')}.com`,
    explorer: 'See official documentation',
    why: `${chain.name} was designed to serve as infrastructure for decentralised applications. Like all public blockchains, it provides a permissionless, censorship-resistant platform where developers can build and users can transact without intermediaries.`,
    status: `As of April 2026, ${chain.name} has ${tvlStr} in total value locked, indicating active usage across its DeFi ecosystem. The chain continues operating and attracting protocol deployments.`
  }
}

export default chains
