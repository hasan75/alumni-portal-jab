import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ids } = body

  if (!ids?.length) {
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

  const { error: updateError } = await adminSupabase
    .from('alumni_profiles')
    .update({
      status: 'active',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .in('id', ids)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: updateError.message })
  }

  const { data: members } = await adminSupabase
    .from('alumni_profiles')
    .select('email, full_name')
    .in('id', ids)

  const appName = config.public.appName as string
  const siteUrl = config.public.siteUrl as string

  const emailErrors: string[] = []
  if (members) {
    await Promise.all(members.map(async (member) => {
      const result = await sendEmail({
        to: member.email,
        subject: `Welcome to ${appName} — Your Account is Approved!`,
        html: approvalEmail({ fullName: member.full_name, appName, siteUrl }),
      })
      if (!result.success) emailErrors.push(`${member.email}: ${result.error}`)
    }))
  }

  return { success: true, approvedCount: ids.length, emailErrors: emailErrors.length ? emailErrors : undefined }
})
