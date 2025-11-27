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
    subject: 'Verify your EarnLab account',
    text: `Hi ${username || 'there'},\n\nWelcome to EarnLab!\n\nYour verification code is ${otpCode}. It expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <p>Hi ${username || 'there'},</p>
      <p>Welcome to EarnLab!</p>
      <p>Your verification code is <strong style="font-size:20px;letter-spacing:4px;">${otpCode}</strong>.</p>
      <p>The code expires in 15 minutes. If you did not request this, you can ignore this email.</p>
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
