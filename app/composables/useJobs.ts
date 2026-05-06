import type { Job, JobCategory } from '~/types/job'

export interface JobFilters {
  categoryId?: number
  jobType?: string
  isRemote?: boolean
  search?: string
  featured?: boolean
  page?: number
  perPage?: number
  status?: string
}

export function useJobs() {
  const supabase = useSupabaseClient()

  const jobs = ref<Job[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchJobs(filters: JobFilters = {}) {
    loading.value = true
    error.value = null

    const page = filters.page || 1
    const perPage = filters.perPage || 12
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('jobs')
      .select('*, category:job_categories(*)', { count: 'exact' })
      .eq('status', 'published')

    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
    if (filters.jobType) query = query.eq('job_type', filters.jobType)
    if (filters.isRemote !== undefined) query = query.eq('is_remote', filters.isRemote)
    if (filters.featured) query = query.eq('is_featured', true)
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      query = query.or(`title.ilike.%${term}%,company.ilike.%${term}%`)
    }

    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      jobs.value = (data as Job[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
    return jobs.value
  }

  async function fetchAllForAdmin(filters: JobFilters = {}) {
    loading.value = true

    const page = filters.page || 1
    const perPage = filters.perPage || 25
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('jobs')
      .select('*, category:job_categories(*)', { count: 'exact' })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      query = query.or(`title.ilike.%${term}%,company.ilike.%${term}%`)
    }

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    loading.value = false
    if (fetchError) {
      error.value = fetchError.message
      return []
    }
    jobs.value = (data as Job[]) || []
    totalCount.value = count || 0
    return jobs.value
  }

  async function fetchBySlug(slug: string): Promise<Job | null> {
    const { data, error: fetchError } = await supabase
      .from('jobs')
      .select('*, category:job_categories(*)')
      .eq('slug', slug)
      .single()

    if (fetchError) return null

    // Increment view count
    await supabase
      .from('jobs')
      .update({ view_count: (data as Job).view_count + 1 })
      .eq('id', (data as Job).id)
      .catch(() => {})

    return data as Job
  }

  async function fetchCategories(): Promise<JobCategory[]> {
    const { data } = await supabase
      .from('job_categories')
      .select('*')
      .order('display_order')

    return (data as JobCategory[]) || []
  }

  async function saveJob(job: Partial<Job>) {
    if (job.id) {
      const { data, error: updateError } = await supabase
        .from('jobs')
        .update(job)
        .eq('id', job.id)
        .select()
        .single()
      return { success: !updateError, data, error: updateError?.message }
    }
    else {
      const { data, error: insertError } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single()
      return { success: !insertError, data, error: insertError?.message }
    }
  }

  async function deleteJob(id: number) {
    const { error: deleteError } = await supabase.from('jobs').delete().eq('id', id)
    return { success: !deleteError, error: deleteError?.message }
  }

  async function submitJob(job: Omit<Partial<Job>, 'status' | 'alumni_posted' | 'posted_by'>) {
    const user = useSupabaseUser()
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const { data, error: insertError } = await supabase
      .from('jobs')
      .insert({
        ...job,
        status: 'pending_review',
        alumni_posted: true,
        posted_by: user.value.id,
      })
      .select()
      .single()

    return { success: !insertError, data, error: insertError?.message }
  }

  async function fetchMySubmissions(): Promise<Job[]> {
    const user = useSupabaseUser()
    if (!user.value) return []

    const { data, error: fetchError } = await supabase
      .from('jobs')
      .select('*, category:job_categories(*)')
      .eq('posted_by', user.value.id)
      .order('created_at', { ascending: false })

    if (fetchError) return []
    return (data as Job[]) || []
  }

  async function withdrawSubmission(id: number) {
    const user = useSupabaseUser()
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('posted_by', user.value.id)
      .eq('status', 'pending_review')

    return { success: !deleteError, error: deleteError?.message }
  }

  async function fetchPendingReviewCount(): Promise<number> {
    const { count } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending_review')

    return count || 0
  }

  return {
    jobs,
    totalCount,
    loading,
    error,
    fetchJobs,
    fetchAllForAdmin,
    fetchBySlug,
    fetchCategories,
    saveJob,
    deleteJob,
    submitJob,
    fetchMySubmissions,
    withdrawSubmission,
    fetchPendingReviewCount,
  }
}
