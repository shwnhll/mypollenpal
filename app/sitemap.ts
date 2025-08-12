import { MetadataRoute } from 'next'
import { getAllCities } from '../utils/getCities'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all active cities from your database
  const cities = await getAllCities()
  
  // Base URL of your site
  const baseUrl = 'https://mypollenpal.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // City pages from database
  const cityPages = cities.map(city => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...cityPages]
}
