// app/api/cron/daily-alerts/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// sanity checks so failures are obvious in logs
if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

// server-only Supabase client (service role)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // 1) read subscribers (verified only)
    const { data: subs, error } = await supabaseServer
      .from("email_subscribers")
      .select("email, location")
      .eq("verified", true);

    if (error) throw error;

    // 2) group by location
    const groups = {};
    for (const s of subs ?? []) {
      if (!s.email || !s.location) continue;
      (groups[s.location] ||= []).push(s.email);
    }

    let alertsSent = 0;
    let locationsProcessed = 0;

    // 3) fetch pollen and send (hard-coded to your live domain)
    for (const [location, emails] of Object.entries(groups)) {
      const pollenUrl = `https://mypollenpal.com/api/pollen?location=${encodeURIComponent(location)}`;
      const r = await fetch(pollenUrl, { cache: "no-store" });
      if (!r.ok) continue;

      const pollen = await r.json();
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
        locationsProcessed += 1;
      } else {
        console.error("Resend error:", send.error);
      }
    }

    return NextResponse.json({ ok: true, alertsSent, locationsProcessed });
  } catch (e) {
    console.error("Cron error:", e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
