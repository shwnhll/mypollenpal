import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  
  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 })
  }

  try {
    console.log('Starting API call for location:', location)
    console.log('API key exists:', !!process.env.GOOGLE_POLLEN_API_KEY)
    
    // Test geocoding first
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    console.log('Geocoding URL:', geocodeUrl)
    
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    console.log('Geocoding response:', geocodeData)
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return NextResponse.json({ 
        error: 'Location not found',
        geocode_response: geocodeData 
      }, { status: 404 })
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location
    console.log('Coordinates:', lat, lng)
    
    // Return just geocoding success for now
    return NextResponse.json({
      message: "Geocoding successful!",
      location: geocodeData.results[0].formatted_address,
      coordinates: { lat, lng }
    })
    
  } catch (error) {
    console.error('Detailed API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pollen data',
      details: error.message 
    }, { status: 500 })
  }
}
