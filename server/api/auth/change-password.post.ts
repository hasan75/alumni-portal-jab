import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

const rateLimitMap = new Map<string, { count: number, resetAt: number }>()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  if (newPassword.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Password must not exceed 128 characters' })
  }
  const pwCheck = validatePassword(newPassword)
  if (!pwCheck.valid) {
    throw createError({ statusCode: 400, statusMessage: pwCheck.message! })
  }

  const userClient = await serverSupabaseClient(event)
  const { data: { user } } = await userClient.auth.getUser()

  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const now = Date.now()
  const windowMs = import.meta.dev ? 5000 : 60000
  const maxAttempts = 5
  const entry = rateLimitMap.get(user.id)

  if (entry && now < entry.resetAt) {
    if (entry.count >= maxAttempts) {
      throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Try again later.' })
    }
    entry.count++
  }
  else {
    rateLimitMap.set(user.id, { count: 1, resetAt: now + windowMs })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = config.supabaseServiceKey

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const adminSupabase = createClient(supabaseUrl, serviceKey)

  const { data: profile } = await adminSupabase
    .from('alumni_profiles')
    .select('email')
    .eq('id', user.id)
    .single()

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const { error: signInError } = await adminSupabase.auth.signInWithPassword({
    email: profile.email,
    password: currentPassword,
  })

  if (signInError) {
    throw createError({ statusCode: 403, statusMessage: 'Current password is incorrect' })
  }

  await adminSupabase.auth.signOut()

  const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update password' })
  }

  return { success: true }
})
