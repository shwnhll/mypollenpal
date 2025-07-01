export default function Home() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8f9fa',
      color: '#2d3748',
      lineHeight: '1.6'
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
            fontSize: '1.3rem',
            marginBottom: '0.5rem',
            opacity: 0.9
          }}>
            #1 pollen tracking for real life
          </p>
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
              type="text" 
              placeholder="Enter your ZIP code or city..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '50px',
                outline: 'none'
              }}
            />
            <button style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              padding: '0.75rem 1.5rem',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              🔍 Search
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
                Last updated: Today at 12:00 PM
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              margin: '2rem 0'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem'
                }}>🌳</div>
                <div style={{
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>Tree Pollen</div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#007AFF',
                  marginBottom: '0.5rem'
                }}>4</div>
                <div style={{
                  color: '#718096',
                  fontWeight: '500'
                }}>High</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem'
                }}>🌱</div>
                <div style={{
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>Grass Pollen</div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#007AFF',
                  marginBottom: '0.5rem'
                }}>2</div>
                <div style={{
                  color: '#718096',
                  fontWeight: '500'
                }}>Low</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem'
                }}>🌿</div>
                <div style={{
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>Weed Pollen</div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#007AFF',
                  marginBottom: '0.5rem'
                }}>1</div>
                <div style={{
                  color: '#718096',
                  fontWeight: '500'
                }}>Very Low</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              color: '#2d3748',
              marginBottom: '1.5rem'
            }}>Powered by trusted sources</h3>
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
              }}>Google Pollen API</div>
              <div style={{
                color: '#718096',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>NOAA Weather</div>
              <div style={{
                color: '#718096',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}>CDC Health Data</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
