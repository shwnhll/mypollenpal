import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>MyPollenPal - Daily Pollen Levels & Allergy Tracking</title>
        <meta name="description" content="Check daily pollen levels by ZIP code. Get real-time tree, grass, and weed pollen data to manage your allergies better." />
      </Head>
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
            fontSize: '1.3rem',
            marginBottom: '0.5rem',
            opacity: 0.9
          }}>
            Pollen tracking for real life
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
              id="locationInput"
              type="text" 
              placeholder="Enter your ZIP code or city..."
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
            <button style={{
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
                border: '1px solid #f1f3f4'
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
                }} id="treeLevel">
                  4</div>
                <div style={{
                  color: '#718096',
                  fontWeight: '500'
                }} id="treeStatus">
                  High</div>
              </div>

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
                  marginBottom: '1rem'
                }}>Grass Pollen</div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#007AFF',
                  marginBottom: '0.5rem'
                }} id="grassLevel">
                  2</div>
                <div style={{
                  color: '#718096',
                  fontWeight: '500'
                }} id="grassStatus">
                  Low</div>
              </div>

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
                  marginBottom: '1rem'
                }}>Weed Pollen</div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#007AFF',
                  marginBottom: '0.5rem'
                }} id="weedLevel">
                  1</div>
                <div style={{
                  color: '#718096',
                  fontWeight: '500'
                }} id="weedStatus">
                  Very Low</div>
              </div>
            </div>
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
        See current levels for tree, grass, and weed pollen with easy-to-understand severity ratings.
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
      }}>3. Plan Your Day</h4>
      <p style={{
        color: '#718096',
        lineHeight: '1.6'
      }}>
        Make informed decisions about outdoor activities, medication timing, and allergy management.
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
              Coming Soon: Real-Time Data
            </h2>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              We're integrating live pollen data to give you accurate, up-to-date information for your area.
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem 2rem',
              borderRadius: '50px',
              display: 'inline-block',
              fontWeight: '600'
            }}>
              📧 Email alerts • 📊 Historical trends • 🎯 Personal triggers
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <script dangerouslySetInnerHTML={{
      __html: `
        async function fetchPollenData(location = 'Carmel, Indiana') {
          try {
            showLoading();
            
            const response = await fetch('/api/pollen?location=' + encodeURIComponent(location));
            
            if (!response.ok) {
              throw new Error('API Error: ' + response.status);
            }
            
            const data = await response.json();
            return data;
            
          } catch (error) {
            console.error('Error fetching pollen data:', error);
            throw error;
          }
        }

        function updatePollenDisplay(data) {
          document.getElementById('currentLocation').textContent = data.location;
          document.getElementById('lastUpdated').textContent = 'Last updated: ' + data.lastUpdated;
          
          document.getElementById('treeLevel').textContent = data.current.tree.level;
          document.getElementById('treeStatus').textContent = data.current.tree.status;
          document.getElementById('grassLevel').textContent = data.current.grass.level;
          document.getElementById('grassStatus').textContent = data.current.grass.status;
          document.getElementById('weedLevel').textContent = data.current.weed.level;
          document.getElementById('weedStatus').textContent = data.current.weed.status;
        }

        function showLoading() {
          document.getElementById('treeLevel').textContent = '...';
          document.getElementById('grassLevel').textContent = '...';
          document.getElementById('weedLevel').textContent = '...';
        }

        async function searchLocation() {
          const input = document.getElementById('locationInput');
          const location = input.value.trim();
          
          if (!location) {
            alert('Please enter a location');
            return;
          }

          try {
            const data = await fetchPollenData(location);
            updatePollenDisplay(data);
          } catch (error) {
            alert('Unable to fetch pollen data. Please try again.');
          }
        }

        // Test with real data on page load
        window.addEventListener('load', async function() {
          try {
            const data = await fetchPollenData();
            updatePollenDisplay(data);
          } catch (error) {
            console.error('Failed to load initial data');
          }
        });
      `
    }} />
    </div>
    </>
  )
}

      
    </>
  )
}
