'use client'
import { useState, useEffect } from 'react'

// Declare Google types to avoid TypeScript errors
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

  // Simple list of popular US cities for autocomplete
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
      
      updateOverallAdvice(
        parseInt(data.current.tree.level) || 0,
        parseInt(data.current.grass.level) || 0, 
        parseInt(data.current.weed.level) || 0,
        data.current.airQuality ? data.current.airQuality.level : 1
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
    
    if (levelNum === 0) {
      color = '#9ca3af'
    } else if (levelNum === 1) {
      color = '#10b981'
    } else if (levelNum === 2) {
      color = '#f59e0b'
    } else if (levelNum === 3) {
      color = '#ef4444'
    } else if (levelNum >= 4) {
      color = '#7c2d12'
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
    if (status_span) status_span.textContent = status
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
        background: white;
        border-radius: 12px;
        padding: 1.5rem 1rem;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f3f4;
        min-width: 120px;
      ">
        <div style="font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; font-size: 0.9rem;">
          ${dayName}
        </div>
        <div style="font-size: 0.75rem; color: #718096; margin-bottom: 1rem;">
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
        <div style="font-size: 0.75rem; color: #4a5568; line-height: 1.3;">
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

          @keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}
        }
        
        /* Hide Google Maps error dialogs - no longer needed */
      `}</style>
{/* Header */}
<header style={{
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  transition: 'all 0.3s ease'
}}>
  <nav style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.8rem',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      Pollen Pal
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
  {/* Floating particles */}
  <div style={{
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'rgba(212, 175, 55, 0.3)',
    borderRadius: '50%',
    left: '10%',
    animation: 'float 20s infinite linear'
  }}></div>
  <div style={{
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'rgba(212, 175, 55, 0.3)',
    borderRadius: '50%',
    left: '30%',
    animation: 'float 20s infinite linear',
    animationDelay: '4s'
  }}></div>
  <div style={{
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'rgba(212, 175, 55, 0.3)',
    borderRadius: '50%',
    left: '70%',
    animation: 'float 20s infinite linear',
    animationDelay: '8s'
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

      {/* Updated search container with glassmorphism */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Keep your existing search input but update styling */}
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
            padding: '1.2rem 1.5rem',
            paddingRight: '120px',
            fontSize: '1rem',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#f5f5f5',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
          }}
        />
        
        {/* Keep your existing suggestions dropdown but update colors */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: '120px',
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
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
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? '⏳ Loading...' : '🔍 Search'}
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
        padding: '3rem 0'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Current Pollen Data Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }} id="currentLocation">
                Carmel, Indiana
              </h2>
              <p style={{
                color: '#718096',
                fontSize: '0.9rem'
              }} id="lastUpdated">
                Sample data - Enter a location to see real pollen levels
              </p>
            </div>

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '2rem',
  margin: '2rem 0'
}} className="pollen-cards-grid">
  {/* Tree Pollen Card */}
  <div className="pollen-card" style={{
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f3f4'
  }}>
    <div style={{
      fontSize: '1.8rem',
      marginBottom: '1rem'
    }}>🌳</div>
    <div style={{
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1.5rem'
    }}>Tree Pollen</div>
    
    <div style={{
      position: 'relative',
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem'
    }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          id="treeRing"
          cx="40" cy="40" r="32" fill="none" stroke="#7c2d12" strokeWidth="6"
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
        color: '#7c2d12'
      }} id="treeLevelDisplay">
        <span id="treeLevel">4</span>
      </div>
    </div>
    
    <div style={{
      color: '#7c2d12',
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
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f3f4'
  }}>
    <div style={{
      fontSize: '1.8rem',
      marginBottom: '1rem'
    }}>🌱</div>
    <div style={{
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1.5rem'
    }}>Grass Pollen</div>
    
    <div style={{
      position: 'relative',
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem'
    }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          id="grassRing"
          cx="40" cy="40" r="32" fill="none" stroke="#f59e0b" strokeWidth="6"
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
        color: '#f59e0b'
      }} id="grassLevelDisplay">
        <span id="grassLevel">2</span>
      </div>
    </div>
    
    <div style={{
      color: '#f59e0b',
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
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f3f4'
  }}>
    <div style={{
      fontSize: '1.8rem',
      marginBottom: '1rem'
    }}>🌿</div>
    <div style={{
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1.5rem'
    }}>Weed Pollen</div>
    
    <div style={{
      position: 'relative',
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem'
    }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          id="weedRing"
          cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="6"
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
        color: '#10b981'
      }} id="weedLevelDisplay">
        <span id="weedLevel">1</span>
      </div>
    </div>
    
    <div style={{
      color: '#10b981',
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
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f3f4'
  }}>
    <div style={{
      fontSize: '1.8rem',
      marginBottom: '1rem'
    }}>🌬️</div>
    <div style={{
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1.5rem'
    }}>Air Quality</div>
    
    <div style={{
      position: 'relative',
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem'
    }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
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
  color: '#6b7280',
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
            
            {/* Overall advice section with inline email signup */}
            {hasSearched && (
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              marginTop: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>
                📍 Today's Recommendation
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#4a5568',
                lineHeight: '1.5',
                marginBottom: '1.5rem'
              }} id="overallAdvice">
                Severe pollen levels! Stay indoors if possible and take allergy medication.
              </div>
              
              {/* Inline Email Signup */}
              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>
                  📧 Get alerts like this daily
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  maxWidth: '400px',
                  margin: '0 auto',
                  flexWrap: 'wrap'
                }} className="email-signup-inline">
                  <input
                    type="email"
                    placeholder="your-email@example.com"
                    style={{
                      flex: '1',
                      minWidth: '200px',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="ZIP or City"
                    style={{
                      flex: '0 0 120px',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#007AFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Subscribe
                  </button>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginTop: '0.5rem'
                }}>
                  Daily alerts for your specific location
                </div>
              </div>
            </div>
  )}

            {/* 5-Day Forecast - only show after search */}
            {hasSearched && (
              <div style={{
                marginTop: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  📅 5-Day Pollen Forecast
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  overflowX: 'auto',
                  padding: '0.5rem 0',
                  justifyContent: 'center',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e0 #f7fafc'
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
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              color: '#2d3748',
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
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{
                  color: '#4a5568',
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
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>
                <svg width="20" height="20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#003f7f" stroke="#ffffff" strokeWidth="3"/>
                  <circle cx="50" cy="50" r="35" fill="#ffffff"/>
                  <circle cx="50" cy="50" r="25" fill="#003f7f"/>
                  <path d="M 30 50 Q 50 30 70 50 Q 50 70 30 50" fill="#ffffff"/>
                  <text x="50" y="55" textAnchor="middle" fill="#003f7f" fontSize="8" fontWeight="bold">NOAA</text>
                </svg>
                <span style={{
                  color: '#4a5568',
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
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>
                <svg width="20" height="20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#005A9C"/>
                  <circle cx="50" cy="50" r="35" fill="#ffffff"/>
                  <path d="M 35 35 L 65 35 L 65 45 L 55 45 L 55 65 L 45 65 L 45 45 L 35 45 Z" fill="#005A9C"/>
                  <path d="M 40 50 L 60 50 L 60 55 L 40 55 Z" fill="#ffffff"/>
                  <text x="50" y="80" textAnchor="middle" fill="#005A9C" fontSize="6" fontWeight="bold">CDC</text>
                </svg>
                <span style={{
                  color: '#4a5568',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>CDC Health Data</span>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '3rem 2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#2d3748',
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
                  background: '#007AFF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: 'white',
                  margin: '0 auto 1rem'
                }}>📍</div>
                <h4 style={{
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1.2rem'
                }}>1. Enter Your Location</h4>
                <p style={{
                  color: '#718096',
                  lineHeight: '1.6'
                }}>
                  Simply enter your ZIP code or city to get hyperlocal pollen data for your exact area.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#007AFF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: 'white',
                  margin: '0 auto 1rem'
                }}>📊</div>
                <h4 style={{
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1.2rem'
                }}>2. Check Pollen Levels</h4>
                <p style={{
                  color: '#718096',
                  lineHeight: '1.6'
                }}>
                  See current levels for tree, grass, and weed pollen with easy-to-understand visual indicators.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#007AFF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: 'white',
                  margin: '0 auto 1rem'
                }}>🎯</div>
                <h4 style={{
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1.2rem'
                }}>3. Get Personalized Advice</h4>
                <p style={{
                  color: '#718096',
                  lineHeight: '1.6'
                }}>
                  Receive actionable recommendations for outdoor activities, medication timing, and allergy management.
                </p>
              </div>
            </div>
          </div>
          
          {/* Email Signup Section - Replace Coming Soon */}
          <div style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
            color: 'white',
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '16px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              📧 Never Miss a High Pollen Day
            </h2>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              Get personalized daily alerts when pollen or air quality spike in your area.
            </p>
            
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'end'
            }} className="email-signup-hero">
              <div style={{ flex: '1', minWidth: '250px' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
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
              <button
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Get Daily Alerts
              </button>
            </div>
            
            <div style={{
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              opacity: 0.8
            }}>
              ✨ Personalized for your location • 📱 Mobile-friendly alerts • 🔒 Unsubscribe anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
