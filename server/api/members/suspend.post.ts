import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
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

  const { data: member } = await adminSupabase
    .from('alumni_profiles')
    .select('email, full_name')
    .eq('id', id)
    .single()

  const { error: updateError } = await adminSupabase
    .from('alumni_profiles')
    .update({ status: 'suspended' })
    .eq('id', id)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: updateError.message })
  }

  if (member) {
    const appName = config.public.appName as string
    const siteUrl = config.public.siteUrl as string
    await sendEmail({
      to: member.email,
      subject: `${appName} — Account Suspended`,
      html: rejectionOrSuspensionEmail({ fullName: member.full_name, appName, siteUrl, status: 'suspended' }),
    })
  }

  return { success: true }
})
