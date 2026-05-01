/**
 * JSON-LD Schema Markup Generators
 * Used to generate structured data for Google rich results
 */

export interface SchemaBreadcrumb {
  name: string
  url: string
}

/**
 * Generate BreadcrumbList schema (appears in search results as breadcrumb navigation)
 * @param items Array of {name, url} breadcrumb items
 */
export function generateBreadcrumbListSchema(items: SchemaBreadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': item.url,
    })),
  }
}

/**
 * Generate FAQPage schema (enables featured snippet for FAQ sections)
 * @param faqs Array of {question, answer} pairs
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}

/**
 * Generate Article schema (for blog posts)
 * @param article Object with title, description, image, datePublished, author, etc.
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': article.title,
    'description': article.description,
    'image': article.image || 'https://www.web3farmyard.com/og-image.png',
    'datePublished': article.datePublished,
    'dateModified': article.dateModified || article.datePublished,
    'author': {
      '@type': 'Organization',
      'name': article.author || 'Web3Farmyard',
    },
    'url': article.url,
  }
}

/**
 * Generate Dataset schema (for pages publishing data like TVL tracking)
 * Helps Google understand you're publishing structured data for discovery
 */
export function generateDatasetSchema(dataset: {
  name: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  creator?: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    'name': dataset.name,
    'description': dataset.description,
    'url': dataset.url,
    'datePublished': dataset.datePublished,
    'dateModified': dataset.dateModified,
    'creator': {
      '@type': 'Organization',
      'name': dataset.creator || 'Web3Farmyard',
    },
    'keywords': (dataset.keywords || []).join(', '),
  }
}

/**
 * Generate Organization schema (for homepage)
 * Helps Google understand your brand
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Web3Farmyard',
    'url': 'https://www.web3farmyard.com',
    'logo': 'https://www.web3farmyard.com/logo.png',
    'description': 'Learn DeFi, farm airdrops, and explore live blockchain data with Web3Farmyard',
    'sameAs': [
      'https://twitter.com/web3farmyard',
      'https://discord.gg/web3farmyard',
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'email': 'support@web3farmyard.com',
      'contactType': 'Customer Support',
    },
  }
}

/**
 * Generate aggregate rating schema for comparison/review contexts
 */
export function generateAggregateRatingSchema(rating: {
  ratingValue: number
  ratingCount: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    'ratingValue': rating.ratingValue,
    'ratingCount': rating.ratingCount,
  }
}
