// app/api/cron/daily-alerts/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase.server"; // server client with SERVICE_ROLE_KEY

export const runtime = "nodejs";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data: subs, error } = await supabaseServer
      .from("email_subscribers")
      .select("email, location")
      .eq("verified", true);

    if (error) throw error;

    const groups = {};
    for (const s of subs ?? []) {
      if (!s.email || !s.location) continue;
      (groups[s.location] ||= []).push(s.email);
    }

    let alertsSent = 0;
    let locationsProcessed = 0;

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
      }
    }

    return NextResponse.json({ ok: true, alertsSent, locationsProcessed });
  } catch (e) {
    console.error("Cron error:", e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
