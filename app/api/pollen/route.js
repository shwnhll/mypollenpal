import { NextResponse } from 'next/server'

export async function GET(request) {
  console.log('Pollen API called!')
  
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  const days = searchParams.get('days') || '1'
  const detailed = searchParams.get('detailed') === 'true'
  
  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 })
  }
  
  try {
    // Geocoding
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
    
    // Build API URLs
    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?location.latitude=${lat}&location.longitude=${lng}&days=${days}&plantsDescription=true&key=${process.env.GOOGLE_POLLEN_API_KEY}`
    
    const airQualityUrl = zipCode 
      ? `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${process.env.NEXT_PUBLIC_AIRNOW_API_KEY}`
      : `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lng}&distance=25&API_KEY=${process.env.NEXT_PUBLIC_AIRNOW_API_KEY}`
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=imperial`
    
    // Add hourly weather for detailed requests
    const hourlyWeatherUrl = detailed 
      ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=imperial`
      : null
    
    console.log('Air Quality URL:', airQualityUrl.replace(process.env.NEXT_PUBLIC_AIRNOW_API_KEY, 'HIDDEN_KEY'))
    console.log('Weather URL:', weatherUrl.replace(process.env.OPENWEATHERMAP_API_KEY, 'HIDDEN_KEY'))
    console.log('ZIP Code found:', zipCode || 'Using lat/lng fallback')
    
    // Parallel API calls for better performance
    const apiCalls = [
      fetch(pollenUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(airQualityUrl),
      fetch(weatherUrl)
    ]
    
    // Add hourly weather if detailed request
    if (hourlyWeatherUrl) {
      apiCalls.push(fetch(hourlyWeatherUrl))
    }
    
    const responses = await Promise.all(apiCalls)
    const [pollenResponse, airQualityResponse, weatherResponse, hourlyWeatherResponse] = responses
    
    // Check pollen response
    if (!pollenResponse.ok) {
      const errorData = await pollenResponse.text()
      return NextResponse.json({ 
        error: `Pollen API error: ${pollenResponse.status}`,
        details: errorData 
      }, { status: 500 })
    }
    
    const pollenData = await pollenResponse.json()
    
    // Process weather data
    let weatherData = null
    if (weatherResponse.ok) {
      const weather = await weatherResponse.json()
      weatherData = {
        temperature: Math.round(weather.main.temp),
        humidity: weather.main.humidity,
        windSpeed: Math.round(weather.wind?.speed || 0),
        windDirection: weather.wind?.deg || 0,
        windDirectionText: getWindDirection(weather.wind?.deg || 0),
        pressure: weather.main.pressure,
        description: weather.weather[0]?.description || 'Clear',
        feelsLike: Math.round(weather.main.feels_like),
        visibility: weather.visibility ? Math.round(weather.visibility * 3.28084 / 5280) : null // Convert to miles
      }
    } else {
      console.log('Weather API Error:', weatherResponse.status)
    }
    
    // Process hourly weather data
    let hourlyData = []
    if (hourlyWeatherResponse && hourlyWeatherResponse.ok) {
      const hourlyWeather = await hourlyWeatherResponse.json()
      hourlyData = hourlyWeather.list.slice(0, 8).map((hour, index) => {
        const hourTime = new Date(hour.dt * 1000)
        const pollenScore = calculateHourlyPollenScore(
          pollenData.dailyInfo?.[0], 
          weatherData, 
          index
        )
        
        return {
          time: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          score: pollenScore,
          condition: getHourlyCondition(pollenScore),
          temperature: Math.round(hour.main.temp),
          humidity: hour.main.humidity,
          windSpeed: Math.round(hour.wind?.speed || 0)
        }
      })
    }
    
    // Process air quality data
    let airQualityData = null
    if (airQualityResponse.ok) {
      const airData = await airQualityResponse.json()
      console.log('Air Quality Raw Data:', airData)
      
      if (airData && airData.length > 0) {
        const pm25Data = airData.find(reading => reading.ParameterName === 'PM2.5')
        const ozoneData = airData.find(reading => reading.ParameterName === 'O3')
        const primaryReading = pm25Data || ozoneData || airData[0]
        
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
      console.log('Air Quality API Error:', airQualityResponse.status)
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

    // Helper function to extract detailed plant species data
    const getPlantSpeciesInfo = (plantInfo) => {
      console.log('Plant species available:', plantInfo?.map(p => `${p.code} (${p.displayName})`))
      const trees = {}
      const grasses = {}  
      const weeds = {}
      
      if (!plantInfo || plantInfo.length === 0) {
        return { trees, grasses, weeds }
      }
      
      plantInfo.forEach(plant => {
        if (!plant.indexInfo) return
        
        const plantData = {
          level: plant.indexInfo.value || 0,
          status: plant.indexInfo.category || 'Low',
          displayName: plant.displayName || plant.code
        }
        
        const treeTypes = ['ALDER', 'ASH', 'BIRCH', 'COTTONWOOD', 'ELM', 'MAPLE', 'OLIVE', 'JUNIPER', 'OAK', 'PINE', 'CYPRESS_PINE', 'HAZEL', 'JAPANESE_CEDAR', 'JAPANESE_CYPRESS']
        const grassTypes = ['GRAMINALES']
        const weedTypes = ['RAGWEED', 'MUGWORT']
        
        if (treeTypes.includes(plant.code)) {
          trees[plant.code.toLowerCase()] = plantData
        } else if (grassTypes.includes(plant.code)) {
          grasses[plant.code.toLowerCase()] = plantData  
        } else if (weedTypes.includes(plant.code)) {
          weeds[plant.code.toLowerCase()] = plantData
        }
      })
      
      return { trees, grasses, weeds }
    }

    // Structure response with enhanced data
    const result = {
      location: locationName,
      lastUpdated: new Date().toLocaleString(),
      current: null,
      forecast: [],
      airQuality: airQualityData,
      weather: weatherData,
      ...(detailed && { 
        hourly: hourlyData,
        insights: generateInsights(weatherData, pollenData.dailyInfo?.[0])
      })
    }

    // Process each day
    dailyInfo.forEach((dayData, index) => {
      const pollenTypes = dayData.pollenTypeInfo || []
      const plantInfo = dayData.plantInfo || [] 
      const detailedPollen = getPlantSpeciesInfo(plantInfo) 
      
      const dayResult = {
        date: dayData.date,
        tree: getPollenInfo(pollenTypes, 'TREE'),
        grass: getPollenInfo(pollenTypes, 'GRASS'), 
        weed: getPollenInfo(pollenTypes, 'WEED'),
        ...(detailed && { subspecies: detailedPollen })
      }
      
      if (index === 0) {
        result.current = {
          ...dayResult,
          airQuality: airQualityData,
          weather: weatherData
        }
      }
      
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

// Helper functions
function getAQILevel(aqi) {
  if (aqi <= 50) return 1
  if (aqi <= 100) return 2
  if (aqi <= 150) return 3
  if (aqi <= 200) return 4
  if (aqi <= 300) return 5
  return 6
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

function calculateHourlyPollenScore(dayData, weather, hourIndex) {
  if (!dayData) return 3
  
  const pollenTypes = dayData.pollenTypeInfo || []
  const treeLevel = pollenTypes.find(p => p.code === 'TREE')?.indexInfo?.value || 0
  const grassLevel = pollenTypes.find(p => p.code === 'GRASS')?.indexInfo?.value || 0
  const weedLevel = pollenTypes.find(p => p.code === 'WEED')?.indexInfo?.value || 0
  
  let baseScore = Math.max(treeLevel, grassLevel, weedLevel)
  
  // Adjust for time of day (pollen typically peaks 6-10 AM)
  if (hourIndex >= 1 && hourIndex <= 3) { // Morning hours
    baseScore = Math.min(baseScore * 1.3, 4)
  } else if (hourIndex >= 6) { // Evening hours
    baseScore = baseScore * 0.7
  }
  
  // Adjust for wind
  if (weather?.windSpeed > 15) {
    baseScore = Math.min(baseScore * 1.2, 4)
  }
  
  // Convert to 10-point scale
  return Math.round((baseScore / 4) * 10)
}

function getHourlyCondition(score) {
  if (score <= 3) return 'Excellent'
  if (score <= 5) return 'Good'
  if (score <= 7) return 'Fair'
  return 'Poor'
}

function generateInsights(weather, pollenData) {
  const insights = []
  
  if (weather?.windSpeed > 15) {
    insights.push(`High winds (${weather.windSpeed} mph) are dispersing pollen from surrounding areas`)
  }
  
  if (weather?.humidity > 70) {
    insights.push('High humidity may increase mold spore levels')
  }
  
  if (weather?.description.includes('rain')) {
    insights.push('Rain will help wash pollen from the air and surfaces')
  }
  
  return insights
}
