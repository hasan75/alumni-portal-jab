export function useSiteConfig() {
  const supabase = useSupabaseClient()

  const config = useState<Record<string, string>>('site-config', () => ({}))
  const loading = ref(false)

  const appName = computed(() => config.value.app_name || 'JAB Alumni')
  const institutionName = computed(() => config.value.institution_name || 'Janata Adarsha Bidyapith')
  const primaryColor = computed(() => config.value.primary_color || '#2563EB')
  const logoUrl = computed(() => config.value.logo_url || '')
  const tagline = computed(() => config.value.tagline || 'Connecting the alumni of Janata Adarsha Bidyapith since 1969')
  const contactEmail = computed(() => config.value.contact_email || '')
  const contactPhone = computed(() => config.value.contact_phone || '')

  async function fetchConfig() {
    loading.value = true
    const { data, error } = await supabase.from('app_config').select('key, value')
    if (!error && data) {
      config.value = Object.fromEntries(data.map(row => [row.key, row.value || '']))
    }
    loading.value = false
  }

  async function updateConfig(key: string, value: string) {
    const { error } = await supabase
      .from('app_config')
      .upsert({ key, value })

    if (!error) {
      config.value[key] = value
    }
    return { success: !error, error: error?.message }
  }

  async function updateMultiple(updates: Record<string, string>) {
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('app_config').upsert(rows)
    if (!error) {
      Object.assign(config.value, updates)
    }
    return { success: !error, error: error?.message }
  }

  return {
    config,
    loading,
    appName,
    institutionName,
    primaryColor,
    logoUrl,
    tagline,
    contactEmail,
    contactPhone,
    fetchConfig,
    updateConfig,
    updateMultiple,
  }
}
