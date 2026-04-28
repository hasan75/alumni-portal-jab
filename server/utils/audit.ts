import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

interface AuditLogEntry {
  userId: string
  userEmail?: string
  action: 'create' | 'update' | 'delete'
  tableName: string
  recordId?: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  changedFields?: string[]
  description?: string
}

export async function writeAuditLog(
  supabase: SupabaseClient,
  event: H3Event,
  entry: AuditLogEntry,
) {
  try {
    const ipAddress = getRequestIP(event, { xForwardedFor: true }) || null
    const userAgent = getHeader(event, 'user-agent') || null

    await supabase.from('audit_log').insert({
      user_id: entry.userId,
      user_email: entry.userEmail || null,
      action: entry.action,
      table_name: entry.tableName,
      record_id: entry.recordId || null,
      old_values: entry.oldValues || null,
      new_values: entry.newValues || null,
      changed_fields: entry.changedFields || null,
      description: entry.description || null,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
  }
  catch (err) {
    console.error('Audit log write failed:', err)
  }
}
