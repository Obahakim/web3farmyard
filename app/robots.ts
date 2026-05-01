import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/hakim', '/api-proxy.php'] },
    ],
    sitemap: 'https://www.web3farmyard.com/sitemap.xml',
    host: 'https://www.web3farmyard.com',
  }
}
