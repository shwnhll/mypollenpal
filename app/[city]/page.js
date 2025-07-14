import { notFound } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getCityBySlug } from '../../utils/getCities'
import CityPageClient from './CityPageClient'

// This generates static paths for all your cities
export async function generateStaticParams() {
  // Import getAllCities here since this runs at build time
  const { supabase } = await import('../../lib/supabase')
  const { data: cities } = await supabase
    .from('cities')
    .select('slug')
    .eq('is_active', true)

  return cities?.map(city => ({
    city: city.slug,
  })) || []
}

// Dynamic metadata for each city
export async function generateMetadata({ params }) {
  const cityData = await getCityBySlug(params.city)
  
  if (!cityData) {
    return {
      title: 'City Not Found | MyPollenPal',
    }
  }

  return {
    title: `Pollen Count ${cityData.name}, ${cityData.state_code} Today | MyPollenPal`,
    description: `Get today's pollen levels and air quality for ${cityData.name}, ${cityData.state}. Tree, grass, and weed pollen forecasts with personalized allergy alerts.`,
    keywords: `pollen count ${cityData.name}, air quality ${cityData.name}, ${cityData.name} allergies, ${cityData.state} pollen forecast`,
  }
}

export default async function CityPage({ params }) {
  // Get city info from database (server-side)
  const cityData = await getCityBySlug(params.city)
  
  if (!cityData) {
    notFound()
  }

  return (
    <>
      <Header />
      <CityPageClient cityData={cityData} />
      <Footer />
    </>
  )
}
