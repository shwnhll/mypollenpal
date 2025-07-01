import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  
  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 })
  }

  try {
    // Geocoding (we know this works!)
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location
    const locationName = geocodeData.results[0].formatted_address
    
    console.log('Getting pollen data for:', lat, lng)
    
    // Now test pollen API
    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?key=${process.env.GOOGLE_POLLEN_API_KEY}`
    
    const pollenResponse = await fetch(pollenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          latitude: lat,
          longitude: lng
        },
        days: 1
      })
    })

    console.log('Pollen response status:', pollenResponse.status)
    const pollenData = await pollenResponse.json()
    console.log('Pollen data:', pollenData)

    return NextResponse.json({
      message: "Pollen API test",
      location: locationName,
      coordinates: { lat, lng },
      pollen_response_status: pollenResponse.status,
      pollen_data: pollenData
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pollen data',
      details: error.message 
    }, { status: 500 })
  }
}
