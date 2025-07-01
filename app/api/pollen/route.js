import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  const days = searchParams.get('days') || '1' // Default to 1 day if not specified
  
  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 })
  }

  try {
    // Geocoding (same as before)
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location
    const locationName = geocodeData.results[0].formatted_address
    
    // Updated: Use the days parameter
    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?location.latitude=${lat}&location.longitude=${lng}&days=${days}&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    
    const pollenResponse = await fetch(pollenUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!pollenResponse.ok) {
      const errorData = await pollenResponse.text()
      return NextResponse.json({ 
        error: `Pollen API error: ${pollenResponse.status}`,
        details: errorData 
      }, { status: 500 })
    }

    const pollenData = await pollenResponse.json()
    
    // Process the multi-day response
    const dailyInfo = pollenData.dailyInfo || []
    
    if (dailyInfo.length === 0) {
      return NextResponse.json({ error: 'No pollen data available' }, { status: 404 })
    }

    // Helper function to extract pollen info
    const getPollenInfo = (pollenTypes, code) => {
      const pollen = pollenTypes.find(p => p.code === code)
      if (!pollen || !pollen.indexInfo) {
        return { level: 0, status: 'Low' }
      }
      return {
        level: pollen.indexInfo.value || 0,
        status: pollen.indexInfo.category || 'Low'
      }
    }

    // Structure response with current + forecast
    const result = {
      location: locationName,
      lastUpdated: new Date().toLocaleString(),
      current: null,
      forecast: []
    }

    // Process each day
    dailyInfo.forEach((dayData, index) => {
      const pollenTypes = dayData.pollenTypeInfo || []
      const dayResult = {
        date: dayData.date,
        tree: getPollenInfo(pollenTypes, 'TREE'),
        grass: getPollenInfo(pollenTypes, 'GRASS'),
        weed: getPollenInfo(pollenTypes, 'WEED')
      }

      if (index === 0) {
        // First day is "current"
        result.current = dayResult
      }
      
      // All days go in forecast array
      result.forecast.push(dayResult)
    })

    return NextResponse.json(result)
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pollen data',
      details: error.message 
    }, { status: 500 })
  }
}
