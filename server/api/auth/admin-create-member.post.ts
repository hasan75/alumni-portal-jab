import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, full_name, batch_year, student_id, phone, department, degree, current_status, city, country, status } = body

  if (!email || !full_name) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
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

  const { data: adminCheck } = await adminSupabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminCheck) {
    throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })
  }

  const { data: linkData, error: inviteError } = await adminSupabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { data: { full_name } },
  })

  if (inviteError) {
    if (inviteError.message.includes('already registered') || inviteError.message.includes('already been registered')) {
      throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
    }
    throw createError({ statusCode: 400, statusMessage: inviteError.message })
  }

  const userId = linkData.user?.id
  const inviteLink = linkData.properties?.action_link
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
      approved_by: memberStatus === 'active' ? user.id : null,
      approved_at: memberStatus === 'active' ? new Date().toISOString() : null,
    })

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(userId).catch(() => {})
    throw createError({ statusCode: 500, statusMessage: 'Failed to create profile' })
  }

  const appName = config.public.appName as string
  const siteUrl = config.public.siteUrl as string

  if (inviteLink) {
    await sendEmail({
      to: email,
      subject: `You've been invited to ${appName}`,
      html: adminInviteEmail({ fullName: full_name, appName, siteUrl, inviteLink }),
    })
  }

  return { success: true, message: 'Member created. An invite email has been sent.' }
})
