import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, full_name, admin_id, batch_year, student_id, phone, department, degree, current_status, city, country, status } = body

  if (!email || !full_name || !admin_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = config.supabaseServiceKey

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const adminSupabase = createClient(supabaseUrl, serviceKey)

  const { data: adminCheck } = await adminSupabase
    .from('admin_users')
    .select('id')
    .eq('id', admin_id)
    .eq('is_active', true)
    .single()

  if (!adminCheck) {
    throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })
  }

  const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name },
  })

  if (inviteError) {
    if (inviteError.message.includes('already registered') || inviteError.message.includes('already been registered')) {
      throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
    }
    throw createError({ statusCode: 400, statusMessage: inviteError.message })
  }

  const userId = inviteData.user?.id
  if (!userId) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
  }

  const memberStatus = status === 'pending' ? 'pending' : 'active'

  const { error: profileError } = await adminSupabase
    .from('alumni_profiles')
    .insert({
      id: userId,
      email,
      full_name,
      batch_year: batch_year ? Number(batch_year) : null,
      student_id: student_id || null,
      phone: phone || null,
      department: department || null,
      degree: degree || null,
      current_status: current_status || 'other',
      city: city || null,
      country: country || null,
      status: memberStatus,
      approved_by: memberStatus === 'active' ? admin_id : null,
      approved_at: memberStatus === 'active' ? new Date().toISOString() : null,
    })

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(userId).catch(() => {})
    throw createError({ statusCode: 500, statusMessage: 'Failed to create profile' })
  }

  return { success: true, message: 'Member created. An invite email has been sent.' }
})
