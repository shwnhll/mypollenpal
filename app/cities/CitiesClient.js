'use client'
import Link from 'next/link'

export default function CitiesClient({ cities }) {
  // Group cities by region for better organization
  const citiesByRegion = cities.reduce((acc, city) => {
    const region = city.region || 'other'
    if (!acc[region]) acc[region] = []
    acc[region].push(city)
    return acc
  }, {})

  const regionNames = {
    'southeast': 'Southeast',
    'south_central': 'South Central', 
    'midwest': 'Midwest',
    'northeast': 'Northeast',
    'west_coast': 'West Coast',
    'mountain_west': 'Mountain West',
    'southwest': 'Southwest',
    'other': 'Other'
  }

  return (
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
          Pollen Reports by City
        </h1>
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto',
          color: '#b8b8b8'
        }}>
          Get detailed pollen counts and air quality reports for {cities.length} cities across the United States. 
          Find your city for personalized allergy forecasts.
        </p>
      </section>

      {/* Cities by Region */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {Object.entries(citiesByRegion).map(([region, regionCities]) => (
          <div key={region} style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '2.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '2rem',
              color: '#d4af37',
              textAlign: 'center'
            }}>
              {regionNames[region] || region}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {regionCities
                .sort((a, b) => (b.population || 0) - (a.population || 0))
                .map(city => (
                <Link 
                  href={`/${city.slug}`} 
                  key={city.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.2)'
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #d4af37, transparent)'
                    }}></div>
                    
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#f5f5f5'
                    }}>
                      {city.name}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#b8b8b8',
                      marginBottom: '1rem'
                    }}>
                      {city.state} • Pop: {city.population?.toLocaleString()}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: '#9ca3af'
                    }}>
                      <span>{city.climate_zone?.replace('_', ' ')}</span>
                      <span style={{
                        color: '#d4af37',
                        fontWeight: '500'
                      }}>
                        View Report →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section style={{
        maxWidth: '600px',
        margin: '3rem auto 0',
        padding: '0 20px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#d4af37'
          }}>
            Don't See Your City?
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#f5f5f5',
            marginBottom: '1.5rem'
          }}>
            We're constantly adding new cities. Enter your location on our homepage 
            to check pollen levels and we'll prioritize adding your area.
          </p>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
              color: '#1a1a1a',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Check My Location
          </Link>
        </div>
      </section>
    </div>
  )
}
