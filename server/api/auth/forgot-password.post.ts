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
  const siteUrl = config.public.siteUrl as string

  const { data: profile } = await adminSupabase
    .from('alumni_profiles')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (profile) {
    await adminSupabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${siteUrl}/auth/reset-password`,
    })
  }

  return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' }
})
