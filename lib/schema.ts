/**
 * JSON-LD Schema Markup Generators
 * Used to generate structured data for Google rich results
 */

export interface SchemaBreadcrumb {
  name: string
  url: string
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
}, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
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
}, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
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
export function generateOrganizationSchema(includeContext = true) {
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

export interface SchemaWebPageImage {
  url: string
  width?: number
  height?: number
}

export interface SchemaWebPageOptions {
  id?: string
  url: string
  name: string
  description: string
  isPartOfId?: string
  primaryImage?: SchemaWebPageImage
  datePublished?: string
  dateModified?: string
  inLanguage?: string
}

export function generateWebPageSchema(options: SchemaWebPageOptions, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'WebPage',
    '@id': options.id,
    url: options.url,
    name: options.name,
    description: options.description,
    isPartOf: options.isPartOfId ? { '@id': options.isPartOfId } : undefined,
    primaryImageOfPage: options.primaryImage
      ? {
          '@type': 'ImageObject',
          url: options.primaryImage.url,
          width: options.primaryImage.width,
          height: options.primaryImage.height,
        }
      : undefined,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    inLanguage: options.inLanguage,
  }
}

export interface SchemaWebSiteOptions {
  url: string
  name: string
  description?: string
  publisherId?: string
  searchUrlTemplate?: string
}

export function generateWebSiteSchema(options: SchemaWebSiteOptions, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'WebSite',
    url: options.url,
    name: options.name,
    description: options.description,
    publisher: options.publisherId ? { '@type': 'Organization', '@id': options.publisherId } : undefined,
    potentialAction: options.searchUrlTemplate
      ? {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: options.searchUrlTemplate,
          },
          'query-input': 'required name=search_term_string',
        }
      : undefined,
  }
}

export interface SchemaCourseInstance {
  name: string
  url: string
  duration?: string
}

export interface SchemaCourseOptions {
  id?: string
  name: string
  description: string
  providerId: string
  authorName: string
  coursePrerequisites?: string
  hasCourseInstance?: SchemaCourseInstance[]
  educationLevel?: string
  inLanguage?: string
  isAccessibleForFree?: boolean
  aggregateRating?: { ratingValue: number; ratingCount: number }
}

export function generateCourseSchema(options: SchemaCourseOptions, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'Course',
    '@id': options.id,
    name: options.name,
    description: options.description,
    provider: {
      '@type': 'Organization',
      '@id': options.providerId,
    },
    author: {
      '@type': 'Organization',
      name: options.authorName,
    },
    coursePrerequisites: options.coursePrerequisites,
    hasCourseInstance: options.hasCourseInstance,
    educationLevel: options.educationLevel,
    inLanguage: options.inLanguage,
    isAccessibleForFree: options.isAccessibleForFree,
    aggregateRating: options.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: options.aggregateRating.ratingValue,
          ratingCount: options.aggregateRating.ratingCount,
        }
      : undefined,
  }
}

export interface SchemaListItem {
  name: string
  url: string
}

export function generateItemListSchema(items: SchemaListItem[], includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: item.url,
      name: item.name,
    })),
  }
}

export interface SchemaBlogPostingOptions {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName?: string
  publisherName?: string
  articleSection?: string
  mainEntityOfPageId?: string
}

export function generateBlogPostingSchema(options: SchemaBlogPostingOptions, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'BlogPosting',
    headline: options.title,
    description: options.description,
    image: options.image || 'https://www.web3farmyard.com/og-image.png',
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      '@type': 'Organization',
      name: options.authorName || 'Web3Farmyard',
    },
    publisher: {
      '@type': 'Organization',
      name: options.publisherName || 'Web3Farmyard',
      url: 'https://www.web3farmyard.com',
    },
    url: options.url,
    mainEntityOfPage: options.mainEntityOfPageId
      ? { '@type': 'WebPage', '@id': options.mainEntityOfPageId }
      : undefined,
    articleSection: options.articleSection,
  }
}

export function generateBreadcrumbListSchema(items: SchemaBreadcrumb[], includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>, includeContext = true) {
  return {
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
