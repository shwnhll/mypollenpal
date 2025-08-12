import { supabase } from '../lib/supabase'

export async function getAllCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('population', { ascending: false })

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }

  return data
}

export async function getCityBySlug(slug) {
  try {
    // First, try to get from Supabase (your existing cities)
    const { data: city, error } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (city && !error) {
      return city
    }

    // If not found in database, create dynamic city data
    return createDynamicCityData(slug)
    
  } catch (error) {
    console.error('Error in getCityBySlug:', error)
    // Fall back to dynamic city
    return createDynamicCityData(slug)
  }
}

function createDynamicCityData(slug) {
  // Validate slug format (should be like "denver-co" or "new-york-ny")
  if (!slug || !slug.includes('-')) {
    return null
  }

  const parts = slug.split('-')
  if (parts.length < 2) {
    return null
  }

  // Extract state code (last part) and city name (everything else)
  const stateCode = parts.pop().toLowerCase()
  const cityName = parts.join(' ')

  // Validate state code
  if (!isValidStateCode(stateCode.toUpperCase())) {
    return null
  }

  // Create dynamic city object
  return {
    name: formatCityName(cityName),
    state: getStateName(stateCode.toUpperCase()),
    state_code: stateCode.toUpperCase(),
    slug: slug,
    latitude: null,
    longitude: null,
    is_dynamic: true, // Flag to indicate this is a dynamic city
    created_at: new Date().toISOString(),
    is_active: true
  }
}

function formatCityName(cityName) {
  return cityName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function isValidStateCode(code) {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ]
  return validStates.includes(code)
}

function getStateName(stateCode) {
  const stateNames = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  }
  return stateNames[stateCode] || stateCode
}
