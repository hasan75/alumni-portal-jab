import type { AuditLogEntry, AuditLogFilters } from '~/types/audit'

export function useAuditLog() {
  const supabase = useSupabaseClient()
  const logs = ref<AuditLogEntry[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLogs(filters: AuditLogFilters = {}) {
    loading.value = true
    error.value = null

    const page = filters.page || 1
    const perPage = filters.perPage || 25
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })

    if (filters.action) query = query.eq('action', filters.action)
    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.tableName) query = query.eq('table_name', filters.tableName)
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      query = query.or(`description.ilike.%${term}%,user_email.ilike.%${term}%`)
    }

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      logs.value = (data as AuditLogEntry[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
  }

  async function fetchAdminUsers() {
    const { data } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('is_active', true)
      .order('email')

    return data || []
  }

  return {
    logs,
    totalCount,
    loading,
    error,
    fetchLogs,
    fetchAdminUsers,
  }
}
