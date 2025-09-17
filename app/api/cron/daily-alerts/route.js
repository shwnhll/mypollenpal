// app/api/cron/daily-alerts/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ensure Node runtime on Vercel

// --- sanity checks so failures are obvious in logs ---
if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

// Server-only Supabase client (SERVICE ROLE KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Hardcode your live site base URL
const SITE = "https://mypollenpal.com";

export async function GET() {
  try {
    // 1) Read verified subscribers
    const { data: subs, error } = await supabase
      .from("email_subscribers")
      .select("email, location")
      .eq("verified", true);

    if (error) throw error;

    // 2) Group emails by location (one pollen fetch per location)
    const byLocation = {};
    for (const s of subs ?? []) {
      if (!s?.email || !s?.location) continue;
      (byLocation[s.location] ||= []).push(s.email);
    }

    let locationsProcessed = 0;
    let alertsSent = 0;

    // 3) For each location → fetch pollen → decide → email
    for (const [location, emails] of Object.entries(byLocation)) {
      try {
        const pollenUrl = `${SITE}/api/pollen?location=${encodeURIComponent(location)}`;
        const r = await fetch(pollenUrl, { cache: "no-store" });

        if (!r.ok) {
          const t = await r.text().catch(() => "");
          console.error("Pollen fetch failed", { location, status: r.status, t });
          continue;
        }

        const pollen = await r.json();

        // --- ONLY SEND WHEN HIGH / VERY HIGH ---
        // Adjust if your /api/pollen uses numbers instead.
        const level = String(pollen?.today?.level || "").toLowerCase();
        const shouldSend = level === "high" || level === "very high";
        if (!shouldSend) {
          // skip quiet days
          continue;
        }

        // 4) Human-friendly message + homepage link + unsubscribe
        const homepageUrl = `${SITE}/?loc=${encodeURIComponent(location)}`;
        // Use one visible unsubscribe link (works even if you don’t have the page yet)
        const unsubscribeUrl = `${SITE}/unsubscribe`;

        const subject = `Pollen in ${location} — ${pollen?.today?.level ?? "Update"}`;

        const html = `
          <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5">
            <h2 style="margin:0 0 8px">Today’s pollen in ${location}</h2>
            <p><b>${pollen?.today?.level ?? "—"}</b> · Tree ${pollen?.today?.tree ?? "—"} · Grass ${pollen?.today?.grass ?? "—"} · Weed ${pollen?.today?.weed ?? "—"}</p>
            <p><a href="${homepageUrl}">See the full breakdown on MyPollenPal</a></p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
            <p style="color:#667085;font-size:12px">
              Don’t want these? <a href="${unsubscribeUrl}">Unsubscribe</a>
            </p>
          </div>
        `;

        const text = `Pollen in ${location}: ${pollen?.today?.level ?? "Update"}.
Tree ${pollen?.today?.tree ?? "-"}, Grass ${pollen?.today?.grass ?? "-"}, Weed ${pollen?.today?.weed ?? "-"}.
Full breakdown: ${homepageUrl}
Unsubscribe: ${unsubscribeUrl}`;

        const send = await resend.emails.send({
          from: "MyPollenPal <alerts@mypollenpal.com>",
          to: emails, // send to everyone in this location
          subject,
          html,
          text,
          headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` }
        });

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
