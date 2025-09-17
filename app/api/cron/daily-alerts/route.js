// app/api/cron/daily-alerts/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase.server"; // server client with SERVICE_ROLE_KEY

export const runtime = "nodejs";
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    // 1. Get subscribers
    const { data: subs, error } = await supabaseServer
      .from("email_subscribers")
      .select("email, location")
      .eq("verified", true);

    if (error) throw error;

    let alertsSent = 0;
    let locationsProcessed = 0;

    // 2. Group by location
    const groups: Record<string, string[]> = {};
    for (const sub of subs ?? []) {
      if (!sub.email || !sub.location) continue;
      if (!groups[sub.location]) groups[sub.location] = [];
      groups[sub.location].push(sub.email);
    }

    // 3. For each location, fetch pollen + send one email
    for (const [location, emails] of Object.entries(groups)) {
      const pollenUrl = `https://mypollenpal.com/api/pollen?location=${encodeURIComponent(location)}`;
      const res = await fetch(pollenUrl);
      if (!res.ok) continue;

      const pollen = await res.json();
      // TEMP: always send (to confirm pipeline works)
      const subject = `Pollen update for ${location}`;
      const html = `<h2>Pollen in ${location}</h2><pre>${JSON.stringify(pollen, null, 2)}</pre>`;

      const send = await resend.emails.send({
        from: "MyPollenPal <alerts@mypollenpal.com>",
        to: emails,
        subject,
        html,
      });

      if (!send.error) {
        alertsSent += emails.length;
        locationsProcessed++;
      }
    }

    return NextResponse.json({ ok: true, alertsSent, locationsProcessed });
  } catch (e: any) {
    console.error("Cron error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
