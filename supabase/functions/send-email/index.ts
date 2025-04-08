import nodemailer from "npm:nodemailer@6.9.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "mahlatsi.malicke76@gmail.com",
    pass: "erxr owre tsoz yasn",
  },
});

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { record } = await req.json();
    
    if (!record || !record.name || !record.email || !record.message) {
      throw new Error("Missing required fields in request");
    }
    
    const { name, email, message } = record;

    // Send email
    await transporter.sendMail({
      from: '"Contact Form" <mahlatsi.malicke76@gmail.com>',
      to: "mahlatsi.malicke76@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
New contact form submission:

Name: ${name}
Email: ${email}
Message: ${message}

This is an automated message from your website contact form.
      `,
      html: `
<h2>New contact form submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong> ${message}</p>
<br>
<p><em>This is an automated message from your website contact form.</em></p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});