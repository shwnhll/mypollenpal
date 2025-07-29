'use client'
import { useState, useEffect } from 'react'

export default function CityPageClient({ cityData }) {
  // Core data states
  const [pollenData, setPollenData] = useState(null)
  const [extendedData, setExtendedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('trends')
  const [myPollenPalScore, setMyPollenPalScore] = useState(5)

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true)
        
        // Load basic pollen data first (for immediate display)
        const basicResponse = await fetch(`/api/pollen?location=${encodeURIComponent(cityData.name + ', ' + cityData.state_code)}&days=10`)
        const basicData = await basicResponse.json()
        
        if (basicResponse.ok) {
          setPollenData(basicData)
          
          // Calculate enhanced MyPollenPal score
          const score = calculateMyPollenPalScore(basicData)
          setMyPollenPalScore(score)
        }
        
        // Then load extended data (subspecies, hourly, etc.)
        const extendedResponse = await fetch(`/api/pollen?location=${encodeURIComponent(cityData.name + ', ' + cityData.state_code)}&detailed=true&days=10`)
        const extended = await extendedResponse.json()
        
        if (extendedResponse.ok) {
          setExtendedData(extended)
        }
        
      } catch (err) {
        console.error('Failed to load data:', err)
        // Use fallback data on error
        setPollenData({
          current: {
            tree: { level: '2', status: 'Medium' },
            grass: { level: '1', status: 'Low' },
            weed: { level: '1', status: 'Low' },
            airQuality: { aqi: 50, status: 'Good' }
          },
          forecast: []
        })
        setMyPollenPalScore(4)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [cityData])

  function calculateMyPollenPalScore(data) {
    if (!data?.current) return 5
    
    const currentMonth = new Date().getMonth() + 1
    const treeLevel = parseInt(data.current.tree?.level) || 0
    const grassLevel = parseInt(data.current.grass?.level) || 0
    const weedLevel = parseInt(data.current.weed?.level) || 0
    const aqi = data.current.airQuality?.aqi || 50
    
    // Apply seasonal multipliers
    let adjustedTreeLevel = treeLevel
    let adjustedGrassLevel = grassLevel
    let adjustedWeedLevel = weedLevel
    
    if (currentMonth >= 3 && currentMonth <= 5) {
      adjustedTreeLevel = Math.min(treeLevel * 1.5, 4)
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      adjustedGrassLevel = Math.min(grassLevel * 1.5, 4)
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      adjustedWeedLevel = Math.min(weedLevel * 1.5, 4)
    }
    
    // Convert AQI to 0-4 scale
    let aqiLevel = 0
    if (aqi <= 50) aqiLevel = 1
    else if (aqi <= 100) aqiLevel = 2
    else if (aqi <= 150) aqiLevel = 3
    else if (aqi <= 200) aqiLevel = 4
    else aqiLevel = 4

    const maxPollenLevel = Math.max(adjustedTreeLevel, adjustedGrassLevel, adjustedWeedLevel)
    const avgPollenLevel = (adjustedTreeLevel + adjustedGrassLevel + adjustedWeedLevel) / 3
    const pollenScore = (maxPollenLevel * 0.8 + avgPollenLevel * 0.2)

    const combinedScore = (pollenScore * 0.7 + aqiLevel * 0.3)
    const scaledScore = (combinedScore / 4) * 10
    
    return Math.round(scaledScore)
  }

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
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
          <div>Loading pollen data for {cityData.name}...</div>
        </div>
      </div>
    )
  }

  const currentPollen = pollenData?.current || {}

  return (
    <>
      <style jsx>{`
        .pollen-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin: 2rem 0;
        }
        
        .forecast-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 1rem 0;
          scrollbar-width: thin;
        }
        
        .forecast-day {
          min-width: 160px;
          flex-shrink: 0;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 2rem;
          overflow-x: auto;
        }
        
        .tab {
          padding: 1rem 2rem;
          background: none;
          border: none;
          color: #b8b8b8;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
        }
        
        .tab.active {
          color: #d4af37;
          border-bottom: 2px solid #d4af37;
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        @media (max-width: 768px) {
          .pollen-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          
          .forecast-container {
            justify-content: flex-start;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#f5f5f5',
        minHeight: '100vh',
        paddingBottom: '4rem'
      }}>

        {/* Hero Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 20px',
          textAlign: 'center'
        }}>
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
            {cityData.name}, {cityData.state_code}
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.8,
            maxWidth: '600px',
            margin: '0 auto 2rem',
            color: '#b8b8b8'
          }}>
            Live pollen forecast and air quality for {cityData.name}, {cityData.state}
          </p>
          <div style={{
            fontSize: '0.9rem',
            color: '#999',
            marginBottom: '1rem'
          }}>
            Last updated: {new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>

          {/* MyPollenPal Score */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            margin: '0 auto',
            boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)'
          }}>
            <div style={{
              fontSize: '1.2rem',
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
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: getScoreColor(myPollenPalScore),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '800'
              }}>
                {myPollenPalScore}
              </div>
              <div style={{
                fontSize: '3rem',
                color: '#b8b8b8',
                fontWeight: '300'
              }}>/10</div>
            </div>
            
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#f5f5f5'
            }}>
              {getScoreAdvice(myPollenPalScore)}
            </div>
          </div>
        </section>

        {/* Current Conditions */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Current Pollen Levels
          </h2>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="pollen-cards-grid">
              {/* Tree Pollen */}
              <PollenCard 
                type="Tree Pollen"
                emoji="🌳"
                level={currentPollen.tree?.level || '0'}
                status={currentPollen.tree?.status || 'None'}
                color="#8b4513"
                subspecies={extendedData?.current?.tree?.subspecies}
              />

              {/* Grass Pollen */}
              <PollenCard 
                type="Grass Pollen"
                emoji="🌱"
                level={currentPollen.grass?.level || '0'}
                status={currentPollen.grass?.status || 'None'}
                color="#556b2f"
                subspecies={extendedData?.current?.grass?.subspecies}
              />

              {/* Weed Pollen */}
              <PollenCard 
                type="Weed Pollen"
                emoji="🌿"
                level={currentPollen.weed?.level || '0'}
                status={currentPollen.weed?.status || 'None'}
                color="#d4af37"
                subspecies={extendedData?.current?.weed?.subspecies}
              />

              {/* Air Quality */}
              <PollenCard 
                type="Air Quality"
                emoji="🌬️"
                level={currentPollen.airQuality?.aqi || '50'}
                status={currentPollen.airQuality?.status || 'Good'}
                color="#10b981"
                isAQI={true}
              />
            </div>

            {/* Additional factors if available */}
            {extendedData?.current && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                {extendedData.current.mold && (
                  <PollenCard 
                    type="Mold Spores"
                    emoji="🍄"
                    level={extendedData.current.mold.level}
                    status={extendedData.current.mold.status}
                    color="#7c2d12"
                    subspecies={extendedData.current.mold.types}
                  />
                )}
                
                {extendedData.current.dust && (
                  <PollenCard 
                    type="Dust & Dander"
                    emoji="💧"
                    level={extendedData.current.dust.level}
                    status={extendedData.current.dust.status}
                    color="#6b7280"
                  />
                )}
              </div>
            )}
          </div>
        </section>

        {/* Hourly Forecast */}
        {extendedData?.hourly && (
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '2.5rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                Today's Hourly Forecast
              </h2>
              <div className="forecast-container">
                {extendedData.hourly.slice(0, 8).map((hour, index) => (
                  <HourlyCard key={index} data={hour} />
                ))}
              </div>
              <div style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: '#b8b8b8'
              }}>
                💡 Pollen levels typically peak between 6-10 AM
              </div>
            </div>
          </section>
        )}

        {/* 10-Day Forecast */}
        {pollenData?.forecast && pollenData.forecast.length > 0 && (
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '2.5rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                10-Day Pollen Forecast
              </h2>
              <div className="forecast-container">
                {pollenData.forecast.map((day, index) => (
                  <ForecastDay key={index} data={day} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Analysis Tabs */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
                onClick={() => setActiveTab('trends')}
              >
                Trends & Patterns
              </button>
              <button 
                className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
                onClick={() => setActiveTab('sources')}
              >
                Pollen Sources
              </button>
              <button 
                className={`tab ${activeTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveTab('health')}
              >
                Health Impact
              </button>
              <button 
                className={`tab ${activeTab === 'local' ? 'active' : ''}`}
                onClick={() => setActiveTab('local')}
              >
                Local Tips
              </button>
            </div>

            <div className={`tab-content ${activeTab === 'trends' ? 'active' : ''}`}>
  <div>
    <h3 style={{ marginBottom: '1.5rem', color: '#f5f5f5' }}>Trends & Patterns</h3>
    <p style={{ color: '#b8b8b8' }}>Seasonal trends and patterns coming soon...</p>
  </div>
</div>

<div className={`tab-content ${activeTab === 'sources' ? 'active' : ''}`}>
  <div>
    <h3 style={{ marginBottom: '1.5rem', color: '#f5f5f5' }}>Local Pollen Sources</h3>
    <p style={{ color: '#b8b8b8' }}>Local pollen source information coming soon...</p>
  </div>
</div>

<div className={`tab-content ${activeTab === 'health' ? 'active' : ''}`}>
  <div>
    <h3 style={{ marginBottom: '1.5rem', color: '#f5f5f5' }}>Health Impact Analysis</h3>
    <p style={{ color: '#b8b8b8' }}>Health recommendations coming soon...</p>
  </div>
</div>

<div className={`tab-content ${activeTab === 'local' ? 'active' : ''}`}>
  <div>
    <h3 style={{ marginBottom: '1.5rem', color: '#f5f5f5' }}>{cityData.name}-Specific Tips</h3>
    <p style={{ color: '#b8b8b8' }}>Local tips and recommendations coming soon...</p>
  </div>
</div>
        </section>

        {/* Activity Recommendations */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Activity Recommendations
            </h2>
            <ActivityRecommendations score={myPollenPalScore} />
          </div>
        </section>
      </div>
    </>
  )
}

// Helper Components
function PollenCard({ type, emoji, level, status, color, subspecies, isAQI = false }) {
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
      overflow: 'hidden',
      transition: 'transform 0.3s ease'
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
        letterSpacing: '0.5px',
        marginBottom: '1rem'
      }}>
        {status}
      </div>

      {/* Subspecies breakdown */}
      {subspecies && (
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1rem',
          fontSize: '0.85rem',
          color: '#b8b8b8'
        }}>
          {Object.entries(subspecies).map(([name, level]) => (
            <div key={name} style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.3rem'
            }}>
              <span style={{ textTransform: 'capitalize' }}>{name}:</span>
              <span style={{ color: getLevelColor(level) }}>
                {getLevelStatus(level)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HourlyCard({ data }) {
  return (
    <div style={{
      minWidth: '100px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '1rem 0.5rem',
      textAlign: 'center'
    }}>
      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
        {data.time}
      </div>
      <div style={{
        width: '40px',
        height: '40px',
        background: getScoreColor(data.score),
        borderRadius: '50%',
        margin: '0 auto 0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}>
        {data.score}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#b8b8b8' }}>
        {data.condition}
      </div>
    </div>
  )
}

function ForecastDay({ data, index }) {
  let date = new Date()
  let dateDisplay = 'Invalid Date'
  
  if (data.date && typeof data.date === 'object' && data.date.year) {
    date = new Date(data.date.year, data.date.month - 1, data.date.day)
  } else if (data.date && typeof data.date === 'string') {
    date = new Date(data.date)
  } else {
    date.setDate(date.getDate() + index)
  }

  if (!isNaN(date.getTime())) {
    dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })
  const maxLevel = Math.max(
    parseInt(data.tree?.level) || 0,
    parseInt(data.grass?.level) || 0,
    parseInt(data.weed?.level) || 0
  )

  return (
    <div className="forecast-day" style={{
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      padding: '1.5rem',
      textAlign: 'center'
    }}>
      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
        {dayName}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#b8b8b8', marginBottom: '1rem' }}>
        {dateDisplay}
      </div>
      <div style={{
        width: '60px',
        height: '60px',
        background: getLevelColor(maxLevel),
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        margin: '0 auto 1rem',
        fontSize: '1.1rem'
      }}>
        {maxLevel}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#b8b8b8', lineHeight: '1.3' }}>
        Tree: {data.tree?.level || 0}<br/>
        Grass: {data.grass?.level || 0}<br/>
        Weed: {data.weed?.level || 0}
      </div>
    </div>
  )
}

function ActivityRecommendations({ score }) {
 const activities = [
   {
     name: 'Outdoor Running',
     emoji: '🏃‍♂️',
     getStatus: (score) => score <= 3 ? 'recommended' : score <= 6 ? 'moderate' : 'avoid',
     getAdvice: (score) => {
       if (score <= 3) return 'Perfect conditions'
       if (score <= 6) return 'Best after 6 PM'
       return 'Consider indoor alternatives'
     }
   },
   {
     name: 'Gardening',
     emoji: '🌱',
     getStatus: (score) => score <= 2 ? 'recommended' : score <= 5 ? 'moderate' : 'avoid',
     getAdvice: (score) => {
       if (score <= 2) return 'Great day for yard work'
       if (score <= 5) return 'Wear mask and limit time'
       return 'High exposure risk'
     }
   },
   {
     name: 'Walking/Hiking',
     emoji: '🚶‍♀️',
     getStatus: (score) => score <= 4 ? 'recommended' : score <= 7 ? 'moderate' : 'avoid',
     getAdvice: (score) => {
       if (score <= 4) return 'Enjoy the outdoors'
       if (score <= 7) return 'Choose covered trails'
       return 'Consider indoor malls'
     }
   },
   {
     name: 'Windows Open',
     emoji: '🪟',
     getStatus: (score) => score <= 3 ? 'recommended' : score <= 6 ? 'moderate' : 'avoid',
     getAdvice: (score) => {
       if (score <= 3) return 'Fresh air is great'
       if (score <= 6) return 'Open briefly if needed'
       return 'Keep closed, use A/C'
     }
   },
   {
     name: 'Outdoor Dining',
     emoji: '🍽️',
     getStatus: (score) => score <= 4 ? 'recommended' : score <= 7 ? 'moderate' : 'avoid',
     getAdvice: (score) => {
       if (score <= 4) return 'Perfect patio weather'
       if (score <= 7) return 'Choose covered seating'
       return 'Indoor dining recommended'
     }
   },
   {
     name: 'Dog Walking',
     emoji: '🐕',
     getStatus: (score) => score <= 5 ? 'recommended' : score <= 8 ? 'moderate' : 'avoid',
     getAdvice: (score) => {
       if (score <= 5) return 'Normal walks fine'
       if (score <= 8) return 'Shorter walks, wipe paws'
       return 'Quick potty breaks only'
     }
   }
 ]

 return (
   <div style={{
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
     gap: '1rem'
   }}>
     {activities.map((activity, index) => {
       const status = activity.getStatus(score)
       const advice = activity.getAdvice(score)
       const statusColor = status === 'recommended' ? '#10b981' : status === 'moderate' ? '#f59e0b' : '#ef4444'
       const statusText = status === 'recommended' ? 'Recommended' : status === 'moderate' ? 'Use Caution' : 'Not Recommended'

       return (
         <div key={index} style={{
           background: 'rgba(255, 255, 255, 0.05)',
           borderRadius: '12px',
           padding: '1.5rem',
           textAlign: 'center'
         }}>
           <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
             {activity.emoji}
           </div>
           <div style={{
             fontWeight: '600',
             color: statusColor,
             marginBottom: '0.5rem',
             textTransform: 'uppercase',
             fontSize: '0.9rem'
           }}>
             {statusText}
           </div>
           <div style={{ fontSize: '0.85rem', color: '#f5f5f5', marginBottom: '0.5rem' }}>
             {activity.name}
           </div>
           <div style={{ fontSize: '0.8rem', color: '#b8b8b8' }}>
             {advice}
           </div>
         </div>
       )
     })}
   </div>
 )
}

// Helper functions
function getScoreColor(score) {
 if (score <= 3) return '#10b981'      // Green
 if (score <= 5) return '#10b981'      // Green  
 if (score <= 7) return '#f59e0b'      // Yellow/Orange
 if (score <= 9) return '#ef4444'      // Red
 return '#7c2d12'                      // Dark red
}

function getScoreAdvice(score) {
 if (score <= 3) return "Excellent day for outdoor activities!"
 if (score <= 5) return "Good day for most outdoor activities"
 if (score <= 7) return "Fair conditions - sensitive individuals take precautions"
 if (score <= 9) return "Poor conditions - limit outdoor activities"
 return "Severe conditions - stay indoors if possible!"
}

function getLevelColor(level) {
 const numLevel = parseInt(level) || 0
 if (numLevel === 0) return '#9ca3af'
 if (numLevel === 1) return '#10b981'
 if (numLevel === 2) return '#f59e0b'
 if (numLevel === 3) return '#ef4444'
 if (numLevel >= 4) return '#7c2d12'
 return '#9ca3af'
}

function getLevelStatus(level) {
 const numLevel = parseInt(level) || 0
 if (numLevel === 0) return 'None'
 if (numLevel === 1) return 'Low'
 if (numLevel === 2) return 'Medium'
 if (numLevel === 3) return 'High'
 if (numLevel >= 4) return 'Very High'
 return 'None'
}
