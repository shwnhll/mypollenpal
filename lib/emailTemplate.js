export function generatePollenAlert(pollenData, location) {
  const { tree, grass, weed, airQuality } = pollenData.current
  
  const getPollenColor = (level) => {
    if (level <= 1) return '#10b981'
    if (level === 2) return '#f59e0b' 
    if (level === 3) return '#ef4444'
    return '#7c2d12'
  }

  const shouldAlert = Math.max(tree.level, grass.level, weed.level) >= 3 || airQuality?.aqi > 100

  if (!shouldAlert) return null // Don't send if levels are low

  return {
    subject: `🌿 High Pollen Alert for ${location}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h1 style="color: #d4af37; font-size: 24px; margin-bottom: 20px;">Pollen Alert for ${location}</h1>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Tree</div>
              <div style="font-size: 24px; font-weight: bold; color: ${getPollenColor(tree.level)};">${tree.level}</div>
              <div style="font-size: 12px; color: ${getPollenColor(tree.level)};">${tree.status}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Grass</div>
              <div style="font-size: 24px; font-weight: bold; color: ${getPollenColor(grass.level)};">${grass.level}</div>
              <div style="font-size: 12px; color: ${getPollenColor(grass.level)};">${grass.status}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Weed</div>
              <div style="font-size: 24px; font-weight: bold; color: ${getPollenColor(weed.level)};">${weed.level}</div>
              <div style="font-size: 12px; color: ${getPollenColor(weed.level)};">${weed.status}</div>
            </div>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>💡 Today's Recommendation:</strong><br>
            ${tree.level >= 3 || grass.level >= 3 || weed.level >= 3 ? 
              'High pollen levels detected! Consider staying indoors or taking allergy medication.' : 
              'Moderate pollen levels. Sensitive individuals should take precautions.'}
          </div>

          <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">
            Powered by MyPollenPal • <a href="https://mypollenpal.com" style="color: #d4af37;">View full forecast</a>
          </p>
        </div>
      </div>
    `
  }
}
