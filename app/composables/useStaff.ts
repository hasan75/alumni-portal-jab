import type { StaffMember } from '~/types/staff'

export interface StaffFilters {
  designation?: string
  status?: string
  search?: string
  featured?: boolean
  page?: number
  perPage?: number
}

export function useStaff() {
  const supabase = useSupabaseClient()

  const staffMembers = ref<StaffMember[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStaff(filters: StaffFilters = {}) {
    loading.value = true
    error.value = null

    let query = supabase
      .from('staff_members')
      .select('*', { count: 'exact' })

    if (filters.status) {
      query = query.eq('employment_status', filters.status)
    }
    else {
      query = query.eq('employment_status', 'current')
    }

    if (filters.designation) query = query.eq('designation', filters.designation)
    if (filters.featured) query = query.eq('is_featured', true)
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      query = query.ilike('name', `%${term}%`)
    }

    if (filters.page && filters.perPage) {
      const from = (filters.page - 1) * filters.perPage
      const to = from + filters.perPage - 1
      query = query.range(from, to)
    }

    query = query.order('sort_order').order('name')

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      staffMembers.value = (data as StaffMember[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
    return staffMembers.value
  }

  async function fetchAllStaff() {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('staff_members')
      .select('*')
      .order('sort_order')
      .order('name')

    loading.value = false

    if (fetchError) {
      error.value = fetchError.message
      return []
    }

    staffMembers.value = (data as StaffMember[]) || []
    return staffMembers.value
  }

  async function fetchAllForAdmin(filters: StaffFilters = {}) {
    loading.value = true

    const page = filters.page || 1
    const perPage = filters.perPage || 25
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('staff_members')
      .select('*', { count: 'exact' })

    if (filters.status) query = query.eq('employment_status', filters.status)
    if (filters.designation) query = query.eq('designation', filters.designation)
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      query = query.ilike('name', `%${term}%`)
    }

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    loading.value = false
    if (fetchError) {
      error.value = fetchError.message
      return []
    }
    staffMembers.value = (data as StaffMember[]) || []
    totalCount.value = count || 0
    return staffMembers.value
  }

  async function saveStaffMember(member: Partial<StaffMember>) {
    if (member.id) {
      const { data, error: updateError } = await (supabase
        .from('staff_members') as any)
        .update(member)
        .eq('id', member.id)
        .select()
        .single()
      return { success: !updateError, data, error: updateError?.message }
    }
    else {
      const { data, error: insertError } = await (supabase
        .from('staff_members') as any)
        .insert(member)
        .select()
        .single()
      return { success: !insertError, data, error: insertError?.message }
    }
  }

  async function deleteStaffMember(id: number) {
    const { error: deleteError } = await supabase.from('staff_members').delete().eq('id', id)
    return { success: !deleteError, error: deleteError?.message }
  }

  return {
    staffMembers,
    totalCount,
    loading,
    error,
    fetchStaff,
    fetchAllStaff,
    fetchAllForAdmin,
    saveStaffMember,
    deleteStaffMember,
  }
}
