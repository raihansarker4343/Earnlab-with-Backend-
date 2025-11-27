<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Bl1S8plPbf92couVOkJZ7qaFGXFF7LwO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend password reset email setup

The Express backend can send password reset links via email. Configure the following environment variables in `earnlab-backend/.env` (or your deployment environment) so the new `/api/auth/forgot-password` endpoint can send reset links:

- `SMTP_HOST` / `SMTP_PORT` (+ optional `SMTP_SECURE`) for your SMTP provider
- `SMTP_USER` / `SMTP_PASS` for authentication
- `EMAIL_FROM` for the "from" address (defaults to `SMTP_USER` if omitted)
- `FRONTEND_URL` pointing to your deployed frontend (used to build the reset link)

If SMTP is not configured in a local environment, the backend will log the reset link to the console so you can test the flow without sending an email.
