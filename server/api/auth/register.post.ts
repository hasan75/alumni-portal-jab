import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, full_name, batch_year, student_id, phone } = body

  if (!email || !password || !full_name) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = config.supabaseServiceKey

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  // Use service role to bypass RLS for registration
  const adminSupabase = createClient(supabaseUrl, serviceKey)

  // 1. Create auth user
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
    }
    throw createError({ statusCode: 400, statusMessage: authError.message })
  }

  const userId = authData.user?.id
  if (!userId) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
  }

  // 2. Create alumni profile with status = 'pending'
  const { error: profileError } = await adminSupabase
    .from('alumni_profiles')
    .insert({
      id: userId,
      email,
      full_name,
      batch_year: batch_year ? Number(batch_year) : null,
      student_id: student_id || null,
      phone: phone || null,
      status: 'pending',
    })

  if (profileError) {
    // Cleanup the created auth user
    await adminSupabase.auth.admin.deleteUser(userId).catch(() => {})
    throw createError({ statusCode: 500, statusMessage: 'Failed to create profile' })
  }

  const appName = config.public.appName as string
  const siteUrl = config.public.siteUrl as string
  await sendEmail({
    to: email,
    subject: `${appName} — Registration Received`,
    html: registrationConfirmationEmail({ fullName: full_name, appName, siteUrl }),
  })

  return { success: true, message: 'Registration submitted. Awaiting admin approval.' }
})
