export default async function handler(req, res) {
  const { location } = req.query;
  
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    // First, convert location to lat/lng using Google Geocoding
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_POLLEN_API_KEY}`;
    
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location;
    const locationName = geocodeData.results[0].formatted_address;
    
    // Now get pollen data
    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?key=${process.env.GOOGLE_POLLEN_API_KEY}`;
    
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
        days: 5
      })
    });

    const pollenData = await pollenResponse.json();
    
    if (!pollenData.dailyInfo || pollenData.dailyInfo.length === 0) {
      return res.status(404).json({ error: 'No pollen data available for this location' });
    }

    // Transform the data for our frontend
    const todayData = pollenData.dailyInfo[0];
    const pollenTypes = todayData.pollenTypeInfo || [];
    
    const getPollenInfo = (code) => {
      const pollen = pollenTypes.find(p => p.code === code);
      if (!pollen || !pollen.indexInfo) {
        return { level: 0, status: 'Low' };
      }
      return {
        level: pollen.indexInfo.value || 0,
        status: pollen.indexInfo.category || 'Low'
      };
    };

    const result = {
      location: locationName,
      lastUpdated: new Date().toLocaleString(),
      current: {
        tree: getPollenInfo('TREE'),
        grass: getPollenInfo('GRASS'), 
        weed: getPollenInfo('WEED')
      },
      forecast: pollenData.dailyInfo.slice(0, 5).map((day, index) => {
        const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
        const dayPollenTypes = day.pollenTypeInfo || [];
        const maxLevel = Math.max(...dayPollenTypes.map(p => p.indexInfo?.value || 0));
        
        let status = 'Low';
        if (maxLevel >= 4) status = 'Very High';
        else if (maxLevel >= 3) status = 'High';
        else if (maxLevel >= 2) status = 'Moderate';
        
        return {
          day: dayNames[index],
          level: status
        };
      })
    };

    res.status(200).json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch pollen data' });
  }
}
