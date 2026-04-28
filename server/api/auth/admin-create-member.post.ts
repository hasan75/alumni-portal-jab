import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  full_name: z.string().min(2).max(100).trim(),
  batch_year: z.number().int().min(1900).max(new Date().getFullYear()).nullish(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/).nullish(),
  student_id: z.string().max(50).nullish(),
  department: z.string().max(100).nullish(),
  degree: z.string().max(100).nullish(),
  current_status: z.string().max(50).nullish(),
  city: z.string().max(100).nullish(),
  country: z.string().max(100).nullish(),
  status: z.enum(['pending', 'active']).default('pending'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const { email, full_name, batch_year, student_id, phone, department, degree, current_status, city, country, status } = parsed.data

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

  const memberStatus = status

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

  await writeAuditLog(adminSupabase, event, {
    userId: user.id,
    userEmail: user.email,
    action: 'create',
    tableName: 'alumni_profiles',
    recordId: userId,
    newValues: { email, full_name, status: memberStatus },
    description: `Created member ${email} via admin invite`,
  })

  return { success: true, message: 'Member created. An invite email has been sent.' }
})
