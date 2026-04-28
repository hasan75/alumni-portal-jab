interface BaseTemplateOptions {
  appName: string
  siteUrl: string
  content: string
  logoUrl?: string
}

function baseTemplate({ appName, siteUrl, content, logoUrl }: BaseTemplateOptions): string {
  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="${appName}" width="60" height="60" style="display:block;margin:0 auto 12px;border-radius:12px;width:60px;height:60px;object-fit:cover;" />`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${appName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 20px;">
<tr><td align="center">

<!-- Header -->
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding:0 0 24px;text-align:center;">
  ${logoHtml}
  <span style="font-size:22px;font-weight:700;color:#2563EB;letter-spacing:-0.3px;">${appName}</span>
</td></tr>
</table>

<!-- Card -->
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td style="padding:40px 36px;">
  ${content}
</td></tr>
</table>

<!-- Footer -->
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding:24px 0;text-align:center;">
  <p style="margin:0;font-size:13px;color:#94a3b8;">
    <a href="${siteUrl}" style="color:#64748b;text-decoration:none;">${appName}</a>
  </p>
  <p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">
    You received this email because of your account activity.
  </p>
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`
}

export function registrationConfirmationEmail(opts: { fullName: string, appName: string, siteUrl: string, logoUrl?: string }): string {
  const content = `
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1e293b;letter-spacing:-0.3px;">Application Received</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.5;">Hi ${opts.fullName},</p>
  <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
    Thank you for registering with <strong>${opts.appName}</strong>. Your application has been submitted and is currently under review by our administrators.
  </p>
  <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
    You'll receive an email once your account has been approved. This usually takes 1–2 business days.
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
  <tr><td style="background:#f1f5f9;border-radius:12px;padding:16px 20px;">
    <p style="margin:0;font-size:14px;color:#64748b;line-height:1.5;">
      <strong style="color:#475569;">What happens next?</strong><br>
      Our team will verify your details and activate your account. Once approved, you'll have access to the member directory, events, jobs board, and more.
    </p>
  </td></tr>
  </table>`

  return baseTemplate({ appName: opts.appName, siteUrl: opts.siteUrl, content, logoUrl: opts.logoUrl })
}

export function approvalEmail(opts: { fullName: string, appName: string, siteUrl: string, logoUrl?: string }): string {
  const loginUrl = `${opts.siteUrl}/login`
  const content = `
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1e293b;letter-spacing:-0.3px;">Welcome Aboard!</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.5;">Hi ${opts.fullName},</p>
  <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
    Great news — your <strong>${opts.appName}</strong> account has been approved! You now have full access to the alumni portal.
  </p>
  <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
    Log in to connect with fellow alumni, browse events, explore job opportunities, and more.
  </p>
  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
  <tr><td style="background:#2563EB;border-radius:12px;">
    <a href="${loginUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">Log In Now &rarr;</a>
  </td></tr>
  </table>
  <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
    Or copy this link: <a href="${loginUrl}" style="color:#2563EB;text-decoration:none;">${loginUrl}</a>
  </p>`

  return baseTemplate({ appName: opts.appName, siteUrl: opts.siteUrl, content, logoUrl: opts.logoUrl })
}

export function adminInviteEmail(opts: { fullName: string, appName: string, siteUrl: string, inviteLink: string, logoUrl?: string }): string {
  const content = `
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1e293b;letter-spacing:-0.3px;">You've Been Invited!</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.5;">Hi ${opts.fullName},</p>
  <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
    An administrator has created an account for you on <strong>${opts.appName}</strong>. To get started, set your password using the button below.
  </p>
  <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
    Once your password is set, you'll have access to the alumni directory, events, jobs board, and more.
  </p>
  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
  <tr><td style="background:#2563EB;border-radius:12px;">
    <a href="${opts.inviteLink}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">Set Password &amp; Log In &rarr;</a>
  </td></tr>
  </table>
  <p style="margin:0 0 24px;font-size:13px;color:#94a3b8;text-align:center;">
    Or copy this link: <a href="${opts.inviteLink}" style="color:#2563EB;text-decoration:none;word-break:break-all;">${opts.inviteLink}</a>
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
  <tr><td style="background:#f1f5f9;border-radius:12px;padding:16px 20px;">
    <p style="margin:0;font-size:14px;color:#64748b;line-height:1.5;">
      <strong style="color:#475569;">Note:</strong> This invite link expires in 24 hours. If it expires, contact your administrator to resend the invitation.
    </p>
  </td></tr>
  </table>`

  return baseTemplate({ appName: opts.appName, siteUrl: opts.siteUrl, content, logoUrl: opts.logoUrl })
}

export function passwordResetEmail(opts: { fullName: string, appName: string, siteUrl: string, resetLink: string, logoUrl?: string }): string {
  const content = `
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1e293b;letter-spacing:-0.3px;">Reset Your Password</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.5;">Hi ${opts.fullName},</p>
  <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
    We received a request to reset your <strong>${opts.appName}</strong> password. Click the button below to choose a new password.
  </p>
  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
  <tr><td style="background:#2563EB;border-radius:12px;">
    <a href="${opts.resetLink}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">Reset Password &rarr;</a>
  </td></tr>
  </table>
  <p style="margin:0 0 24px;font-size:13px;color:#94a3b8;text-align:center;">
    Or copy this link: <a href="${opts.resetLink}" style="color:#2563EB;text-decoration:none;word-break:break-all;">${opts.resetLink}</a>
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
  <tr><td style="background:#fef9c3;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;">
    <p style="margin:0;font-size:14px;color:#92400e;line-height:1.5;">
      This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
    </p>
  </td></tr>
  </table>`

  return baseTemplate({ appName: opts.appName, siteUrl: opts.siteUrl, content, logoUrl: opts.logoUrl })
}

export function rejectionOrSuspensionEmail(opts: { fullName: string, appName: string, siteUrl: string, status: 'rejected' | 'suspended', logoUrl?: string }): string {
  const isRejected = opts.status === 'rejected'
  const title = isRejected ? 'Application Update' : 'Account Suspended'
  const message = isRejected
    ? `After reviewing your application, we're unable to approve your <strong>${opts.appName}</strong> account at this time.`
    : `Your <strong>${opts.appName}</strong> account has been temporarily suspended by an administrator.`

  const content = `
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1e293b;letter-spacing:-0.3px;">${title}</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.5;">Hi ${opts.fullName},</p>
  <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
    ${message}
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
  <tr><td style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;">
    <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.5;">
      If you believe this is an error or have questions, please reach out to the administrators for further assistance.
    </p>
  </td></tr>
  </table>`

  return baseTemplate({ appName: opts.appName, siteUrl: opts.siteUrl, content, logoUrl: opts.logoUrl })
}
