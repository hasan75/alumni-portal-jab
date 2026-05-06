import { serverSupabaseClient } from '#supabase/server'
import type { Job } from '~/types/job'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug required' })

  const supabase = await serverSupabaseClient(event)

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, category:job_categories(*)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!job) throw createError({ statusCode: 404, statusMessage: 'Job not found' })

  // Increment view count (fire-and-forget; silently fails if RLS blocks UPDATE)
  supabase
    .from('jobs')
    .update({ view_count: (job as Job).view_count + 1 })
    .eq('id', (job as Job).id)
    .then(() => {})
    .catch(() => {})

  return job as Job
})
