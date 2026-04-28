import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const registrationSchema = z.object({
  email: z.string().email('Invalid email format').max(255).transform(v => v.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100).transform(v => v.trim()),
  batch_year: z.number().int().min(1900).max(new Date().getFullYear()).nullable().optional(),
  student_id: z.string().max(50).nullable().optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone format').nullable().optional(),
})

const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_SECONDS = import.meta.dev ? 5 : 60

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = registrationSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || 'Invalid registration data'
    throw createError({ statusCode: 400, statusMessage: firstError })
  }

  const { email, password, full_name, batch_year, student_id, phone } = parsed.data

  const lastRequest = rateLimitMap.get(email)
  if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_SECONDS * 1000) {
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Please try again later.' })
  }
  rateLimitMap.set(email, Date.now())

  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = config.supabaseServiceKey

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
  }

  const adminSupabase = createClient(supabaseUrl, serviceKey)

  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw createError({ statusCode: 409, statusMessage: 'Registration failed. Please try again or sign in.' })
    }
    throw createError({ statusCode: 400, statusMessage: 'Registration failed' })
  }

  const userId = authData.user?.id
  if (!userId) {
    throw createError({ statusCode: 500, statusMessage: 'Registration failed' })
  }

  const { error: profileError } = await adminSupabase
    .from('alumni_profiles')
    .insert({
      id: userId,
      email,
      full_name,
      batch_year: batch_year ?? null,
      student_id: student_id || null,
      phone: phone || null,
      status: 'pending',
    })

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(userId).catch((err) => {
      console.error('Failed to cleanup orphaned auth user:', userId, err)
    })
    if (profileError.code === '23505') {
      if (profileError.message.includes('student_id'))
        throw createError({ statusCode: 409, statusMessage: 'This Student ID is already registered for that batch' })
      throw createError({ statusCode: 409, statusMessage: 'Email is already registered' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Registration failed' })
  }

  return { success: true, message: 'Registration submitted. Awaiting admin approval.' }
})
