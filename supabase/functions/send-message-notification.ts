import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const FROM_EMAIL = "info@communitysimple.ai";
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
    const { email, name } = await req.json();
    console.log("[send-message-notification] Request body:", { email, name });
    console.log(`[send-message-notification] Sending email to: ${email}, name: ${name}`);
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
                email
              }
            ]
          }
        ],
        from: {
          email: FROM_EMAIL
        },
        subject: "You have a new message on Community Simple",
        content: [
          {
            type: "text/html",
            value: `<h2>Hey${name ? ' ' + name : ''}, you got a new message!</h2>\n                  <p>Come check it out on your <a href=\"https://communitysimple.ai/login\">dashboard</a>.</p>`
          }
        ]
      })
    });
    console.log("[send-message-notification] SendGrid response status:", sgResp.status);
    if (!sgResp.ok) {
      const errorText = await sgResp.text();
      console.error("[send-message-notification] SendGrid error:", errorText);
      return new Response(JSON.stringify({
        error: errorText
      }), {
        status: 500,
        headers: corsHeaders()
      });
    }
    console.log(`[send-message-notification] Email sent successfully to: ${email}`);
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    console.error("[send-message-notification] Exception:", err);
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 400,
      headers: corsHeaders()
    });
  }
}); 