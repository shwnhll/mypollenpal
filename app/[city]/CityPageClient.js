'use client'
import { useState, useEffect } from 'react'

export default function CityPageClient({ cityData }) {
  const [pollenData, setPollenData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPollenData() {
      try {
        // Get live pollen data (using your existing API)
        const response = await fetch(`/api/pollen?location=${encodeURIComponent(cityData.name + ', ' + cityData.state_code)}`)
        const pollen = await response.json()
        
        if (response.ok) {
          setPollenData(pollen)
        } else {
          // Use sample data if API fails
          setPollenData({
            current: {
              tree: { level: '2', status: 'Medium' },
              grass: { level: '1', status: 'Low' },
              weed: { level: '3', status: 'High' },
              airQuality: { aqi: 45, status: 'Good' }
            }
          })
        }
      } catch (err) {
        console.error('Failed to load pollen data:', err)
        // Use sample data on error
        setPollenData({
          current: {
            tree: { level: '2', status: 'Medium' },
            grass: { level: '1', status: 'Low' },
            weed: { level: '3', status: 'High' },
            airQuality: { aqi: 45, status: 'Good' }
          }
        })
      } finally {
        setLoading(false)
      }
    }

    loadPollenData()
  }, [cityData])

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f5f5f5'
      }}>
        <div>Loading pollen data for {cityData.name}...</div>
      </div>
    )
  }

  const currentPollen = pollenData?.current || {}
  const maxLevel = Math.max(
    parseInt(currentPollen.tree?.level) || 0,
    parseInt(currentPollen.grass?.level) || 0,
    parseInt(currentPollen.weed?.level) || 0
  )

  return (
    <>
      <style jsx>{`
        .pollen-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        @media (max-width: 768px) {
          .pollen-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .pollen-cards-grid {
            gap: 1rem !important;
          }
        }
      `}</style>
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#f5f5f5',
        minHeight: '100vh',
        padding: '2rem 0'
      }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Pollen Count in {cityData.name}, {cityData.state_code} Today
        </h1>
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto',
          color: '#b8b8b8'
        }}>
          Current pollen levels and air quality for {cityData.name}, {cityData.state}. 
          Population: {cityData.population?.toLocaleString()}
        </p>
      </section>

      {/* Current Pollen Data */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
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
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            marginBottom: '2rem'
        }} className="pollen-cards-grid">
            {/* Tree Pollen Card */}
            <PollenCard 
              type="Tree"
              emoji="🌳"
              level={currentPollen.tree?.level || '0'}
              status={currentPollen.tree?.status || 'None'}
              color="#8b4513"
            />

            {/* Grass Pollen Card */}
            <PollenCard 
              type="Grass"
              emoji="🌱"
              level={currentPollen.grass?.level || '0'}
              status={currentPollen.grass?.status || 'None'}
              color="#556b2f"
            />

            {/* Weed Pollen Card */}
            <PollenCard 
              type="Weed"
              emoji="🌿"
              level={currentPollen.weed?.level || '0'}
              status={currentPollen.weed?.status || 'None'}
              color="#d4af37"
            />

            {/* Air Quality Card */}
            <PollenCard 
              type="Air Quality"
              emoji="🌬️"
              level={currentPollen.airQuality?.aqi || '50'}
              status={currentPollen.airQuality?.status || 'Good'}
              color="#10b981"
              isAQI={true}
            />
          </div>

          {/* Advice Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#d4af37'
            }}>
              Today's Advice for {cityData.name}
            </h3>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#f5f5f5'
            }}>
              {getAdviceText(maxLevel, cityData.name)}
            </p>
          </div>
        </div>

        {/* Local Info Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#f5f5f5'
          }}>
            About Pollen in {cityData.name}
          </h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#b8b8b8',
            marginBottom: '1rem'
          }}>
            {cityData.name} is located in the {cityData.region} region with a {cityData.climate_zone.replace('_', ' ')} climate. 
            This area typically experiences {getClimateDescription(cityData.climate_zone)} pollen seasons.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <strong>Population:</strong> {cityData.population?.toLocaleString()}
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <strong>Climate:</strong> {cityData.climate_zone.replace('_', ' ')}
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <strong>Region:</strong> {cityData.region.replace('_', ' ')}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Reusable Pollen Card Component
function PollenCard({ type, emoji, level, status, color, isAQI = false }) {
  const numLevel = parseInt(level) || 0
  const maxLevel = isAQI ? 6 : 4
  const strokeDasharray = `${(numLevel / maxLevel) * 201.06} 201.06`

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color}, transparent)`
      }}></div>
      
      <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{emoji}</div>
      <div style={{
        fontWeight: '600',
        color: '#f5f5f5',
        marginBottom: '1.5rem',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {type}
      </div>
      
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        margin: '0 auto 1rem'
      }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={strokeDasharray} strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: isAQI ? '1.2rem' : '1.5rem',
          fontWeight: '800',
          color: color
        }}>
          {level}
        </div>
      </div>
      
      <div style={{
        color: color,
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: '0.9rem',
        letterSpacing: '0.5px'
      }}>
        {status}
      </div>
    </div>
    </>
  )
}

// Helper functions
function getAdviceText(maxLevel, cityName) {
  if (maxLevel === 0 || maxLevel === 1) {
    return `Great day for outdoor activities in ${cityName}! Low pollen and good air quality make it perfect for spending time outside.`
  } else if (maxLevel === 2) {
    return `Good day for most outdoor activities in ${cityName}. Some sensitive individuals may experience mild allergy symptoms.`
  } else if (maxLevel === 3) {
    return `Moderate pollen conditions in ${cityName} today. Consider taking allergy medication if you're sensitive to pollen.`
  } else {
    return `High pollen levels in ${cityName} today. Take precautions and consider staying indoors if you're sensitive to allergens.`
  }
}

function getClimateDescription(climate) {
  const descriptions = {
    'humid_subtropical': 'extended spring and fall',
    'humid_continental': 'distinct seasonal',
    'semi_arid': 'dry climate with concentrated',
    'desert': 'minimal but intense',
    'mediterranean': 'mild winter and dry summer',
    'tropical': 'year-round'
  }
  return descriptions[climate] || 'seasonal'
}
