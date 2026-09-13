export function buildWelcomeEmail({ email }) {
    const subject = "Welcome to EQB Creative Tech — you're subscribed";
    const preheader = "Course launches, TNPSC updates, events, and creative opportunities.";

    const text = [
        "Welcome to EQB Creative Tech",
        "",
        "Thanks for subscribing with " + email + ".",
        "",
        "You'll receive updates on:",
        "• New IT Academy and TNPSC Academy courses",
        "• Events, workshops, and creative opportunities",
        "• Tips and announcements from our team",
        "",
        "If you didn't request this, you can ignore this email.",
        "",
        "— EQB Creative Tech",
        "info@eqb.com"
    ].join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;color:transparent;">${preheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 15px 40px rgba(15,23,42,.08);">
          <tr>
            <td style="padding:40px 32px 28px;background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.85);">EQB Creative Tech</p>
              <h1 style="margin:0;font-size:28px;line-height:1.25;color:#ffffff;font-weight:700;">Stay Updated</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#0f172a;">Hi there,</p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#334155;">Thanks for subscribing with <strong style="color:#0f172a;">${email}</strong>. You're on the list for course launches, TNPSC updates, events, and creative opportunities from EQB Creative Tech.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                <tr><td style="padding:6px 0;font-size:15px;line-height:1.5;color:#475569;">✓ IT Academy &amp; TNPSC Academy news</td></tr>
                <tr><td style="padding:6px 0;font-size:15px;line-height:1.5;color:#475569;">✓ Workshops, events &amp; studio updates</td></tr>
                <tr><td style="padding:6px 0;font-size:15px;line-height:1.5;color:#475569;">✓ Tips and announcements from our team</td></tr>
              </table>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#64748b;">If you didn't request this subscription, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#94a3b8;text-align:center;">EQB Creative Tech · Chennai<br><a href="mailto:info@eqb.com" style="color:#2563eb;text-decoration:none;">info@eqb.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return { subject, text, html };
}
