import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    await resend.emails.send({
      from: 'MyPollenPal <alerts@mypollenpal.com>',
      to: ['shawn@317marketing.com'], // Use your email for testing
      subject: 'Test Email from MyPollenPal',
      html: '<h1>Email system working!</h1>'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
