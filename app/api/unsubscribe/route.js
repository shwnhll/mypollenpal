import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const { error } = await supabase
    .from("email_subscribers")
    .update({ verified: false })
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Simple confirmation HTML
  return new Response(
    `<html><body style="font-family:sans-serif;">
       <h2>You’ve been unsubscribed</h2>
       <p>${email} will no longer receive pollen alerts.</p>
     </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
