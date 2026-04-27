import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({
  post_id: z.number().int().positive(),
  content: z.string().min(1, 'Comment cannot be empty').max(1000).transform(v => v.trim()),
  parent_comment_id: z.number().int().positive().nullable().optional(),
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

  const { post_id, content, parent_comment_id } = parsed.data

  const moderation = await moderateContent(content)
  if (!moderation.allowed) {
    throw createError({ statusCode: 422, statusMessage: moderation.reason })
  }

  const config = useRuntimeConfig()
  const adminSupabase = createClient(process.env.SUPABASE_URL!, config.supabaseServiceKey)

  const { data, error } = await adminSupabase
    .from('feed_comments')
    .insert({
      post_id,
      author_id: user.sub,
      content,
      parent_comment_id: parent_comment_id || null,
    })
    .select(`
      *,
      author:alumni_profiles!author_id(full_name, display_name, avatar_url)
    `)
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to post comment' })
  }

  return { success: true, data }
})
