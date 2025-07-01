'use client'
import { useState } from 'react'

export default function Home() {
  const [pollenData, setPollenData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Handle Enter key press
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      searchLocation();
    }
  };

  const searchLocation = async () => {
    const input = document.getElementById('locationInput');
    const location = input?.value?.trim() || '';
    
    if (!location) {
      alert('Please enter a location');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/pollen?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      
      if (response.ok) {
        setPollenData(data);
      } else {
        alert(data.error || 'Unable to fetch pollen data. Please try again.');
      }
    } catch (error) {
      alert('Unable to fetch pollen data. Please try again.');
    }
    setLoading(false);
  };

  // Get pollen level color and advice
  const getPollenInfo = (level: any, type: any) => {
    const levelNum = parseInt(level) || 0;
    
    if (levelNum <= 1) {
      return {
        color: '#10b981', // Green
        advice: `Great day for outdoor activities! ${type} pollen is very low.`
      };
    } else if (levelNum <= 2) {
      return {
        color: '#f59e0b', // Yellow/Orange
        advice: `Moderate ${type.toLowerCase()} pollen. Consider taking allergy meds if you're sensitive.`
      };
    } else {
      return {
        color: '#ef4444', // Red
        advice: `High ${type.toLowerCase()} pollen day! Take precautions if you're allergic.`
      };
    }
  };

  const PollenCard = ({ type, emoji, level, status }: any) => {
    const pollenInfo = getPollenInfo(level, type);
    
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f1f3f4',
        position: 'relative'
      }}>
        <div style={{
          fontSize: '1.8rem',
          marginBottom: '1rem'
        }}>{emoji}</div>
        <div style={{
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1.5rem'
        }}>{type} Pollen</div>
        
        {/* Circular Progress Ring */}
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          margin: '0 auto 1rem'
        }}>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke={pollenInfo.color}
              strokeWidth="6"
              strokeDasharray={`${(level/5) * 201.06} 201.06`}
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '1.5rem',
            fontWeight: '800',
            color: pollenInfo.color
          }}>
            {level}
          </div>
        </div>
        
        <div style={{
          color: pollenInfo.color,
          fontWeight: '600',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
          letterSpacing: '0.5px'
        }}>
          {status}
        </div>
        
        {/* So What Explanation */}
        <div style={{
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#4a5568',
          lineHeight: '1.4',
          border: `1px solid ${pollenInfo.color}20`
        }}>
          {pollenInfo.advice}
        </div>
      </div>
    );
  };

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
              disabled={loading}
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0.75rem 1.5rem',
                background: loading ? '#94a3b8' : '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: loading ? 'not-allowed' : 'pointer',
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
          {pollenData && (
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
                }}>
                  {pollenData.location}
                </h2>
                <p style={{
                  color: '#718096',
                  fontSize: '0.9rem'
                }}>
                  Last updated: {pollenData.lastUpdated}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                margin: '2rem 0'
              }}>
                <PollenCard 
                  type="Tree" 
                  emoji="🌳" 
                  level={pollenData.current.tree.level} 
                  status={pollenData.current.tree.status} 
                />
                <PollenCard 
                  type="Grass" 
                  emoji="🌱" 
                  level={pollenData.current.grass.level} 
                  status={pollenData.current.grass.status} 
                />
                <PollenCard 
                  type="Weed" 
                  emoji="🌿" 
                  level={pollenData.current.weed.level} 
                  status={pollenData.current.weed.status} 
                />
              </div>
            </div>
          )}

          {/* Show sample data if no real data loaded */}
          {!pollenData && (
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
                }}>
                  Carmel, Indiana
                </h2>
                <p style={{
                  color: '#718096',
                  fontSize: '0.9rem'
                }}>
                  Sample data - Enter a location to see real pollen levels
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                margin: '2rem 0'
              }}>
                <PollenCard type="Tree" emoji="🌳" level="4" status="High" />
                <PollenCard type="Grass" emoji="🌱" level="2" status="Low" />
                <PollenCard type="Weed" emoji="🌿" level="1" status="Very Low" />
              </div>
            </div>
          )}

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
