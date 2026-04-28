import { createClient } from '@supabase/supabase-js'

const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_SECONDS = 60

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  const normalizedEmail = email.toLowerCase().trim()

  const lastRequest = rateLimitMap.get(normalizedEmail)
  if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_SECONDS * 1000) {
    return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' }
  }
  rateLimitMap.set(normalizedEmail, Date.now())

  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = config.supabaseServiceKey

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const adminSupabase = createClient(supabaseUrl, serviceKey)

  const { data: profile } = await adminSupabase
    .from('alumni_profiles')
    .select('full_name')
    .eq('email', normalizedEmail)
    .single()

  if (profile) {
    const appName = config.public.appName as string
    const siteUrl = config.public.siteUrl as string

    const { data: linkData } = await adminSupabase.auth.admin.generateLink({
      type: 'recovery',
      email: normalizedEmail,
      options: { redirectTo: `${siteUrl}/auth/confirm` },
    })

    const resetLink = linkData?.properties?.action_link
    if (resetLink) {
      await sendEmail({
        to: normalizedEmail,
        subject: `${appName} — Reset Your Password`,
        html: passwordResetEmail({ fullName: profile.full_name, appName, siteUrl, resetLink }),
      })
    }
  }

  return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' }
})
