import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, adminId } = body

  if (!id || !adminId) {
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
    .eq('id', adminId)
    .eq('is_active', true)
    .single()

  if (!adminCheck) {
    throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })
  }

  const { data: member } = await adminSupabase
    .from('alumni_profiles')
    .select('email, full_name')
    .eq('id', id)
    .single()

  const { error: updateError } = await adminSupabase
    .from('alumni_profiles')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: updateError.message })
  }

  if (member) {
    const appName = config.public.appName as string
    const siteUrl = config.public.siteUrl as string
    await sendEmail({
      to: member.email,
      subject: `${appName} — Application Update`,
      html: rejectionOrSuspensionEmail({ fullName: member.full_name, appName, siteUrl, status: 'rejected' }),
    })
  }

  return { success: true }
})
