import { getCityBySlug } from '../../utils/getCities'

export default async function TestCity() {
  const city = await getCityBySlug('atlanta-ga')
  
  return (
    <div style={{ padding: '2rem', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Single City Test</h1>
      {city ? (
        <div>
          <h2>✅ Found: {city.name}, {city.state}</h2>
          <p>Population: {city.population?.toLocaleString()}</p>
          <p>Coordinates: {city.latitude}, {city.longitude}</p>
          <p>Region: {city.region}</p>
        </div>
      ) : (
        <p style={{ color: 'red' }}>❌ City not found - check database</p>
      )}
    </div>
  )
}
