// app/api/cron/daily-alerts/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// sanity checks
if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

// server-only Supabase client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE = "https://mypollenpal.com";

export async function GET() {
  try {
    // 1) read verified subscribers
    const { data: subs, error } = await supabase
      .from("email_subscribers")
      .select("email, location")
      .eq("verified", true);

    if (error) throw error;

    // 2) group by location (one pollen fetch per location)
    const byLocation = {};
    for (const s of subs ?? []) {
      if (!s?.email || !s?.location) continue;
      (byLocation[s.location] ||= []).push(s.email);
    }

    let locationsProcessed = 0;
    let alertsSent = 0;

    for (const [location, emails] of Object.entries(byLocation)) {
      try {
        // 3) fetch pollen once for this location
        const pollenUrl = `${SITE}/api/pollen?location=${encodeURIComponent(location)}`;
        const r = await fetch(pollenUrl, { cache: "no-store" });
        if (!r.ok) {
          const t = await r.text().catch(() => "");
          console.error("Pollen fetch failed", { location, status: r.status, t });
          continue;
        }
        const pollen = await r.json();

        // 4) send only if ANY category is High / Very High (word-based)
        const { tree = {}, grass = {}, weed = {} } = pollen?.current || {};
        const statuses = [tree.status, grass.status, weed.status].map(s => String(s || "").toLowerCase());
        const shouldSend = statuses.some(s => s === "high" || s === "very high");
        if (!shouldSend) continue; // skip quiet days

        // 5) human-friendly email with homepage link + unsubscribe
        const homepageUrl = "https://www.mypollenpal.com/";
        const unsubscribeUrl = `${SITE}/unsubscribe`;

        const subject = `Pollen in ${location} — alert`;
        const html = `
          <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5">
            <h2 style="margin:0 0 8px">Today’s pollen in ${location}</h2>
            <ul>
              <li>Tree: <b>${tree.status ?? "-"}</b></li>
              <li>Grass: <b>${grass.status ?? "-"}</b></li>
              <li>Weed: <b>${weed.status ?? "-"}</b></li>
            </ul>
            <p><a href="${homepageUrl}">Visit MyPollenPal</a></p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
            <p style="color:#667085;font-size:12px">
              Don’t want these? <a href="${unsubscribeUrl}">Unsubscribe</a>
            </p>
          </div>
        `;
        const text = `Pollen in ${location}
Tree: ${tree.status ?? "-"}, Grass: ${grass.status ?? "-"}, Weed: ${weed.status ?? "-"}
Full breakdown: ${homepageUrl}
Unsubscribe: ${unsubscribeUrl}`;

        for (const email of emails) {
  const send = await resend.emails.send({
    from: "MyPollenPal <alerts@mypollenpal.com>",
    to: email,          // ✅ one recipient per send
    subject,
    html,
    text,
    headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` }
  });

  if (send?.error) {
    console.error("Resend error", { location, email, error: send.error });
  } else {
    alertsSent += 1;
  }
}
// locationsProcessed += 1; // keep this if the location processed successfully


        if (send?.error) {
          console.error("Resend error", { location, error: send.error });
          continue;
        }

        alertsSent += emails.length;
        locationsProcessed += 1;
      } catch (err) {
        console.error("Location processing error", { location, err });
        continue;
      }
    }

    return NextResponse.json({ ok: true, alertsSent, locationsProcessed });
  } catch (e) {
    console.error("Cron error:", e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
