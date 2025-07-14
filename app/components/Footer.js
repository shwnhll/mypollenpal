'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3rem 0 2rem 0',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem'
            }}>
              mypollenpal
            </div>
            <p style={{
              color: '#b8b8b8',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Your personal pollen companion for better allergy management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: '#f5f5f5',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Legal
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <Link href="/privacy" style={{
                color: '#b8b8b8',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{
                color: '#b8b8b8',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}>
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              color: '#f5f5f5',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Contact
            </h4>
            <a 
              href="mailto:hello@mypollenpal.com" 
              style={{
                color: '#b8b8b8',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}
            >
              hello@mypollenpal.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            color: '#b8b8b8',
            fontSize: '0.9rem'
          }}>
            © 2025 MyPollenPal. All rights reserved.
          </div>
          <div style={{
            color: '#b8b8b8',
            fontSize: '0.9rem'
          }}>
            Built with allergy-free code by{' '}
            <a 
              href="https://x.com/shwnhll" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#d4af37',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              @shwnhll
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
