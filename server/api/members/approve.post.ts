import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({ ids: z.array(z.string().uuid()).min(1).max(50) })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const { ids } = parsed.data

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
    .eq('role', 'admin')
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
    throw createError({ statusCode: 500, statusMessage: 'Operation failed' })
  }

  await Promise.all(ids.map(id =>
    writeAuditLog(adminSupabase, event, {
      userId: user.id,
      userEmail: user.email,
      action: 'update',
      tableName: 'alumni_profiles',
      recordId: id,
      newValues: { status: 'active' },
      changedFields: ['status', 'approved_by', 'approved_at'],
      description: `Approved member ${id}`,
    }),
  ))

  return { success: true, approvedCount: ids.length }
})
