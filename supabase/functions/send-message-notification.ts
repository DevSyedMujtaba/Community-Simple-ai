import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const FROM_EMAIL = "info@communitysimple.ai";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");
const SUPABASE_PROJECT_URL = Deno.env.get("PROJECT_URL") || "https://yurteupcbisnkcrtjsbv.supabase.co";
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
}
serve(async (req)=>{
  console.log("[send-message-notification] Function called. Method:", req.method);
  if (req.method !== "POST") {
    console.log("[send-message-notification] Method not allowed:", req.method);
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders()
    });
  }
  try {
    // Only check Authorization header if present
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      // Optionally, you can validate the token here if you want to keep security for external requests
      // For now, just log it
      console.log("[send-message-notification] Authorization header present");
    } else {
      // No Authorization header, likely from database trigger
      console.log("[send-message-notification] No Authorization header, accepting as DB trigger");
    }
    const { user_id, name, type } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: corsHeaders()
      });
    }
    // Look up user email from Supabase Auth (Admin API)
    const userResp = await fetch(
      `${SUPABASE_PROJECT_URL}/auth/v1/admin/users/${user_id}`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!userResp.ok) {
      const errorText = await userResp.text();
      console.error("[send-message-notification] Error fetching user:", errorText);
      return new Response(JSON.stringify({ error: "Failed to fetch user", details: errorText }), {
        status: 500,
        headers: corsHeaders()
      });
    }
    const userData = await userResp.json();
    const email = userData.user?.email || userData.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 404,
        headers: corsHeaders()
      });
    }
    console.log(`[send-message-notification] Sending email to: ${email}, name: ${name}, type: ${type}`);
    let subject = "You have a new message on Community Simple";
    let html = `<h2>Hey${name ? ' ' + name : ''}, you got a new message!</h2>\n<p>Come check it out on your <a href=\"https://communitysimple.ai/login\">dashboard</a>.</p>`;
    if (type === "notice") {
      subject = "You have a new notice on Community Simple";
      html = `<h2>Hey${name ? ' ' + name : ''}, you got a new notice!</h2>\n<p>Come check it out on your <a href=\"https://communitysimple.ai/login\">dashboard</a>.</p>`;
    }
    const sgResp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [ { email } ]
          }
        ],
        from: { email: FROM_EMAIL },
        subject,
        content: [ { type: "text/html", value: html } ]
      })
    });
    console.log("[send-message-notification] SendGrid response status:", sgResp.status);
    if (!sgResp.ok) {
      const errorText = await sgResp.text();
      console.error("[send-message-notification] SendGrid error:", errorText);
      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
        headers: corsHeaders()
      });
    }
    console.log(`[send-message-notification] Email sent successfully to: ${email}`);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    console.error("[send-message-notification] Exception:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: corsHeaders()
    });
  }
}); 