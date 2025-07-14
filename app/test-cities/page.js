import { getAllCities } from '../../utils/getCities'

export default async function TestCities() {
  const cities = await getAllCities()
  
  return (
    <div style={{ padding: '2rem', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Cities Database Test</h1>
      <p>Found {cities.length} cities</p>
      
      {cities.length > 0 ? (
        <ul>
          {cities.map(city => (
            <li key={city.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{city.name}, {city.state_code}</strong> - 
              Pop: {city.population?.toLocaleString()} - 
              Slug: {city.slug}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'red' }}>❌ No cities found - check your database connection</p>
      )}
    </div>
  )
}
