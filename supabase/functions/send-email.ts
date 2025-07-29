import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const FROM_EMAIL = "info@communitysimple.ai"; // Use your verified sender
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
}
serve(async (req)=>{
  console.log("[send-email] Function called. Method:", req.method);
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }
  if (req.method !== "POST") {
    console.log("[send-email] Method not allowed:", req.method);
    return new Response(JSON.stringify({
      error: "Method Not Allowed"
    }), {
      status: 405,
      headers: corsHeaders()
    });
  }
  try {
    const { to, subject, html } = await req.json();
    console.log("[send-email] Request body:", { to, subject, html });
    if (!to || !subject || !html) {
      console.error("[send-email] Missing required fields:", { to, subject, html });
      return new Response(JSON.stringify({
        error: "Missing required fields"
      }), {
        status: 400,
        headers: corsHeaders()
      });
    }
    console.log(`[send-email] Sending email to: ${to}, subject: ${subject}`);
    const sgResp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: to
              }
            ]
          }
        ],
        from: {
          email: FROM_EMAIL
        },
        subject,
        content: [
          {
            type: "text/html",
            value: html
          }
        ]
      })
    });
    console.log("[send-email] SendGrid response status:", sgResp.status);
    if (!sgResp.ok) {
      const errorText = await sgResp.text();
      console.error("[send-email] SendGrid error:", errorText);
      return new Response(JSON.stringify({
        error: "Failed to send email",
        details: errorText
      }), {
        status: 500,
        headers: corsHeaders()
      });
    }
    console.log(`[send-email] Email sent successfully to: ${to}`);
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    console.error("[send-email] Exception:", err);
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 400,
      headers: corsHeaders()
    });
  }
}); 