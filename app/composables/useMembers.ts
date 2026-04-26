import type { AlumniProfile, AlumniEducation, AlumniWorkExperience, Batch } from '~/types/member'

export interface MemberFilters {
  search?: string
  batchYear?: number
  department?: string
  industry?: string
  status?: string
  page?: number
  perPage?: number
}

export function useMembers() {
  const supabase = useSupabaseClient()

  const members = ref<AlumniProfile[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDirectory(filters: MemberFilters = {}) {
    loading.value = true
    error.value = null

    const page = filters.page || 1
    const perPage = filters.perPage || 24
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('alumni_profiles')
      .select('id, full_name, display_name, avatar_url, batch_year, current_job_title, current_company, industry, city, country, is_verified', { count: 'exact' })
      .eq('status', 'active')

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%,current_company.ilike.%${filters.search}%`)
    }
    if (filters.batchYear) query = query.eq('batch_year', filters.batchYear)
    if (filters.department) query = query.eq('department', filters.department)
    if (filters.industry) query = query.eq('industry', filters.industry)

    query = query.order('full_name').range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      members.value = (data as AlumniProfile[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
    return members.value
  }

  async function fetchAllForAdmin(filters: MemberFilters = {}) {
    loading.value = true
    error.value = null

    const page = filters.page || 1
    const perPage = filters.perPage || 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('alumni_profiles')
      .select('*', { count: 'exact' })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }
    if (filters.batchYear) query = query.eq('batch_year', filters.batchYear)

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      members.value = (data as AlumniProfile[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
    return members.value
  }

  async function fetchProfile(id: string) {
    const { data, error: fetchError } = await supabase
      .from('alumni_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) return null
    return data as AlumniProfile
  }

  async function fetchProfileWithDetails(id: string) {
    const [profileResult, educationResult, workResult] = await Promise.all([
      supabase.from('alumni_profiles').select('*').eq('id', id).single(),
      supabase.from('alumni_education').select('*').eq('alumni_id', id).order('start_year', { ascending: false }),
      supabase.from('alumni_work_experience').select('*').eq('alumni_id', id).order('start_date', { ascending: false }),
    ])

    if (profileResult.error) return null

    return {
      profile: profileResult.data as AlumniProfile,
      education: (educationResult.data as AlumniEducation[]) || [],
      work: (workResult.data as AlumniWorkExperience[]) || [],
    }
  }

  async function approveMembers(ids: string[]) {
    const user = useSupabaseUser()
    const { error: updateError } = await supabase
      .from('alumni_profiles')
      .update({
        status: 'active',
        approved_by: user.value?.id,
        approved_at: new Date().toISOString(),
      })
      .in('id', ids)

    return { success: !updateError, error: updateError?.message }
  }

  async function rejectMember(id: string) {
    const { error: updateError } = await supabase
      .from('alumni_profiles')
      .update({ status: 'rejected' })
      .eq('id', id)

    return { success: !updateError, error: updateError?.message }
  }

  async function suspendMember(id: string) {
    const { error: updateError } = await supabase
      .from('alumni_profiles')
      .update({ status: 'suspended' })
      .eq('id', id)

    return { success: !updateError, error: updateError?.message }
  }

  async function updateMember(id: string, updates: Partial<AlumniProfile>) {
    const { data, error: updateError } = await supabase
      .from('alumni_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { success: !updateError, data, error: updateError?.message }
  }

  async function fetchBatches(): Promise<Batch[]> {
    const { data } = await supabase
      .from('batches')
      .select('*')
      .eq('is_active', true)
      .order('year', { ascending: false })

    return (data as Batch[]) || []
  }

  async function fetchPendingCount(): Promise<number> {
    const { count } = await supabase
      .from('alumni_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    return count || 0
  }

  return {
    members,
    totalCount,
    loading,
    error,
    fetchDirectory,
    fetchAllForAdmin,
    fetchProfile,
    fetchProfileWithDetails,
    approveMembers,
    rejectMember,
    suspendMember,
    updateMember,
    fetchBatches,
    fetchPendingCount,
  }
}
