// Test this endpoint: /api/weather-debug?location=Chicago, IL
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'Chicago, IL'
  
  console.log('=== WEATHER DEBUG START ===')
  console.log('Location requested:', location)
  
  // Check environment variables
  const hasOpenWeatherKey = !!process.env.OPENWEATHERMAP_API_KEY
  const hasGoogleKey = !!process.env.GOOGLE_POLLEN_API_KEY
  
  console.log('Environment check:', {
    OPENWEATHERMAP_API_KEY: hasOpenWeatherKey ? 'SET' : 'MISSING',
    GOOGLE_POLLEN_API_KEY: hasGoogleKey ? 'SET' : 'MISSING',
    OPENWEATHERMAP_KEY_LENGTH: process.env.OPENWEATHERMAP_API_KEY?.length || 0
  })
  
  if (!hasOpenWeatherKey) {
    return NextResponse.json({ 
      error: 'OPENWEATHERMAP_API_KEY is not set in environment variables' 
    }, { status: 500 })
  }
  
  try {
    // Step 1: Geocoding
    console.log('Step 1: Geocoding...')
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    console.log('Geocoding status:', geocodeResponse.status)
    console.log('Geocoding results:', geocodeData.results?.length || 0, 'found')
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return NextResponse.json({ error: 'Location not found in geocoding' }, { status: 404 })
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location
    console.log('Coordinates:', { lat, lng })
    
    // Step 2: Weather API call
    console.log('Step 2: Weather API...')
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=imperial`
    console.log('Weather URL (key hidden):', weatherUrl.replace(process.env.OPENWEATHERMAP_API_KEY, 'HIDDEN_KEY'))
    
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()
    
    console.log('Weather API status:', weatherResponse.status)
    console.log('Weather API response keys:', Object.keys(weatherData))
    
    if (!weatherResponse.ok) {
      console.log('Weather API error details:', weatherData)
      return NextResponse.json({ 
        error: `Weather API error: ${weatherResponse.status}`,
        details: weatherData,
        url: weatherUrl.replace(process.env.OPENWEATHERMAP_API_KEY, 'HIDDEN_KEY')
      }, { status: 500 })
    }
    
    // Step 3: Process weather data
    const processedWeather = {
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind?.speed || 0),
      windDirection: weatherData.wind?.deg || 0,
      windDirectionText: getWindDirection(weatherData.wind?.deg || 0),
      pressure: weatherData.main.pressure,
      description: weatherData.weather[0]?.description || 'Clear',
      feelsLike: Math.round(weatherData.main.feels_like),
      visibility: weatherData.visibility ? Math.round(weatherData.visibility * 3.28084 / 5280) : null
    }
    
    console.log('Processed weather:', processedWeather)
    console.log('=== WEATHER DEBUG END ===')
    
    return NextResponse.json({
      success: true,
      location: geocodeData.results[0].formatted_address,
      coordinates: { lat, lng },
      rawWeatherData: weatherData,
      processedWeather: processedWeather,
      environmentCheck: {
        hasOpenWeatherKey,
        hasGoogleKey,
        keyLength: process.env.OPENWEATHERMAP_API_KEY?.length
      }
    })
    
  } catch (error) {
    console.error('Weather debug error:', error)
    console.log('=== WEATHER DEBUG END (ERROR) ===')
    
    return NextResponse.json({ 
      error: 'Weather debug failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}
