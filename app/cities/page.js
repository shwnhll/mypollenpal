import Header from '../components/Header'
import Footer from '../components/Footer'
import { getAllCities } from '../../utils/getCities'
import CitiesClient from './CitiesClient'

export const metadata = {
  title: 'Pollen Reports by City | MyPollenPal - Track Allergies Nationwide',
  description: 'Get pollen counts and air quality reports for cities across the United States. Find your city for personalized allergy forecasts and alerts.',
  keywords: 'pollen count by city, air quality cities, allergy forecast locations, pollen tracker USA'
}

export default async function CitiesPage() {
  const cities = await getAllCities()

  return (
    <>
      <Header />
      <CitiesClient cities={cities} />
      <Footer />
    </>
  )
}
