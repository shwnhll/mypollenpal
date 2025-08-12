'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

interface GooglePlace {
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export default function Home() {
  const [pollenData, setPollenData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [forecastData, setForecastData] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [emailSignup, setEmailSignup] = useState({
  email: '',
  location: '',
  isSubmitting: false,
  message: ''
})

  const cities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Indianapolis, IN',
    'Charlotte, NC', 'San Francisco, CA', 'Seattle, WA', 'Denver, CO', 'Boston, MA',
    'El Paso, TX', 'Detroit, MI', 'Nashville, TN', 'Portland, OR', 'Memphis, TN',
    'Oklahoma City, OK', 'Las Vegas, NV', 'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI',
    'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO',
    'Mesa, AZ', 'Virginia Beach, VA', 'Atlanta, GA', 'Colorado Springs, CO', 'Omaha, NE',
    'Raleigh, NC', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN', 'Tulsa, OK',
    'Cleveland, OH', 'Wichita, KS', 'Arlington, TX', 'New Orleans, LA', 'Bakersfield, CA',
    'Tampa, FL', 'Honolulu, HI', 'Aurora, CO', 'Anaheim, CA', 'Santa Ana, CA',
    'St. Louis, MO', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY', 'Pittsburgh, PA',
    'Anchorage, AK', 'Stockton, CA', 'Cincinnati, OH', 'St. Paul, MN', 'Toledo, OH',
    'Greensboro, NC', 'Newark, NJ', 'Plano, TX', 'Henderson, NV', 'Lincoln, NE',
    'Buffalo, NY', 'Jersey City, NJ', 'Chula Vista, CA', 'Fort Wayne, IN', 'Orlando, FL',
    'St. Petersburg, FL', 'Chandler, AZ', 'Laredo, TX', 'Norfolk, VA', 'Durham, NC',
    'Madison, WI', 'Lubbock, TX', 'Irvine, CA', 'Winston-Salem, NC', 'Glendale, AZ',
    'Garland, TX', 'Hialeah, FL', 'Reno, NV', 'Chesapeake, VA', 'Gilbert, AZ',
    'Baton Rouge, LA', 'Irving, TX', 'Scottsdale, AZ', 'North Las Vegas, NV', 'Fremont, CA',
    'Boise, ID', 'Richmond, VA', 'San Bernardino, CA', 'Birmingham, AL', 'Spokane, WA',
    'Rochester, NY', 'Des Moines, IA', 'Modesto, CA', 'Fayetteville, NC', 'Tacoma, WA',
    'Oxnard, CA', 'Fontana, CA', 'Columbus, GA', 'Montgomery, AL', 'Moreno Valley, CA',
    'Shreveport, LA', 'Aurora, IL', 'Yonkers, NY', 'Akron, OH', 'Huntington Beach, CA',
    'Little Rock, AR', 'Augusta, GA', 'Amarillo, TX', 'Glendale, CA', 'Mobile, AL',
    'Grand Rapids, MI', 'Salt Lake City, UT', 'Tallahassee, FL', 'Huntsville, AL', 'Grand Prairie, TX',
    'Knoxville, TN', 'Worcester, MA', 'Newport News, VA', 'Brownsville, TX', 'Overland Park, KS',
    'Santa Clarita, CA', 'Providence, RI', 'Garden Grove, CA', 'Chattanooga, TN', 'Oceanside, CA',
    'Jackson, MS', 'Fort Lauderdale, FL', 'Santa Rosa, CA', 'Rancho Cucamonga, CA', 'Port St. Lucie, FL',
    'Tempe, AZ', 'Ontario, CA', 'Vancouver, WA', 'Cape Coral, FL', 'Sioux Falls, SD',
    'Springfield, MO', 'Peoria, AZ', 'Pembroke Pines, FL', 'Elk Grove, CA', 'Salem, OR',
    'Lancaster, CA', 'Corona, CA', 'Eugene, OR', 'Palmdale, CA', 'Salinas, CA',
    'Springfield, MA', 'Pasadena, CA', 'Fort Collins, CO', 'Hayward, CA', 'Pomona, CA',
    'Cary, NC', 'Rockford, IL', 'Alexandria, VA', 'Escondido, CA', 'McKinney, TX',
    'Kansas City, KS', 'Joliet, IL', 'Sunnyvale, CA', 'Torrance, CA', 'Bridgeport, CT',
    'Lakewood, CO', 'Hollywood, FL', 'Paterson, NJ', 'Naperville, IL', 'Syracuse, NY',
    'Mesquite, TX', 'Dayton, OH', 'Savannah, GA', 'Clarksville, TN', 'Orange, CA',
    'Pasadena, TX', 'Fullerton, CA', 'Killeen, TX', 'Frisco, TX', 'Hampton, VA',
    'McAllen, TX', 'Warren, MI', 'Bellevue, WA', 'West Valley City, UT', 'Columbia, MO',
    'Olathe, KS', 'Sterling Heights, MI', 'New Haven, CT', 'Miramar, FL', 'Waco, TX',
    'Thousand Oaks, CA', 'Cedar Rapids, IA', 'Charleston, SC', 'Visalia, CA', 'Topeka, KS',
    'Elizabeth, NJ', 'Gainesville, FL', 'Thornton, CO', 'Roseville, CA', 'Carrollton, TX',
    'Coral Springs, FL', 'Stamford, CT', 'Simi Valley, CA', 'Concord, CA', 'Hartford, CT',
    'Kent, WA', 'Lafayette, LA', 'Midland, TX', 'Surprise, AZ', 'Denton, TX',
    'Victorville, CA', 'Evansville, IN', 'Santa Clara, CA', 'Abilene, TX', 'Athens, GA',
    'Vallejo, CA', 'Allentown, PA', 'Norman, OK', 'Beaumont, TX', 'Independence, MO',
    'Murfreesboro, TN', 'Ann Arbor, MI', 'Fargo, ND', 'Temecula, CA', 'Lansing, MI'
  ]

  // Handle input changes and filter suggestions
  const handleInputChange = (value: string) => {
    setSearchValue(value)
    
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8) // Show max 8 suggestions
      
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }

  // Handle suggestion selection
  const handleSuggestionClick = (city: string) => {
    setSearchValue(city)
    setShowSuggestions(false)
    setSuggestions([])
  }

  // Load Google Places API - disabled for now
  useEffect(() => {
    // Google Places autocomplete disabled due to API issues
    // Using simple city list instead
  }, []);

 const searchLocation = async () => {
  const location = searchValue.trim()
  
  if (!location) {
    alert('Please enter a location')
    return
  }

  setLoading(true)
  setShowSuggestions(false)

  // Convert location to city-state slug format
  const citySlug = convertLocationToSlug(location)
  
  if (citySlug) {
    // Redirect to the city page
    window.location.href = `/${citySlug}`
  } else {
    setLoading(false)
    alert('Please enter a valid city and state (e.g., "Denver, CO" or "Chicago, IL")')
  }
}

// Helper function to convert user input to URL slug
const convertLocationToSlug = (location: string): string | null => {
  // Remove extra spaces and normalize
  const cleaned = location.trim().toLowerCase()
  
  // Handle various input formats
  let cityPart = ''
  let statePart = ''
  
  // Format: "Denver, CO" or "Denver, Colorado"
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',').map(p => p.trim())
    cityPart = parts[0]
    statePart = parts[1]
  }
  // Format: "Denver CO" (space separated)
  else if (cleaned.includes(' ')) {
    const parts = cleaned.split(' ')
    const lastPart = parts[parts.length - 1]
    
    // Check if last part looks like a state
    if (lastPart.length === 2 || isStateName(lastPart)) {
      statePart = lastPart
      cityPart = parts.slice(0, -1).join(' ')
    } else {
      // Assume it's just a city name, try to match with your cities list
      cityPart = cleaned
    }
  }
  // Just a city name
  else {
    cityPart = cleaned
  }
  
// Convert state to abbreviation if needed
if (statePart) {
  const convertedState = convertToStateCode(statePart)
  if (convertedState) {
    statePart = convertedState
  }
}
  
// If no state provided, try to find it in your cities array
if (!statePart && cityPart) {
  const matchedCity = cities.find(city => {
    const cityName = city.split(',')[0].toLowerCase().trim()
    return cityName === cityPart
  })
  
  if (matchedCity) {
    const parts = matchedCity.split(',')
    cityPart = parts[0].trim().toLowerCase()
    const matchedStatePart = parts[1].trim().toLowerCase()
    const convertedState = convertToStateCode(matchedStatePart)
    if (convertedState) {
      statePart = convertedState
    }
  }
}

if (cityPart && statePart) {
  // Convert to slug format: "denver-co"
  const citySlug = cityPart.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const stateSlug = convertToStateCode(statePart)
  
  if (stateSlug) {
    return `${citySlug}-${stateSlug.toLowerCase()}`
  }
}
  
  return null
}

// Helper to convert state names to codes
const convertToStateCode = (state: string): string | null => {
  const stateMap: { [key: string]: string } = {
    'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar', 'california': 'ca',
    'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de', 'florida': 'fl', 'georgia': 'ga',
    'hawaii': 'hi', 'idaho': 'id', 'illinois': 'il', 'indiana': 'in', 'iowa': 'ia',
    'kansas': 'ks', 'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
    'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms', 'missouri': 'mo',
    'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv', 'new hampshire': 'nh', 'new jersey': 'nj',
    'new mexico': 'nm', 'new york': 'ny', 'north carolina': 'nc', 'north dakota': 'nd', 'ohio': 'oh',
    'oklahoma': 'ok', 'oregon': 'or', 'pennsylvania': 'pa', 'rhode island': 'ri', 'south carolina': 'sc',
    'south dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut', 'vermont': 'vt',
    'virginia': 'va', 'washington': 'wa', 'west virginia': 'wv', 'wisconsin': 'wi', 'wyoming': 'wy',
    'district of columbia': 'dc'
  }
  
  const normalized = state.toLowerCase().trim()
  
  // If it's already a 2-letter code
  if (normalized.length === 2 && /^[a-z]{2}$/.test(normalized)) {
    return normalized
  }
  
  // Look up full state name
  return stateMap[normalized] || null
}

const isStateName = (str: string): boolean => {
  const stateNames = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming', 'district of columbia']
  return stateNames.includes(str.toLowerCase())
}

  const handleEmailSignup = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!emailSignup.email || !emailSignup.location) {
    setEmailSignup(prev => ({
      ...prev,
      message: 'Please fill in both email and location'
    }))
    return
  }

  setEmailSignup(prev => ({ ...prev, isSubmitting: true, message: '' }))

  try {
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert([
        {
          email: emailSignup.email,
          location: emailSignup.location,
          verified: false
        }
      ])

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        setEmailSignup(prev => ({
          ...prev,
          message: 'Email already subscribed!',
          isSubmitting: false
        }))
      } else {
        throw error
      }
    } else {
      setEmailSignup(prev => ({
        ...prev,
        message: '✅ Successfully subscribed!',
        email: '',
        location: '',
        isSubmitting: false
      }))
    }
  } catch (error) {
    console.error('Error:', error)
    setEmailSignup(prev => ({
      ...prev,
      message: 'Something went wrong. Please try again.',
      isSubmitting: false
    }))
  }
}

  const calculateMyPollenPalScore = (treeLevel: number, grassLevel: number, weedLevel: number, aqi: number) => {
  // Get current month for seasonal weighting
  const currentMonth = new Date().getMonth() + 1 // 1-12
  
  // Apply seasonal multipliers
  let adjustedTreeLevel = treeLevel
  let adjustedGrassLevel = grassLevel  
  let adjustedWeedLevel = weedLevel
  
  if (currentMonth >= 3 && currentMonth <= 5) {
    // Spring: Tree pollen peak
    adjustedTreeLevel = Math.min(treeLevel * 1.5, 4)
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    // Summer: Grass pollen peak  
    adjustedGrassLevel = Math.min(grassLevel * 1.5, 4)
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    // Fall: Weed/ragweed peak
    adjustedWeedLevel = Math.min(weedLevel * 1.5, 4)
  }
  
  // Convert AQI to 0-4 scale to match pollen levels
  let aqiLevel = 0
  if (aqi <= 50) aqiLevel = 1
  else if (aqi <= 100) aqiLevel = 2  
  else if (aqi <= 150) aqiLevel = 3
  else if (aqi <= 200) aqiLevel = 4
  else aqiLevel = 4

  // Calculate pollen component (emphasize worst type more)
  const maxPollenLevel = Math.max(adjustedTreeLevel, adjustedGrassLevel, adjustedWeedLevel)
  const avgPollenLevel = (adjustedTreeLevel + adjustedGrassLevel + adjustedWeedLevel) / 3
  const pollenScore = (maxPollenLevel * 0.8 + avgPollenLevel * 0.2)

  // MyPollenPal Score: 70% pollen, 30% air quality, scaled to 10
  const combinedScore = (pollenScore * 0.7 + aqiLevel * 0.3)
  const scaledScore = (combinedScore / 4) * 10
  
  return Math.round(scaledScore)
}
  
  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchLocation()
    }
  }

  const updateDisplay = (data: any) => {
    // Update current day display
    const locationEl = document.getElementById('currentLocation')
    const lastUpdated = document.getElementById('lastUpdated')
    
    if (locationEl) locationEl.textContent = data.location
    if (lastUpdated) {
      const now = new Date()
      const userTime = now.toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
      lastUpdated.textContent = `Last updated: ${userTime}`
    }

    // Update current day pollen data
    if (data.current) {
      updatePollenCard('tree', data.current.tree.level, data.current.tree.status)
      updatePollenCard('grass', data.current.grass.level, data.current.grass.status)
      updatePollenCard('weed', data.current.weed.level, data.current.weed.status)
      
      // Update air quality card
      if (data.current.airQuality) {
        updateAirQualityCard(data.current.airQuality.aqi, data.current.airQuality.status)
      }
      
      // Calculate and display MyPollenPal Score
  const treeLevel = parseInt(data.current.tree.level) || 0
  const grassLevel = parseInt(data.current.grass.level) || 0
  const weedLevel = parseInt(data.current.weed.level) || 0
  const aqi = data.current.airQuality?.aqi || 50

  const myPollenPalScore = calculateMyPollenPalScore(treeLevel, grassLevel, weedLevel, aqi)
  updateMyPollenPalScore(myPollenPalScore)
      
let airQualityLevel = 1;
if (data.current.airQuality && data.current.airQuality.aqi) {
  const aqi = data.current.airQuality.aqi;
  if (aqi <= 50) airQualityLevel = 1;
  else if (aqi <= 100) airQualityLevel = 2;
  else if (aqi <= 150) airQualityLevel = 3;
  else if (aqi <= 200) airQualityLevel = 4;
  else if (aqi <= 300) airQualityLevel = 5;
  else airQualityLevel = 6;
}

updateOverallAdvice(
  parseInt(data.current.tree.level) || 0,
  parseInt(data.current.grass.level) || 0, 
  parseInt(data.current.weed.level) || 0,
  airQualityLevel
)
    }

    // Update 5-day forecast
    if (data.forecast) {
      updateForecast(data.forecast)
    }
  }

  const updatePollenCard = (type: string, level: string, status: string) => {
  const levelNum = parseInt(level) || 0
  let color = '#9ca3af'
  let displayStatus = 'None'
  
  if (levelNum === 0) {
    color = '#9ca3af'
    displayStatus = 'None'
  } else if (levelNum === 1) {
    color = '#10b981'
    displayStatus = 'Low'
  } else if (levelNum === 2) {
    color = '#f59e0b'
    displayStatus = 'Medium'
  } else if (levelNum === 3) {
    color = '#ef4444'
    displayStatus = 'High'
  } else if (levelNum >= 4) {
    color = '#7c2d12'
    displayStatus = 'Very High'
  }

  const ring = document.getElementById(`${type}Ring`)
  const level_el = document.getElementById(`${type}LevelDisplay`)
  const status_el = document.getElementById(`${type}StatusDisplay`)
  const status_span = document.getElementById(`${type}Status`)
  const level_span = document.getElementById(`${type}Level`)
  
  if (ring) ring.setAttribute('stroke', color)
  if (ring) ring.setAttribute('stroke-dasharray', `${(levelNum/4) * 201.06} 201.06`)
  if (level_el) level_el.style.color = color
  if (status_el) status_el.style.color = color
  if (status_span) status_span.textContent = displayStatus  // Use our standardized status
  if (level_span) level_span.textContent = level
}

const updateForecast = (forecast: any[]) => {
  const forecastContainer = document.getElementById('forecastContainer')
  if (!forecastContainer || !forecast) return

  forecastContainer.innerHTML = forecast.map((day: any, index: number) => {
    let date: Date;
    let dateDisplay = 'Invalid Date';
    
    if (day.date && typeof day.date === 'object' && day.date.year) {
      date = new Date(day.date.year, day.date.month - 1, day.date.day)
    } else if (day.date && typeof day.date === 'string') {
      date = new Date(day.date)
    } else {
      date = new Date()
      date.setDate(date.getDate() + index)
    }

    if (!isNaN(date.getTime())) {
      dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const dayName = index === 0 ? 'Today' : (isNaN(date.getTime()) ? 'Day ' + (index + 1) : date.toLocaleDateString('en-US', { weekday: 'short' }))
    const maxLevel = Math.max(
      parseInt(day.tree?.level) || 0,
      parseInt(day.grass?.level) || 0,
      parseInt(day.weed?.level) || 0
    )
    
    let color = '#9ca3af'
    if (maxLevel === 1) color = '#10b981'
    else if (maxLevel === 2) color = '#f59e0b'
    else if (maxLevel === 3) color = '#ef4444'
    else if (maxLevel >= 4) color = '#7c2d12'

        return `
      <div style="
        background: rgba(255, 255, 255, 0.08);
        backdropFilter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 1.5rem 1rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        min-width: 120px;
        max-width: 140px;
      ">
        <div style="font-weight: 600; color: #f5f5f5; margin-bottom: 0.5rem; font-size: 0.9rem;">
          ${dayName}
        </div>
        <div style="font-size: 0.75rem; color: #b8b8b8; margin-bottom: 1rem;">
          ${dateDisplay}
        </div>
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${color};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin: 0 auto 0.5rem;
          font-size: 1.1rem;
        ">
          ${maxLevel}
        </div>
        <div style="font-size: 0.75rem; color: #b8b8b8; line-height: 1.3;">
          Tree: ${day.tree?.level || 0}<br>
          Grass: ${day.grass?.level || 0}<br>
          Weed: ${day.weed?.level || 0}
        </div>
      </div>
    `
  }).join('')
}

  const updateOverallAdvice = (treeLevel: number, grassLevel: number, weedLevel: number, airLevel: number = 1) => {
    const maxPollenLevel = Math.max(treeLevel, grassLevel, weedLevel)
    const maxOverallLevel = Math.max(maxPollenLevel, airLevel)
    const advice_el = document.getElementById('overallAdvice')
    
    let advice = ''
    if (maxOverallLevel === 0 || maxOverallLevel === 1) {
      advice = "Great day for outdoor activities! Low pollen and good air quality."
    } else if (maxOverallLevel === 2) {
      advice = "Good day for most outdoor activities. Some sensitive individuals may experience mild symptoms."
    } else if (maxOverallLevel === 3) {
      advice = "Moderate conditions. Consider taking allergy medication if you're sensitive."
    } else if (maxOverallLevel === 4) {
      advice = "Poor conditions for outdoor activities. Take precautions and consider staying indoors."
    } else {
      advice = "Severe conditions! Stay indoors if possible and take allergy medication."
    }
    
    if (advice_el) advice_el.textContent = advice
  }

  const updateAirQualityCard = (aqi: number, status: string) => {
    // Convert AQI to 1-6 scale for visual consistency
    let level = 1
    if (aqi <= 50) level = 1      // Good
    else if (aqi <= 100) level = 2     // Moderate  
    else if (aqi <= 150) level = 3     // Unhealthy for Sensitive Groups
    else if (aqi <= 200) level = 4     // Unhealthy
    else if (aqi <= 300) level = 5     // Very Unhealthy
    else level = 6                     // Hazardous

    let color = '#10b981' // Default green
    if (level === 1) color = '#10b981'      // Green
    else if (level === 2) color = '#f59e0b' // Yellow
    else if (level === 3) color = '#f59e0b' // Orange
    else if (level === 4) color = '#ef4444' // Red
    else if (level >= 5) color = '#7c2d12'  // Dark red

    const ring = document.getElementById('airRing')
    const level_el = document.getElementById('airLevelDisplay')
    const status_el = document.getElementById('airStatusDisplay')
    const status_span = document.getElementById('airStatus')
    const level_span = document.getElementById('airLevel')
    
    if (ring) ring.setAttribute('stroke', color)
    if (ring) ring.setAttribute('stroke-dasharray', `${(level/6) * 201.06} 201.06`)
    if (level_el) level_el.style.color = color
    if (status_el) status_el.style.color = color
    if (status_span) status_span.textContent = status
    if (level_span) level_span.textContent = aqi.toString()
  }

  const updateMyPollenPalScore = (score: number) => {
  const scoreElement = document.getElementById('myPollenPalScore')
  const adviceElement = document.getElementById('myPollenPalAdvice')
  
  if (scoreElement) scoreElement.textContent = score.toString()
  
  // Updated advice to match your expectations
  let advice = ''
  let color = '#10b981' // Green
  
  if (score <= 3) {
    advice = "Excellent day for outdoor activities!"
    color = '#10b981' // Green
  } else if (score <= 5) {
    advice = "Good day for most outdoor activities. Some sensitive individuals may experience mild symptoms."
    color = '#10b981' // Green
  } else if (score <= 7) {
    advice = "Fair conditions - sensitive individuals take precautions"
    color = '#f59e0b' // Yellow/Orange
  } else if (score <= 9) {
    advice = "Poor conditions - limit outdoor activities"
    color = '#ef4444' // Red
  } else {
    advice = "Severe conditions - stay indoors if possible!"
    color = '#7c2d12' // Dark red
  }
  
  if (adviceElement) {
    adviceElement.textContent = advice
    adviceElement.style.color = color
  }
  
  const scoreCircle = document.getElementById('scoreCircle')
  if (scoreCircle) scoreCircle.style.background = color
}

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#2d3748',
      lineHeight: '1.6',
      minHeight: '100vh'
    }}>
      <style jsx>{`
        .pollen-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin: 2rem 0;
        }

       .pollen-card:hover {
         transform: translateY(-5px);
         box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2) !important;
       }
        
        @media (max-width: 768px) {
          .pollen-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            display: grid !important;
          }
          
          .pollen-card {
            max-width: none !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          
          .email-signup-inline {
            flex-direction: column !important;
          }
          
          .email-signup-inline input,
          .email-signup-inline button {
            width: 100% !important;
            flex: none !important;
            min-width: auto !important;
          }
          
          .email-signup-hero {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .email-signup-hero > div {
            flex: none !important;
            width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .pollen-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .pollen-card {
            padding: 1.5rem 1rem !important;
          }
        }
          
          .forecast-container {
            justify-content: flex-start !important;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .forecast-container::after {
            content: "← Swipe to see more →";
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.75rem;
            color: #9ca3af;
            white-space: nowrap;
          }
          
          .forecast-container {
            position: relative;
            margin-bottom: 2rem;
          }

          .popular-cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.popular-city-card {
  transition: all 0.3s ease;
}

/* Mobile optimizations for popular cities */
@media (max-width: 768px) {
  .popular-cities-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.75rem !important;
  }
  
  .popular-city-card {
    padding: 0.75rem !important;
    min-height: 70px !important;
    font-size: 0.9rem !important;
  }
}

@media (max-width: 480px) {
  .popular-cities-grid {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
  }
  
  .popular-city-card {
    padding: 1rem !important;
    min-height: 60px !important;
  }
}

/* Touch-friendly hover states for mobile */
@media (hover: none) {
  .popular-city-card:active {
    transform: scale(0.98) !important;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%) !important;
  }
}

@keyframes floatSwayLeft {
  0% { 
    transform: translate(0, 0) rotate(0deg); 
    opacity: 0; 
  }
  5% { 
    opacity: 0.8; 
  }
  15% { 
    transform: translate(-30px, -25vh) rotate(60deg); 
    opacity: 1; 
  }
  30% { 
    transform: translate(-60px, -50vh) rotate(140deg); 
    opacity: 1; 
  }
  45% { 
    transform: translate(-90px, -75vh) rotate(220deg); 
    opacity: 1; 
  }
  60% { 
    transform: translate(-120px, -100vh) rotate(300deg); 
    opacity: 1; 
  }
  75% { 
    transform: translate(-150px, -125vh) rotate(380deg); 
    opacity: 0.8; 
  }
  90% { 
    transform: translate(-180px, -150vh) rotate(440deg); 
    opacity: 0.4; 
  }
  100% { 
    transform: translate(-200px, -170vh) rotate(500deg); 
    opacity: 0; 
  }
}

@keyframes floatSwayRight {
  0% { 
    transform: translate(0, 0) rotate(0deg); 
    opacity: 0; 
  }
  5% { 
    opacity: 0.8; 
  }
  15% { 
    transform: translate(30px, -25vh) rotate(60deg); 
    opacity: 1; 
  }
  30% { 
    transform: translate(60px, -50vh) rotate(140deg); 
    opacity: 1; 
  }
  45% { 
    transform: translate(90px, -75vh) rotate(220deg); 
    opacity: 1; 
  }
  60% { 
    transform: translate(120px, -100vh) rotate(300deg); 
    opacity: 1; 
  }
  75% { 
    transform: translate(150px, -125vh) rotate(380deg); 
    opacity: 0.8; 
  }
  90% { 
    transform: translate(180px, -150vh) rotate(440deg); 
    opacity: 0.4; 
  }
  100% { 
    transform: translate(200px, -170vh) rotate(500deg); 
    opacity: 0; 
  }
}
        
        /* Hide Google Maps error dialogs - no longer needed */
      `}</style>
{/* Header */}
<header style={{
  background: 'transparent',
  borderBottom: 'none',
  position: 'absolute',
  width: '100%',
  top: 0,
  zIndex: 100
}}>
  <nav style={{
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '1rem 20px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }}>
    <div style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.5rem',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      mypollenpal
    </div>
  </nav>
</header>

      {/* Hero Section */}
<section style={{
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: 'white',
  padding: '6rem 0 4rem 0',
  position: 'relative',
  overflow: 'hidden'
}}>
<div style={{
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'rgba(212, 175, 55, 0.6)',
  borderRadius: '50%',
  left: '45%',
  top: '100%',  // Start below screen
  animation: 'floatSwayLeft 12s infinite linear'
}}></div>
<div style={{
  position: 'absolute',
  width: '3px',
  height: '3px',
  background: 'rgba(212, 175, 55, 0.5)',
  borderRadius: '50%',
  left: '50%',
  top: '100%',  // Start below screen
  animation: 'floatSwayRight 12s infinite linear',
  animationDelay: '1.5s'
}}></div>
<div style={{
  position: 'absolute',
  width: '5px',
  height: '5px',
  background: 'rgba(212, 175, 55, 0.4)',
  borderRadius: '50%',
  left: '47%',
  top: '100%',  // Start below screen
  animation: 'floatSwayLeft 12s infinite linear',
  animationDelay: '3s'
}}></div>
<div style={{
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'rgba(212, 175, 55, 0.5)',
  borderRadius: '50%',
  left: '53%',
  top: '100%',  // Start below screen
  animation: 'floatSwayRight 12s infinite linear',
  animationDelay: '4.5s'
}}></div>
<div style={{
  position: 'absolute',
  width: '3px',
  height: '3px',
  background: 'rgba(212, 175, 55, 0.6)',
  borderRadius: '50%',
  left: '46%',
  top: '100%',  // Start below screen
  animation: 'floatSwayLeft 12s infinite linear',
  animationDelay: '6s'
}}></div>
<div style={{
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'rgba(212, 175, 55, 0.4)',
  borderRadius: '50%',
  left: '51%',
  top: '100%',  // Start below screen
  animation: 'floatSwayRight 12s infinite linear',
  animationDelay: '7.5s'
}}></div>
<div style={{
  position: 'absolute',
  width: '5px',
  height: '5px',
  background: 'rgba(212, 175, 55, 0.5)',
  borderRadius: '50%',
  left: '48%',
  top: '100%',  // Start below screen
  animation: 'floatSwayLeft 12s infinite linear',
  animationDelay: '9s'
}}></div>
<div style={{
  position: 'absolute',
  width: '3px',
  height: '3px',
  background: 'rgba(212, 175, 55, 0.4)',
  borderRadius: '50%',
  left: '52%',
  top: '100%',  // Start below screen
  animation: 'floatSwayRight 12s infinite linear',
  animationDelay: '10.5s'
}}></div>
  
  {/* Subtle gradient overlay */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 40%, rgba(139, 69, 19, 0.15) 0%, transparent 70%),
      radial-gradient(circle at 70% 60%, rgba(85, 107, 47, 0.2) 0%, transparent 70%)
    `,
    pointerEvents: 'none'
  }}></div>

  <div style={{
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px',
    position: 'relative',
    zIndex: 2
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '3rem',
        fontWeight: '700',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: '1.2'
      }}>
        Will pollen ruin your day?
      </h1>
      <p style={{
        fontSize: '1.1rem',
        marginBottom: '3rem',
        opacity: 0.8,
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#b8b8b8',
        fontWeight: '300'
      }}>
        Your personal pollen companion that delivers hyperlocal forecasts and actionable advice. Never be caught off guard again.
      </p>

<div style={{
  maxWidth: '500px',
  margin: '0 auto',
  position: 'relative'
}}>
  <input 
    id="locationInput"
    type="text" 
    placeholder="Enter your ZIP code or city..."
    value={searchValue}
    onChange={(e) => handleInputChange(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        searchLocation()
      }
    }}
    onFocus={() => {
      if (searchValue && suggestions.length > 0) {
        setShowSuggestions(true)
      }
    }}
    onBlur={() => {
      setTimeout(() => setShowSuggestions(false), 200)
    }}
    style={{
      width: '100%',
      padding: '1rem 1.5rem',
      paddingRight: '120px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '50px',
      outline: 'none',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 255, 255, 0.15)',
      background: 'white',
      color: '#2d3748',
      boxSizing: 'border-box'
    }}
  />
  
  {showSuggestions && suggestions.length > 0 && (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: '120px',
      background: 'rgba(26, 26, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      maxHeight: '300px',
      overflowY: 'auto',
      marginTop: '4px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {suggestions.map((city, index) => (
        <div
          key={index}
          onClick={() => handleSuggestionClick(city)}
          style={{
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            fontSize: '0.9rem',
            color: '#f5f5f5',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          📍 {city}
        </div>
      ))}
    </div>
  )}
  
  <button 
    onClick={searchLocation}
    style={{
      position: 'absolute',
      right: '6px',
      top: '6px',
      bottom: '6px',
      padding: '0 1.5rem',
      background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
      color: '#1a1a1a',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem'
    }}
  >
    {loading ? 'Loading...' : 'Search'}
  </button>
</div>

<div style={{
  fontSize: '0.75rem',
  opacity: 0.7,
  marginTop: '1rem',
  textAlign: 'center',
  color: '#999'
}}>
  Powered by <span style={{ fontWeight: '600' }}>Google</span> • <span style={{ fontWeight: '600' }}>NOAA</span> • <span style={{ fontWeight: '600' }}>EPA</span>
</div>
    </div>
  </div>
</section>

{/* Main Content */}
<section style={{
  padding: '3rem 0',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
}}>
  <div style={{
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px'
  }}>
    {/* Current Pollen Data Card */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '24px',
      padding: '2.5rem',
      marginBottom: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem',
          fontWeight: '700',
          color: '#f5f5f5',
          marginBottom: '0.5rem'
        }} id="currentLocation">
          Carmel, Indiana
        </h2>
        <p style={{
          color: '#b8b8b8',
          fontSize: '0.9rem'
        }} id="lastUpdated">
          Sample data - Enter a location to see real pollen levels
        </p>
      </div>

      {/* MyPollenPal Score Display */}
      {hasSearched && (
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <div style={{
            fontSize: '1.1rem',
            color: '#d4af37',
            fontWeight: '600',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            MyPollenPal Score
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '800'
            }} id="scoreCircle">
              <span id="myPollenPalScore">7</span>
            </div>
            <div style={{
              fontSize: '2.5rem',
              color: '#b8b8b8',
              fontWeight: '300'
            }}>/10</div>
          </div>
          
          <div style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#f5f5f5'
          }} id="myPollenPalAdvice">
            Fair conditions - sensitive individuals take note
          </div>
        </div>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
        margin: '2rem 0'
      }} className="pollen-cards-grid">
        
        {/* Tree Pollen Card */}
        <div className="pollen-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b4513, transparent)'
          }}></div>
          
          <div style={{
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>🌳</div>
          <div style={{
            fontWeight: '600',
            color: '#f5f5f5',
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Tree Pollen</div>
          
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem'
          }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" />
              <circle
                id="treeRing"
                cx="40" cy="40" r="32" fill="none" stroke="#8b4513" strokeWidth="6"
                strokeDasharray="201.06 201.06" strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#cd853f'
            }} id="treeLevelDisplay">
              <span id="treeLevel">4</span>
            </div>
          </div>
          
          <div style={{
            color: '#cd853f',
            fontWeight: '600',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }} id="treeStatusDisplay">
            <span id="treeStatus">Severe</span>
          </div>
        </div>

        {/* Grass Pollen Card */}
        <div className="pollen-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #556b2f, transparent)'
          }}></div>
          
          <div style={{
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>🌱</div>
          <div style={{
            fontWeight: '600',
            color: '#f5f5f5',
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Grass Pollen</div>
          
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem'
          }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" />
              <circle
                id="grassRing"
                cx="40" cy="40" r="32" fill="none" stroke="#556b2f" strokeWidth="6"
                strokeDasharray="100.53 201.06" strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#9acd32'
            }} id="grassLevelDisplay">
              <span id="grassLevel">2</span>
            </div>
          </div>
          
          <div style={{
            color: '#9acd32',
            fontWeight: '600',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }} id="grassStatusDisplay">
            <span id="grassStatus">Medium</span>
          </div>
        </div>

        {/* Weed Pollen Card */}
        <div className="pollen-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #d4af37, transparent)'
          }}></div>
          
          <div style={{
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>🌿</div>
          <div style={{
            fontWeight: '600',
            color: '#f5f5f5',
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Weed Pollen</div>
          
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem'
          }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" />
              <circle
                id="weedRing"
                cx="40" cy="40" r="32" fill="none" stroke="#d4af37" strokeWidth="6"
                strokeDasharray="50.27 201.06" strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#d4af37'
            }} id="weedLevelDisplay">
              <span id="weedLevel">1</span>
            </div>
          </div>
          
          <div style={{
            color: '#d4af37',
            fontWeight: '600',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }} id="weedStatusDisplay">
            <span id="weedStatus">Low</span>
          </div>
        </div>

        {/* Air Quality Card */}
        <div className="pollen-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, transparent)'
          }}></div>
          
          <div style={{
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>🌬️</div>
          <div style={{
            fontWeight: '600',
            color: '#f5f5f5',
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Air<br/>Quality</div>
          
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem'
          }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" />
              <circle
                id="airRing"
                cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="6"
                strokeDasharray="100.53 201.06" strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#10b981'
            }} id="airLevelDisplay">
              <span id="airLevel">51</span>
            </div>
          </div>
          
          <div style={{
            color: '#10b981',
            fontWeight: '600',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }} id="airStatusDisplay">
            <span id="airStatus">Good</span>
          </div>
        </div>
      </div>

      {/* Scale explanation */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#b8b8b8',
        marginTop: '1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <div>📊 Pollen levels use international 0-4 scale</div>
        <div>🌬️ Air quality uses US EPA's AQI standard</div>
      </div>
            
{/* Overall advice section with updated styling */}
{hasSearched && (
<div style={{
  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  color: '#f5f5f5',
  padding: '3rem 2rem',
  textAlign: 'center',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)'
}}>
  <h2 style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}>
      Today's Recommendation
  </h2>  
    <div style={{
      fontSize: '1rem',
      color: '#b8b8b8',
      lineHeight: '1.5',
      marginBottom: '1.5rem'
    }} id="overallAdvice">
  Great day for outdoor activities! Low pollen and good air quality.
</div>
    
    {/* Soft prompt to sign up */}
    <div style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '1.5rem',
      marginTop: '1.5rem'
    }}>
      <a 
        href="#email-signup"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('email-signup')?.scrollIntoView({ behavior: 'smooth' });
        }}
        style={{
          color: '#d4af37',
          textDecoration: 'none',
          fontSize: '0.95rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'opacity 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        Want alerts when pollen spikes? Sign up below ↓
      </a>
    </div>
</div>
)}
            {/* 5-Day Forecast - only show after search */}
            {hasSearched && (
  <div style={{
    marginTop: '2rem'
  }}>
    <h3 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#d4af37',
      marginBottom: '2rem',
      textAlign: 'center'
    }}>
      📅 5-Day Pollen Forecast
    </h3>
    <div style={{
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: '0.5rem 0'
    }} className="forecast-container" id="forecastContainer">
                  {forecastData.length > 0 ? forecastData.map((day, index) => {
                    let date;
                    let dateDisplay = 'Invalid Date';
                    
                    if (day.date && typeof day.date === 'object' && day.date.year) {
                      date = new Date(day.date.year, day.date.month - 1, day.date.day)
                    } else if (day.date && typeof day.date === 'string') {
                      date = new Date(day.date)
                    } else {
                      date = new Date()
                      date.setDate(date.getDate() + index)
                    }

                    if (!isNaN(date.getTime())) {
                      dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }

                    const dayName = index === 0 ? 'Today' : (isNaN(date.getTime()) ? 'Day ' + (index + 1) : date.toLocaleDateString('en-US', { weekday: 'short' }))
                    const maxLevel = Math.max(
                      parseInt(day.tree?.level) || 0,
                      parseInt(day.grass?.level) || 0,
                      parseInt(day.weed?.level) || 0
                    )
                    
                    let color = '#9ca3af'
                    if (maxLevel === 1) color = '#10b981'
                    else if (maxLevel === 2) color = '#f59e0b'
                    else if (maxLevel === 3) color = '#ef4444'
                    else if (maxLevel >= 4) color = '#7c2d12'

                    return (
                      <div key={index} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem 1rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f3f4',
                        minWidth: '120px'
                      }}>
                        <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          {dayName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '1rem' }}>
                          {dateDisplay}
                        </div>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: color,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          margin: '0 auto 0.5rem',
                          fontSize: '1.1rem'
                        }}>
                          {maxLevel}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#4a5568', lineHeight: '1.3' }}>
                          Tree: {day.tree?.level || 0}<br/>
                          Grass: {day.grass?.level || 0}<br/>
                          Weed: {day.weed?.level || 0}
                        </div>
                      </div>
                    )
                  }) : (
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem 1rem',
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #f1f3f4',
                      minWidth: '120px'
                    }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Today
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '1rem' }}>
                        Jul 5
                      </div>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#9ca3af',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        margin: '0 auto 0.5rem',
                        fontSize: '1.1rem'
                      }}>
                        0
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#4a5568', lineHeight: '1.3' }}>
                        Tree: 0<br/>Grass: 0<br/>Weed: 0
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Data Sources */}
          <div style={{
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '24px',
  padding: '2.5rem',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  textAlign: 'center',
  marginBottom: '2rem'
}}>
            <h3 style={{
              fontSize: '1.3rem',
              color: '#f5f5f5',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Powered by trusted sources
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap'
            }}>
              {/* Google Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)'
    }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{
                  color: '#f5f5f5',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>Google Pollen API</span>
              </div>

              {/* NOAA Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)'
    }}>
                <svg width="20" height="20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#003f7f" stroke="#ffffff" strokeWidth="3"/>
                  <circle cx="50" cy="50" r="35" fill="#ffffff"/>
                  <circle cx="50" cy="50" r="25" fill="#003f7f"/>
                  <path d="M 30 50 Q 50 30 70 50 Q 50 70 30 50" fill="#ffffff"/>
                  <text x="50" y="55" textAnchor="middle" fill="#003f7f" fontSize="8" fontWeight="bold">NOAA</text>
                </svg>
                <span style={{
                  color: '#f5f5f5',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>NOAA Weather</span>
              </div>

              {/* CDC Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)'
    }}>
                <svg width="20" height="20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#005A9C"/>
                  <circle cx="50" cy="50" r="35" fill="#ffffff"/>
                  <path d="M 35 35 L 65 35 L 65 45 L 55 45 L 55 65 L 45 65 L 45 45 L 35 45 Z" fill="#005A9C"/>
                  <path d="M 40 50 L 60 50 L 60 55 L 40 55 Z" fill="#ffffff"/>
                  <text x="50" y="80" textAnchor="middle" fill="#005A9C" fontSize="6" fontWeight="bold">CDC</text>
                </svg>
                <span style={{
                  color: '#f5f5f5',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>CDC Health Data</span>
              </div>
            </div>
          </div>
{/* Popular Cities Section */}
<div style={{
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: '3rem 2rem',
  marginBottom: '2rem'
}}>
  <h3 style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '700',
    color: '#f5f5f5',
    marginBottom: '1rem',
    textAlign: 'center'
  }}>
    Popular Cities
  </h3>
  <p style={{
    textAlign: 'center',
    color: '#b8b8b8',
    fontSize: '1rem',
    marginBottom: '2rem'
  }}>
    Check pollen levels in these popular locations
  </p>
  <div 
    className="popular-cities-grid"
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}
  >
    {[
      { name: 'Chicago', state: 'IL', slug: 'chicago-il' },
      { name: 'Phoenix', state: 'AZ', slug: 'phoenix-az' },
      { name: 'Denver', state: 'CO', slug: 'denver-co' },
      { name: 'Austin', state: 'TX', slug: 'austin-tx' },
      { name: 'Atlanta', state: 'GA', slug: 'atlanta-ga' },
      { name: 'Seattle', state: 'WA', slug: 'seattle-wa' },
      { name: 'Miami', state: 'FL', slug: 'miami-fl' },
      { name: 'Boston', state: 'MA', slug: 'boston-ma' },
      { name: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv' },
      { name: 'Portland', state: 'OR', slug: 'portland-or' },
      { name: 'Nashville', state: 'TN', slug: 'nashville-tn' },
      { name: 'San Diego', state: 'CA', slug: 'san-diego-ca' }
    ].map((city, index) => (
        <a
        key={index}
        href={`/${city.slug}`}
        className="popular-city-card"
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#f5f5f5',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)'
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
        }}
      >
        <div style={{
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '0.25rem'
        }}>
          {city.name}
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: '#b8b8b8'
        }}>
          {city.state}
        </div>
      </a>
    ))}
  </div>
</div>
    
{/* How It Works */}
<div style={{
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: '3rem 2rem',
  marginBottom: '2rem'
}}>
  <h3 style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '700',
    color: '#f5f5f5',
    marginBottom: '3rem',
    textAlign: 'center'
  }}>
    How MyPollenPal Works
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        color: '#1a1a1a',
        margin: '0 auto 1rem'
      }}>📍</div>
      <h4 style={{
        fontWeight: '700',
        color: '#f5f5f5',
        marginBottom: '0.5rem',
        fontSize: '1.2rem'
      }}>1. Enter Your Location</h4>
      <p style={{
        color: '#b8b8b8',
        lineHeight: '1.6'
      }}>
        Simply enter your ZIP code or city to get hyperlocal pollen data for your exact area.
      </p>
    </div>
              
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        color: '#1a1a1a',
        margin: '0 auto 1rem'
                }}>📊</div>
      <h4 style={{
        fontWeight: '700',
        color: '#f5f5f5',
        marginBottom: '0.5rem',
        fontSize: '1.2rem'
                }}>2. Check Pollen Levels</h4>
                <p style={{
                  color: '#b8b8b8',
                  lineHeight: '1.6'
                }}>
                  See current levels for tree, grass, and weed pollen with easy-to-understand visual indicators.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        color: '#1a1a1a',
        margin: '0 auto 1rem'
                }}>🎯</div>
      <h4 style={{
        fontWeight: '700',
        color: '#f5f5f5',
        marginBottom: '0.5rem',
        fontSize: '1.2rem'
                }}>3. Get Personalized Advice</h4>
                <p style={{
                  color: '#b8b8b8',
                  lineHeight: '1.6'
                }}>
                  Get personalized advice on when to stay indoors, take medication, or plan outdoor activities.
                </p>
              </div>
            </div>
          </div>
          
{/* Email Signup Section */}
<div id="email-signup" style={{
  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  color: '#f5f5f5',
  padding: '3rem 2rem',
  textAlign: 'center',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)'
}}>
  <h2 style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}>
    Never Get Caught Off Guard
  </h2>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              Get email alerts when pollen or air quality will be dangerous in your area.
            </p>
            <form onSubmit={handleEmailSignup}>
            <div style={{
  maxWidth: '500px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',  // Stack vertically on mobile
  gap: '0.75rem',
  alignItems: 'center'      // Center all items
}} className="email-signup-hero">
  
  {/* Inputs container for desktop layout */}
  <div style={{
    display: 'flex',
    gap: '0.75rem',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>
    <div style={{ flex: '1', minWidth: '250px' }}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={emailSignup.email}
        onChange={(e) => setEmailSignup(prev => ({ ...prev, email: e.target.value }))}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '12px',
          outline: 'none',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          background: 'white',
          color: '#2d3748',
          boxSizing: 'border-box'
        }}
      />
    </div>
    <div style={{ flex: '0 0 140px' }}>
      <input
        type="text"
        placeholder="ZIP or City"
        value={emailSignup.location}
        onChange={(e) => setEmailSignup(prev => ({ ...prev, location: e.target.value }))}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '12px',
          outline: 'none',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          background: 'white',
          color: '#2d3748',
          boxSizing: 'border-box'
        }}
      />
    </div>
  </div>
  
  {/* Button now separate and will center */}
  <button
    type="submit"
    disabled={emailSignup.isSubmitting}
    style={{
      padding: '1rem 2rem',
      background: emailSignup.isSubmitting 
        ? 'rgba(212, 175, 55, 0.5)' 
        : 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
      color: '#1a1a1a',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: emailSignup.isSubmitting ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap'
    }}
  >
    {emailSignup.isSubmitting ? 'Subscribing...' : 'Get Pollen Alerts'}
  </button>
</div>
</form>

{/* Add success/error message */}
{emailSignup.message && (
  <div style={{
    fontSize: '0.9rem',
    color: emailSignup.message.includes('✅') ? '#10b981' : '#ef4444',
    marginTop: '1rem',
    textAlign: 'center'
  }}>
    {emailSignup.message}
  </div>
)}
            
            <div style={{
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              opacity: 0.8
            }}>
              Morning alerts • Your location • Only when needed
            </div>
          </div>
        </div>
      </section>

{/* Footer */}
<footer style={{
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '3rem 0 2rem 0',
  marginTop: '4rem'
}}>
  <div style={{
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px'
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    }}>
      {/* Company Info */}
      <div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.3rem',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          mypollenpal
        </div>
        <p style={{
          color: '#b8b8b8',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          Your personal pollen companion for better allergy management.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 style={{
          color: '#f5f5f5',
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Legal
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <a href="/privacy" style={{
            color: '#b8b8b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}>
            Privacy Policy
          </a>
          <a href="/terms" style={{
            color: '#b8b8b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}>
            Terms of Service
          </a>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h4 style={{
          color: '#f5f5f5',
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Contact
        </h4>
        <a 
          href="mailto:hello@mypollenpal.com" 
          style={{
            color: '#b8b8b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}
        >
          hello@mypollenpal.com
        </a>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{
        color: '#b8b8b8',
        fontSize: '0.9rem'
      }}>
        © 2025 MyPollenPal. All rights reserved.
      </div>
      <div style={{
        color: '#b8b8b8',
        fontSize: '0.9rem'
      }}>
        Made with allergy-free code by {' '}
        <a 
          href="https://x.com/shwnhll" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#d4af37',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          @shwnhll
        </a>
      </div>
    </div>
  </div>
</footer>
      
    </div>
  )
}
