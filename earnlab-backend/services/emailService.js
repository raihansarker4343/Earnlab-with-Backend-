const getApiKey = () =>
  process.env.ESEND_API_KEY || process.env.RESEND_API_KEY || process.env.ESEND_API_TOKEN;

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
    subject: 'Reset your EarnLab password',
    text: `Hi ${username || 'there'},\n\nWe received a request to reset your EarnLab password.\nUse the link below to choose a new password:\n${resetUrl}\n\nIf you did not request this change, you can safely ignore this email. The link will expire in 60 minutes.`,
    html: `
      <p>Hi ${username || 'there'},</p>
      <p>We received a request to reset your EarnLab password.</p>
      <p><a href="${resetUrl}" style="color:#16a34a;font-weight:bold;">Reset your password</a></p>
      <p>If the button above does not work, copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>If you did not request this change, you can safely ignore this email. The link will expire in 60 minutes.</p>
    `,
  };

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

module.exports = { sendPasswordResetEmail };
