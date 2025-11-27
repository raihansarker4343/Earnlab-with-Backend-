const nodemailer = require('nodemailer');

const isSmtpConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT);

const buildTransporter = () => {
  const port = Number(process.env.SMTP_PORT);
  const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: isSecure,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
};

const sendPasswordResetEmail = async (to, username, resetUrl) => {
  if (!isSmtpConfigured()) {
    console.warn('[email] SMTP is not configured. Logging reset link instead:', resetUrl);
    return;
  }

  const transporter = buildTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error('EMAIL_FROM or SMTP_USER must be set to send emails.');
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

  await transporter.sendMail(message);
};

module.exports = { sendPasswordResetEmail };
