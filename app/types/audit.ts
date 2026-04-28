export interface AuditLogEntry {
  id: number
  user_id: string | null
  user_email: string | null
  action: 'create' | 'update' | 'delete'
  table_name: string
  record_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  changed_fields: string[] | null
  description: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AuditLogFilters {
  search?: string
  action?: string
  userId?: string
  tableName?: string
  page?: number
  perPage?: number
}
