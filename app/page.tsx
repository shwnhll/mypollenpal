'use client'
import { useState } from 'react'

export default function Home() {
  const [pollenData, setPollenData] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchLocation = async () => {
    const input = document.getElementById('locationInput') as HTMLInputElement
    const location = input?.value?.trim() || ''
    
    if (!location) {
      alert('Please enter a location')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/pollen?location=${encodeURIComponent(location)}`)
      const data = await response.json()
      
      // Update the display elements - exactly like your original
      const locationEl = document.getElementById('currentLocation')
      const treeLevel = document.getElementById('treeLevel')
      const treeStatus = document.getElementById('treeStatus')
      const grassLevel = document.getElementById('grassLevel') 
      const grassStatus = document.getElementById('grassStatus')
      const weedLevel = document.getElementById('weedLevel')
      const weedStatus = document.getElementById('weedStatus')
      const lastUpdated = document.getElementById('lastUpdated')
      
      if (locationEl) locationEl.textContent = data.location
      if (treeLevel) treeLevel.textContent = data.current.tree.level
      if (treeStatus) treeStatus.textContent = data.current.tree.status
      if (grassLevel) grassLevel.textContent = data.current.grass.level
      if (grassStatus) grassStatus.textContent = data.current.grass.status
      if (weedLevel) weedLevel.textContent = data.current.weed.level
      if (weedStatus) weedStatus.textContent = data.current.weed.status
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

      // Update the visual elements
      updateVisualRings(data)
      updateOverallAdvice(
        parseInt(data.current.tree.level) || 0,
        parseInt(data.current.grass.level) || 0, 
        parseInt(data.current.weed.level) || 0
      )
      
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

  // Update visual rings
  const updateVisualRings = (data: any) => {
    updateRing('tree', data.current.tree.level, data.current.tree.status)
    updateRing('grass', data.current.grass.level, data.current.grass.status)
    updateRing('weed', data.current.weed.level, data.current.weed.status)
  }

  const updateRing = (type: string, level: string, status: string) => {
    const levelNum = parseInt(level) || 0
    let color = '#9ca3af' // Gray for 0/None
    
    if (levelNum === 0) {
      color = '#9ca3af' // Gray for None
    } else if (levelNum === 1) {
      color = '#10b981' // Green for Low
    } else if (levelNum === 2) {
      color = '#f59e0b' // Yellow for Medium
    } else if (levelNum === 3) {
      color = '#ef4444' // Red for High
    } else if (levelNum >= 4) {
      color = '#7c2d12' // Dark red for Severe
    }

    // Update ring color and status (use the actual status from API, but fix colors)
    const ring = document.getElementById(`${type}Ring`)
    const level_el = document.getElementById(`${type}LevelDisplay`)
    const status_el = document.getElementById(`${type}StatusDisplay`)
    const status_span = document.getElementById(`${type}Status`)
    
    if (ring) ring.setAttribute('stroke', color)
    if (ring) ring.setAttribute('stroke-dasharray', `${(levelNum/4) * 201.06} 201.06`) // Changed to /4 since scale is 0-4
    if (level_el) level_el.style.color = color
    if (status_el) status_el.style.color = color
    if (status_span) status_span.textContent = status // Keep using actual API status
  }

  const updateOverallAdvice = (treeLevel: number, grassLevel: number, weedLevel: number) => {
    const maxLevel = Math.max(treeLevel, grassLevel, weedLevel)
    const advice_el = document.getElementById('overallAdvice')
    
    let advice = ''
    if (maxLevel === 0) {
      advice = "No significant pollen detected. Perfect day for all outdoor activities!"
    } else if (maxLevel === 1) {
      advice = "Low pollen levels. Great day for outdoor activities with minimal allergy risk."
    } else if (maxLevel === 2) {
      advice = "Medium pollen levels. Consider allergy meds if you're sensitive."
    } else if (maxLevel === 3) {
      advice = "High pollen day! Take precautions - consider staying indoors or taking medication."
    } else {
      advice = "Severe pollen levels! Stay indoors if possible and take allergy medication."
    }
    
    if (advice_el) advice_el.textContent = advice
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8f9fa',
      color: '#2d3748',
      lineHeight: '1.6',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <nav style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1rem 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2d3748'
          }}>
            🤧 mypollenpal
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Is your pollen level safe today?
          </h1>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '3rem',
            opacity: 0.8,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            One click to find out exactly what's in your air, anywhere in the United States. Your personal pollen companion.
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
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                paddingRight: '120px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '50px',
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                background: 'white',
                color: '#2d3748',
                boxSizing: 'border-box'
              }}
            />
            <button 
              onClick={searchLocation}
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0.75rem 1.5rem',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
               {loading ? '⏳ Loading...' : '🔍 Search'}
            </button>
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
          {/* Pollen Data Card */}
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              margin: '2rem 0'
            }}>
              {/* Tree Pollen Card */}
              <div style={{
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
                
                {/* Circular Progress Ring */}
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
                      cx="40" cy="40" r="32" fill="none" stroke="#ef4444" strokeWidth="6"
                      strokeDasharray="160.85 201.06" strokeLinecap="round"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#ef4444'
                  }} id="treeLevelDisplay">
                    <span id="treeLevel">4</span>
                  </div>
                </div>
                
                <div style={{
                  color: '#10b981',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px'
                }} id="treeStatusDisplay">
                  <span id="treeStatus">High</span>
                </div>
              </div>

              {/* Grass Pollen Card */}
              <div style={{
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
                      strokeDasharray="80.42 201.06" strokeLinecap="round"
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
                  color: '#10b981',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px'
                }} id="grassStatusDisplay">
                  <span id="grassStatus">Low</span>
                </div>
              </div>

              {/* Weed Pollen Card */}
              <div style={{
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
                      strokeDasharray="40.21 201.06" strokeLinecap="round"
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
                  <span id="weedStatus">Very Low</span>
                </div>
              </div>
            </div>

            {/* Scale indicator */}
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '0.5rem'
              }}>
                📊 Pollen Scale (0-4)
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                <span style={{ color: '#9ca3af' }}>0: None</span>
                <span style={{ color: '#10b981' }}>1: Low</span>
                <span style={{ color: '#f59e0b' }}>2: Medium</span>
                <span style={{ color: '#ef4444' }}>3: High</span>
                <span style={{ color: '#7c2d12' }}>4: Severe</span>
              </div>
            </div>
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
                lineHeight: '1.5'
              }} id="overallAdvice">
                High tree pollen day! Take precautions if you have allergies - consider staying indoors or taking medication.
              </div>
            </div>
          </div>

          {/* Rest of your original content */}
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
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                color: '#718096',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>
                Google Pollen API
              </div>
              <div style={{
                color: '#718096',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>
                NOAA Weather
              </div>
              <div style={{
                color: '#718096',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>
                CDC Health Data
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
          
          {/* Coming Soon */}
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
              Coming Soon: 5-Day Forecasts & Email Alerts
            </h2>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              Plan your week ahead with extended forecasts and never miss a high pollen day again.
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem 2rem',
              borderRadius: '50px',
              display: 'inline-block',
              fontWeight: '600'
            }}>
              📧 Email alerts • 📅 5-day forecasts • 🎯 Personal triggers
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
