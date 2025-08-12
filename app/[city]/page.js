import { notFound } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getCityBySlug } from '../../utils/getCities'
import CityPageClient from './CityPageClient'

// This generates static paths for all your cities
export async function generateStaticParams() {
  try {
    // Import getAllCities here since this runs at build time
    const { supabase } = await import('../../lib/supabase')
    const { data: cities } = await supabase
      .from('cities')
      .select('slug')
      .eq('is_active', true)

    return cities?.map(city => ({
      city: city.slug,
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Enhanced metadata for each city
export async function generateMetadata({ params }) {
  const cityData = await getCityBySlug(params.city)
  
  if (!cityData) {
    return {
      title: 'City Not Found | MyPollenPal',
      description: 'The requested city page could not be found.',
    }
  }

  // Enhanced SEO metadata
export async function generateMetadata({ params }) {
  const cityData = await getCityBySlug(params.city)
  
  if (!cityData) {
    return {
      title: 'City Not Found | MyPollenPal',
      description: 'The requested city page could not be found.',
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })

  return {
    title: `${cityData.name}, ${cityData.state_code} Pollen Count Today - ${currentDate} | MyPollenPal`,
    description: `Live pollen forecast for ${cityData.name}, ${cityData.state}. Get current tree, grass, and weed pollen levels plus 10-day forecast. Air quality data and personalized allergy alerts included.`,
    keywords: [
      `pollen count ${cityData.name}`,
      `${cityData.name} pollen forecast`,
      `air quality ${cityData.name}`,
      `${cityData.name} allergies`,
      `${cityData.state} pollen levels`,
      `tree pollen ${cityData.name}`,
      `grass pollen ${cityData.name}`,
      `weed pollen ${cityData.name}`,
      `allergy forecast ${cityData.name}`,
      `MyPollenPal ${cityData.name}`
    ].join(', '),
    openGraph: {
      title: `${cityData.name}, ${cityData.state_code} Pollen Forecast | MyPollenPal`,
      description: `Live pollen levels and 10-day forecast for ${cityData.name}, ${cityData.state}. Tree, grass, weed pollen plus air quality data.`,
      type: 'website',
      locale: 'en_US',
      siteName: 'MyPollenPal',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cityData.name}, ${cityData.state_code} Pollen Count Today`,
      description: `Current pollen levels and forecast for ${cityData.name}. Get personalized allergy alerts.`,
    },
    alternates: {
      canonical: `https://mypollenpal.com/${cityData.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': `US-${cityData.state_code}`,
      'geo.placename': `${cityData.name}, ${cityData.state}`,
      'geo.position': cityData.latitude && cityData.longitude ? `${cityData.latitude};${cityData.longitude}` : undefined,
    },
  }
}

export default async function CityPage({ params }) {
  // This now handles both database cities AND dynamic cities
  const cityData = await getCityBySlug(params.city)
  
  if (!cityData) {
    notFound()
  }

  // Add structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${cityData.name}, ${cityData.state_code} Pollen Forecast`,
    "description": `Live pollen levels and air quality data for ${cityData.name}, ${cityData.state}`,
    "url": `https://mypollenpal.com/${cityData.slug}`,
    "about": {
      "@type": "Place",
      "name": `${cityData.name}, ${cityData.state}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityData.name,
        "addressRegion": cityData.state_code,
        "addressCountry": "US"
      },
      ...(cityData.latitude && cityData.longitude && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": cityData.latitude,
          "longitude": cityData.longitude
        }
      })
    },
    "mainEntity": {
      "@type": "Dataset",
      "name": `Pollen Data for ${cityData.name}`,
      "description": "Real-time pollen count and air quality measurements",
      "keywords": "pollen, air quality, allergies, forecast",
      "creator": {
        "@type": "Organization",
        "name": "MyPollenPal"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mypollenpal.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `${cityData.name}, ${cityData.state_code}`,
          "item": `https://mypollenpal.com/${cityData.slug}`
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "MyPollenPal",
      "url": "https://mypollenpal.com"
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <Header />
      <CityPageClient cityData={cityData} />
      <Footer />
    </>
  )
}

// Add revalidation for ISR (Incremental Static Regeneration)
export const revalidate = 86400 // Revalidate once per day (24 hours)

// Add this line to handle dynamic pages (not just static ones)
export const dynamicParams = true

// Keep your existing revalidate
export const revalidate = 86400 // Revalidate once per day (24 hours)
