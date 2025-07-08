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
  const [activeTab, setActiveTab] = useState('overview')

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
    setShowSuggestions(false) // Hide suggestions when searching
    
    try {
      const response = await fetch(`/api/pollen?location=${encodeURIComponent(location)}&days=5`)
      const data = await response.json()
      
      if (response.ok) {
        setPollenData(data)
        setHasSearched(true)
        if (data.forecast) {
          setForecastData(data.forecast)
        }
        updateDisplay(data)
      } else {
        alert(data.error || 'Unable to fetch pollen data. Please try again.')
      }
    } catch (error) {
      alert('Unable to fetch pollen data. Please try again.')
    }
    setLoading(false)
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
      {/* Location Header - Always visible */}
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
          {hasSearched ? 'Your Location' : 'Carmel, Indiana'}
        </h2>
        <p style={{
          color: '#b8b8b8',
          fontSize: '0.9rem'
        }} id="lastUpdated">
          {hasSearched ? 'Loading...' : 'Sample data - Enter a location to see real pollen levels'}
        </p>
      </div>

      {/* Tabs - Only show after search */}
      {hasSearched && (
        <>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'analysis', label: 'Analysis' },
              { id: 'forecast', label: 'Forecast' },
              { id: 'air-quality', label: 'Air Quality' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 2rem',
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? '#d4af37' : '#b8b8b8',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #d4af37' : '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                
                <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🌳</div>
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
                
                <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🌱</div>
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
                
                <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🌿</div>
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
                
                <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🌬️</div>
                <div style={{
                  fontWeight: '600',
                  color: '#f5f5f5',
                  marginBottom: '1.5rem',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Air Quality</div>
                
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
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div style={{ padding: '2rem 0' }}>
              <div style={{
                textAlign: 'center',
                color: '#b8b8b8'
              }}>
                Species-level analysis will appear here after search
              </div>
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === 'forecast' && (
            <div style={{ padding: '2rem 0' }}>
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
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      padding: '1.5rem 1rem',
                      textAlign: 'center',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      minWidth: '120px',
                      maxWidth: '140px',
                      color: '#f5f5f5'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        {dayName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#b8b8b8', marginBottom: '1rem' }}>
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
                      <div style={{ fontSize: '0.75rem', color: '#b8b8b8', lineHeight: '1.3' }}>
                        Tree: {day.tree?.level || 0}<br/>
                        Grass: {day.grass?.level || 0}<br/>
                        Weed: {day.weed?.level || 0}
                      </div>
                    </div>
                  )
                }) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#b8b8b8',
                    padding: '2rem'
                  }}>
                    5-day forecast data will appear here
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Air Quality Tab */}
          {activeTab === 'air-quality' && (
            <div style={{ padding: '2rem 0' }}>
              <div style={{
                textAlign: 'center',
                color: '#b8b8b8'
              }}>
                Detailed air quality info will appear here
              </div>
            </div>
          )}

          {/* Scale explanation - only show after search */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#b8b8b8',
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div>📊 Pollen levels use international 0-4 scale</div>
            <div>🌬️ Air quality uses US EPA's AQI standard</div>
          </div>
        </>
      )}

      {/* Sample data display - only show BEFORE search */}
      {!hasSearched && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            margin: '2rem 0'
          }}>
            {/* Sample cards with muted styling */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌳</div>
              <div style={{ color: '#f5f5f5', marginBottom: '1rem' }}>Tree Pollen</div>
              <div style={{ fontSize: '2rem', color: '#cd853f', fontWeight: 'bold', marginBottom: '0.5rem' }}>4</div>
              <div style={{ color: '#cd853f', fontSize: '0.8rem' }}>SAMPLE</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌱</div>
              <div style={{ color: '#f5f5f5', marginBottom: '1rem' }}>Grass Pollen</div>
              <div style={{ fontSize: '2rem', color: '#9acd32', fontWeight: 'bold', marginBottom: '0.5rem' }}>2</div>
              <div style={{ color: '#9acd32', fontSize: '0.8rem' }}>SAMPLE</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌿</div>
              <div style={{ color: '#f5f5f5', marginBottom: '1rem' }}>Weed Pollen</div>
              <div style={{ fontSize: '2rem', color: '#d4af37', fontWeight: 'bold', marginBottom: '0.5rem' }}>1</div>
              <div style={{ color: '#d4af37', fontSize: '0.8rem' }}>SAMPLE</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌬️</div>
              <div style={{ color: '#f5f5f5', marginBottom: '1rem' }}>Air Quality</div>
              <div style={{ fontSize: '2rem', color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>51</div>
              <div style={{ color: '#10b981', fontSize: '0.8rem' }}>SAMPLE</div>
            </div>
          </div>
          
          <div style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#b8b8b8',
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            👆 Enter your location above to see real pollen data with detailed analysis tabs
          </div>
        </>
      )}
    </div>

    {/* Today's Recommendation - only show after search */}
    {hasSearched && (
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        color: '#f5f5f5',
        padding: '3rem 2rem',
        textAlign: 'center',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)',
        marginBottom: '2rem'
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
  </div>
</section>
</div>
)
}

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
    Never Miss a High Pollen Day
  </h2>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              Get email alerts every morning when pollen or air quality will be dangerous in your specific area.
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
    </div>
  )
}
