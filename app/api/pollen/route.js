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
    
    // Extract ZIP code for AirNow API (it works better with ZIP codes)
    let zipCode = null
    const addressComponents = geocodeData.results[0].address_components
    for (const component of addressComponents) {
      if (component.types.includes('postal_code')) {
        zipCode = component.long_name
        break
      }
    }
    
    // Parallel API calls for better performance
    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?location.latitude=${lat}&location.longitude=${lng}&days=${days}&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    
    // Build air quality URL
    const airQualityUrl = zipCode 
      ? `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${process.env.NEXT_PUBLIC_AIRNOW_API_KEY}`
      : `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lng}&distance=25&API_KEY=${process.env.NEXT_PUBLIC_AIRNOW_API_KEY}`
    
    console.log('Air Quality URL:', airQualityUrl.replace(process.env.NEXT_PUBLIC_AIRNOW_API_KEY, 'HIDDEN_KEY'))
    console.log('ZIP Code found:', zipCode)
    console.log('AirNow API Key exists:', !!process.env.NEXT_PUBLIC_AIRNOW_API_KEY)
    
    const [pollenResponse, airQualityResponse] = await Promise.all([
      // Pollen API call
      fetch(pollenUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      
      // Air Quality API call
      fetch(airQualityUrl)
    ])
    
    // Check pollen response
    if (!pollenResponse.ok) {
      const errorData = await pollenResponse.text()
      return NextResponse.json({ 
        error: `Pollen API error: ${pollenResponse.status}`,
        details: errorData 
      }, { status: 500 })
    }
    
    const pollenData = await pollenResponse.json()
    
    // Process air quality data (it might fail, so handle gracefully)
    let airQualityData = null
    if (airQualityResponse.ok) {
      const airData = await airQualityResponse.json()
      console.log('Air Quality Raw Data:', airData) // Debug logging
      
      if (airData && airData.length > 0) {
        // Find the PM2.5 reading (most important for health)
        const pm25Data = airData.find(reading => reading.ParameterName === 'PM2.5')
        const ozoneData = airData.find(reading => reading.ParameterName === 'O3')
        
        // Use PM2.5 if available, otherwise use the first available reading
        const primaryReading = pm25Data || ozoneData || airData[0]
        console.log('Primary Reading:', primaryReading) // Debug logging
        
        if (primaryReading) {
          airQualityData = {
            aqi: primaryReading.AQI,
            level: getAQILevel(primaryReading.AQI),
            status: primaryReading.Category?.Name || getAQIStatus(primaryReading.AQI),
            parameter: primaryReading.ParameterName,
            lastUpdated: primaryReading.DateObserved,
            reportingArea: primaryReading.ReportingArea
          }
        }
      }
    } else {
      console.log('Air Quality API Error:', airQualityResponse.status, await airQualityResponse.text())
    }
    
    // Process the multi-day pollen response
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
    
    // Structure response with current + forecast + air quality
    const result = {
      location: locationName,
      lastUpdated: new Date().toLocaleString(),
      current: null,
      forecast: [],
      airQuality: airQualityData
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
        // First day is "current" - add air quality here too
        result.current = {
          ...dayResult,
          airQuality: airQualityData
        }
      }
      
      // All days go in forecast array
      result.forecast.push(dayResult)
    })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: error.message 
    }, { status: 500 })
  }
}

// Helper functions for AQI processing
function getAQILevel(aqi) {
  if (aqi <= 50) return 1      // Good
  if (aqi <= 100) return 2     // Moderate  
  if (aqi <= 150) return 3     // Unhealthy for Sensitive Groups
  if (aqi <= 200) return 4     // Unhealthy
  if (aqi <= 300) return 5     // Very Unhealthy
  return 6                     // Hazardous
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}
