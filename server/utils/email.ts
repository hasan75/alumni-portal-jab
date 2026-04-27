interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
}

interface SendEmailResult {
  success: boolean
  error?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not configured — skipping email send')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.resendFromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error(`[email] Resend API error ${response.status}: ${body}`)
      return { success: false, error: `Resend API error: ${response.status}` }
    }

    return { success: true }
  }
  catch (err: any) {
    console.error('[email] Failed to send:', err.message)
    return { success: false, error: err.message }
  }
}
