# Email System Setup Guide

This project uses **Resend** for transactional emails (registration confirmation, approval/rejection notifications). Resend's free tier provides 3,000 emails/month — no credit card required.

---

## 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up (GitHub or email).
2. After signing in, you land on the dashboard.

## 2. Get Your API Key

1. Navigate to **API Keys** in the left sidebar ([resend.com/api-keys](https://resend.com/api-keys)).
2. Click **Create API Key**.
3. Give it a name (e.g. `alumni-portal`) and select **Sending access** permission.
4. Copy the key — it starts with `re_`. You won't be able to see it again.

## 3. Add Environment Variables

Open your `.env` file (copy from `.env.example` if you haven't already) and add:

```env
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=Alumni Portal <noreply@yourdomain.com>
```

### About `RESEND_FROM_EMAIL`

- **For testing/development**: Use `onboarding@resend.dev` — this is Resend's sandbox sender that works immediately without domain verification. Emails will only be delivered to the email address associated with your Resend account.

  ```env
  RESEND_FROM_EMAIL=Alumni Portal <onboarding@resend.dev>
  ```

- **For production**: You must verify your own domain first (see step 4 below), then use an address on that domain.

  ```env
  RESEND_FROM_EMAIL=Alumni Portal <noreply@yourdomain.com>
  ```

The format is `Display Name <email@domain.com>`. The display name is what recipients see in their inbox.

## 4. Verify Your Domain (Production Only)

Skip this step if you're just testing locally with `onboarding@resend.dev`.

1. In the Resend dashboard, go to **Domains** ([resend.com/domains](https://resend.com/domains)).
2. Click **Add Domain** and enter your domain (e.g. `yourdomain.com`).
3. Resend will show you DNS records to add:
   - **MX record** — for bounce handling
   - **TXT record** — SPF authentication
   - **CNAME records** — DKIM signing
4. Add these records in your domain's DNS provider (Cloudflare, Namecheap, Route53, etc.).
5. Click **Verify** in Resend. DNS propagation can take a few minutes to 48 hours.
6. Once verified, the domain status shows **Verified** and you can send from any address on that domain.

## 5. Verify It Works

1. Start the dev server:

   ```bash
   pnpm dev
   ```

2. Register a new member at `/register`. Check the inbox of the email you registered with — you should receive a "Registration Received" confirmation email.

3. Log into the admin panel at `/admin/login`, go to **Members**, and approve the pending member. The member should receive a "Welcome — Account Approved" email.

---

## How It Works

### Email Events

| Event | Trigger | Email Sent To |
|-------|---------|---------------|
| **Registration** | User submits the registration form | The registering user |
| **Admin Invite** | Admin creates a member from the admin panel | The invited member (with password-set link) |
| **Approval** | Admin approves a member (single or bulk) | Each approved member |
| **Rejection** | Admin rejects a pending member | The rejected member |
| **Suspension** | Admin suspends an active member | The suspended member |
| **Password Reset** | Member clicks "Forgot password?" on login page | The requesting member (rate-limited: 1 per 60s per email) |

### Architecture

Emails are sent server-side only — the Resend API key never reaches the browser.

```
server/
  utils/
    email.ts               # sendEmail() helper — calls Resend API via fetch()
    email-templates.ts     # Branded HTML templates for each email type
  api/
    auth/
      register.post.ts     # Sends registration confirmation after signup
      forgot-password.post.ts  # Rate-limited, generates reset link, sends branded email
      change-password.post.ts  # Verifies current password, updates via admin API
    members/
      approve.post.ts      # Updates status + sends approval email
      reject.post.ts       # Updates status + sends rejection email
      suspend.post.ts      # Updates status + sends suspension email
```

The composable `app/composables/useMembers.ts` calls these server routes for approve/reject/suspend actions, so the admin panel works exactly as before — just with emails now included.

### Error Resilience

Email failures never block the main operation. If Resend is down or the API key is invalid:
- Registration still completes successfully
- Member approval/rejection/suspension still updates the database
- Errors are logged to the server console for debugging

### Configuration in `nuxt.config.ts`

The Resend keys are in `runtimeConfig` (server-only, not exposed to the client):

```ts
runtimeConfig: {
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'Alumni Portal <noreply@yourdomain.com>',
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No emails arriving | Check server console for `[email]` log messages. Verify `RESEND_API_KEY` is set in `.env`. |
| "RESEND_API_KEY not configured" in logs | The env var is missing or the server wasn't restarted after adding it. Restart with `pnpm dev`. |
| Emails only arrive to your own address | You're using `onboarding@resend.dev` as the sender. Verify your domain to send to anyone. |
| "Resend API error: 403" | The API key doesn't have sending permission, or it's been revoked. Generate a new one. |
| "Resend API error: 422" | The `from` address uses an unverified domain. Verify it in the Resend dashboard or use `onboarding@resend.dev`. |
| Registration/approval works but no email | This is by design — email failures are non-blocking. Check server logs for the specific error. |

## Free Tier Limits

- **3,000 emails/month**
- **100 emails/day**
- No credit card required
- No Resend branding on emails
- Single sending domain

For most alumni portals this is more than sufficient. If you need higher volume, Resend's Pro plan starts at $20/month for 50,000 emails.
