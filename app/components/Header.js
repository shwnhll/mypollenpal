'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)'
    }}>
      <nav style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          textDecoration: 'none'
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer'
          }}>
            mypollenpal
          </div>
        </Link>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link href="/cities" style={{
            color: '#b8b8b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#b8b8b8'}>
            Cities
          </Link>
          <Link href="/#email-signup" style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
            color: '#1a1a1a',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Get Alerts
          </Link>
        </div>
      </nav>
    </header>
  )
}
