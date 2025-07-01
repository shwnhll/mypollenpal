export default function Home() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8f9fa',
      minHeight: '100vh',
      color: '#2d3748'
    }}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 20px',
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
        </div>
      </header>

      <main style={{
        background: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            Is your pollen level safe today?
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#718096',
            marginBottom: '3rem',
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
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <button style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              padding: '0.75rem 1.5rem',
              background: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              🔍 Search
            </button>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2rem',
            marginTop: '3rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '2rem'
            }}>
              Coming Soon: Real-time Pollen Data
            </h2>
            <p style={{
              color: '#718096',
              marginBottom: '2rem'
            }}>
              🌳 Tree Pollen • 🌱 Grass Pollen • 🌿 Weed Pollen
            </p>
            <p style={{
              color: '#718096'
            }}>
              Sign up below to be notified when we launch!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
