import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'New password must be at least 8 characters' })
  }

  const userClient = await serverSupabaseClient(event)
  const { data: { user } } = await userClient.auth.getUser()

  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
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

  const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update password' })
  }

  return { success: true }
})
