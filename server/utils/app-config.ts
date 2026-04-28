import type { SupabaseClient } from '@supabase/supabase-js'

export async function getAppConfig(client: SupabaseClient): Promise<Record<string, string>> {
  const { data } = await client.from('app_config').select('key, value')
  if (!data) return {}
  return Object.fromEntries(data.map((row: { key: string, value: string | null }) => [row.key, row.value || '']))
}
