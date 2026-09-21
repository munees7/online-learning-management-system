const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a welcome email to a newly registered user.
 * Must only be called when the user account is created for the first time.
 * Errors are caught and logged — they never cause registration to fail.
 *
 * @param {Object} user - The newly created User document
 * @param {string} user.name
 * @param {string} user.email
 */
const sendWelcomeEmail = async (user) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not set — skipping welcome email");
    return;
  }

  const firstName = user.name?.split(" ")[0] || "there";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to LearnHub</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">📚 LearnHub</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Your learning journey starts here</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-weight:700;">
                Welcome, ${firstName}! 🎉
              </h2>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">
                Your LearnHub account has been successfully created. We're excited to have you on board!
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">
                LearnHub gives you access to high-quality courses across a wide range of topics — taught by expert instructors and designed to help you grow at your own pace.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:10px;padding:14px 32px;">
                    <a href="${process.env.CLIENT_URL || "http://localhost:5173"}"
                       style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">
                      Start Learning →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Features list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;padding:20px 24px;margin-bottom:8px;">
                <tr><td style="padding:6px 0;color:#374151;font-size:14px;">✅ &nbsp;Browse hundreds of courses</td></tr>
                <tr><td style="padding:6px 0;color:#374151;font-size:14px;">✅ &nbsp;Track your learning progress</td></tr>
                <tr><td style="padding:6px 0;color:#374151;font-size:14px;">✅ &nbsp;Earn certificates on course completion</td></tr>
                <tr><td style="padding:6px 0;color:#374151;font-size:14px;">✅ &nbsp;Learn at your own pace, anytime</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">© ${new Date().getFullYear()} LearnHub. All rights reserved.</p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">You received this email because you created a LearnHub account.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Welcome to LearnHub, ${firstName}!

Your account has been successfully created.

LearnHub gives you access to high-quality courses taught by expert instructors — designed to help you grow at your own pace.

Get started: ${process.env.CLIENT_URL || "http://localhost:5173"}

What you can do on LearnHub:
- Browse hundreds of courses
- Track your learning progress
- Earn certificates on course completion
- Learn at your own pace, anytime

© ${new Date().getFullYear()} LearnHub. All rights reserved.
  `.trim();

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "LearnHub <onboarding@resend.dev>",
      to: user.email,
      subject: "Welcome to LearnHub! 🎉",
      html,
      text,
    });
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (err) {
    // Log the error type only — never log API keys or secrets
    console.error(`❌ Welcome email failed for ${user.email}: ${err.message}`);
  }
};

module.exports = { sendWelcomeEmail };
