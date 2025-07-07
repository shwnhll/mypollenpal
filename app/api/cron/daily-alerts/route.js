import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '../../../../lib/supabase'
import { generatePollenAlert } from '../../../../lib/emailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    // Get all unique locations from subscribers
    const { data: subscribers, error } = await supabase
      .from('email_subscribers')
      .select('email, location')
      .eq('verified', true)

    if (error) throw error

    // Group subscribers by location
    const locationGroups = subscribers.reduce((acc, sub) => {
      if (!acc[sub.location]) acc[sub.location] = []
      acc[sub.location].push(sub.email)
      return acc
    }, {})

    let alertsSent = 0

    // Process each location
    for (const [location, emails] of Object.entries(locationGroups)) {
      try {
        // Fetch pollen data for this location
        const pollenResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/pollen?location=${encodeURIComponent(location)}`)
        const pollenData = await pollenResponse.json()

        if (!pollenResponse.ok) continue

        // Generate email template
        const emailContent = generatePollenAlert(pollenData, location)
        
        if (!emailContent) continue // Skip if no alert needed

        // Send emails to all subscribers for this location
        await resend.emails.send({
          from: 'MyPollenPal <alerts@mypollenpal.com>',
          to: emails,
          subject: emailContent.subject,
          html: emailContent.html
        })

        alertsSent += emails.length
        
      } catch (error) {
        console.error(`Error processing location ${location}:`, error)
        continue
      }
    }

    return NextResponse.json({ 
      success: true, 
      alertsSent,
      locationsProcessed: Object.keys(locationGroups).length 
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
