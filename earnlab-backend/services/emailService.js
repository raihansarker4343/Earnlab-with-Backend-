const getApiKey = () =>
  process.env.ESEND_API_KEY || process.env.RESEND_API_KEY || process.env.ESEND_API_TOKEN;

let resendModulePromise;

const getResendClient = async (apiKey) => {
  if (!resendModulePromise) {
    resendModulePromise = import('resend').catch((error) => {
      console.warn('[email] Resend SDK not installed; falling back to HTTP request.', error?.message);
      return null;
    });
  }

  const module = await resendModulePromise;

  if (!module?.Resend) {
    return null;
  }

  return new module.Resend(apiKey);
};

const sendWithHttp = async (message, apiKey) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email send failed: ${response.status} ${errorText}`);
  }
};

const sendPasswordResetEmail = async (to, username, resetUrl) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('[email] Email provider API key is not configured. Logging reset link instead:', resetUrl);
    return;
  }

  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error('EMAIL_FROM must be set to send emails.');
  }

  const message = {
    from,
    to,
    subject: 'Reset your Earnello.com password',
    text: `Hi ${username || 'there'},\n\nWe received a request to reset your Earnello.com password.\nUse the link below to choose a new password:\n${resetUrl}\n\nIf you did not request this change, you can safely ignore this email. The link will expire in 60 minutes.`,
    html: `
      <p>Hi ${username || 'there'},</p>
      <p>We received a request to reset your Earnello.com password.</p>
      <p><a href="${resetUrl}" style="color:#16a34a;font-weight:bold;">Reset your password</a></p>
      <p>If the button above does not work, copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>If you did not request this change, you can safely ignore this email. The link will expire in 60 minutes.</p>
    `,
  };

  const resendClient = await getResendClient(apiKey);

  if (resendClient) {
    const { error } = await resendClient.emails.send(message);

    if (error) {
      throw new Error(`Email send failed: ${error.message || error}`);
    }

    return;
  }

  await sendWithHttp(message, apiKey);
};

const sendVerificationEmail = async (to, username, otpCode) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('[email] Email provider API key is not configured. Logging verification code instead:', otpCode);
    return;
  }

  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error('EMAIL_FROM must be set to send emails.');
  }

 const message = {
    from,
    to,
    subject: 'Verify your Earnello.com account',
    text: `Hi ${username || 'there'},\n\nWelcome to Earnello.com!\n\nYour verification code is ${otpCode}. It expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Verify your Earnello.com account</title>
  </head>

  <body style="margin:0; padding:0; background:#f5f7fb; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb; padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
              <td style="padding:24px 28px; background:#0f172a; color:#ffffff;">
                <div style="font-size:20px; font-weight:700;">Earnello.com</div>
                <div style="font-size:13px; opacity:0.8; margin-top:4px;">Email Verification</div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px;">
                <h2 style="margin:0 0 10px; font-size:20px; color:#0f172a;">
                  Welcome to Earnello.com, ${username || "there"}!
                </h2>

                <p style="margin:0 0 16px; font-size:15px; color:#334155; line-height:1.6;">
                  Please confirm your email address using the verification code below:
                </p>

                <div style="text-align:center; margin:20px 0;">
                  <div style="display:inline-block; font-size:26px; letter-spacing:6px; font-weight:700;
                              color:#0f172a; background:#f1f5f9; padding:14px 22px; border-radius:10px;">
                    ${otpCode}
                  </div>
                </div>

                <p style="margin:0 0 8px; font-size:14px; color:#475569;">
                  This code will expire in <strong>15 minutes</strong>.
                </p>

                <p style="margin:0; font-size:14px; color:#475569;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px; background:#f8fafc; font-size:12px; color:#64748b; text-align:center;">
                © ${new Date().getFullYear()} Earnello.com. All rights reserved. <br />
                Need help? Contact us at
                <a href="mailto:support@earnello.com" style="color:#0f172a; text-decoration:none;">
                  support@earnello.com
                </a>
              </td>
            </tr>

          </table>

          <div style="width:600px; text-align:center; font-size:11px; color:#94a3b8; margin-top:10px;">
            This is an automated message. Please do not reply directly to this email.
          </div>

        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  };


  const resendClient = await getResendClient(apiKey);

  if (resendClient) {
    const { error } = await resendClient.emails.send(message);

    if (error) {
      throw new Error(`Email send failed: ${error.message || error}`);
    }

    return;
  }

  await sendWithHttp(message, apiKey);
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };