import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({
  content: z.string().min(1, 'Content is required').max(2000).transform(v => v.trim()),
  image_urls: z.array(z.string()).max(4).optional().default([]),
  post_scope: z.enum(['general', 'batch']).default('general'),
  batch_year: z.number().int().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user?.sub) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0]?.message || 'Invalid input' })
  }

  const { content, image_urls, post_scope, batch_year } = parsed.data

  const moderation = await moderateContent(content)
  if (!moderation.allowed) {
    throw createError({ statusCode: 422, statusMessage: moderation.reason })
  }

  const config = useRuntimeConfig()
  const adminSupabase = createClient(process.env.SUPABASE_URL!, config.supabaseServiceKey)

  const { data, error } = await adminSupabase
    .from('feed_posts')
    .insert({
      author_id: user.sub,
      content,
      image_urls: image_urls.length > 0 ? image_urls : null,
      post_scope,
      batch_year: batch_year || null,
    })
    .select(`
      *,
      author:alumni_profiles!author_id(full_name, display_name, avatar_url, batch_year, featured_work_summary)
    `)
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create post' })
  }

  return { success: true, data }
})
