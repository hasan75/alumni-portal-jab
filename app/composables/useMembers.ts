import type { AlumniProfile, AlumniEducation, AlumniWorkExperience, Batch, SocialPlatform, SocialLink } from '~/types/member'

export interface MemberFilters {
  search?: string
  batchYear?: number
  department?: string
  status?: string
  industry?: string
  currentStatus?: string
  institution?: string
  fieldOfStudy?: string
  city?: string
  page?: number
  perPage?: number
}

export const INDUSTRY_OPTIONS = [
  'Technology / Software',
  'Healthcare / Medicine',
  'Engineering',
  'Architecture',
  'Finance / Banking',
  'Education / Academia',
  'Business / Entrepreneurship',
  'Government / Public Service',
  'Law / Legal',
  'Media / Journalism',
  'Creative Arts / Design',
  'Agriculture',
  'Other',
]

export const FIELD_OF_STUDY_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'Electrical & Electronic Engineering (EEE)',
  'Civil Engineering',
  'Mechanical Engineering',
  'Architecture',
  'Medicine (MBBS)',
  'Pharmacy',
  'Business Administration (BBA/MBA)',
  'Economics',
  'Law',
  'English Language & Literature',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Accounting',
  'Finance',
  'Other',
]

export const CURRENT_STATUS_OPTIONS = [
  { label: 'Studying', value: 'studying' },
  { label: 'Working', value: 'working' },
  { label: 'Business / Self-Employed', value: 'business' },
  { label: 'Studying & Working', value: 'studying_and_working' },
  { label: 'Other', value: 'other' },
]

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
      .from('alumni_directory_view')
      .select('id, full_name, display_name, avatar_url, batch_year, current_status, featured_education_summary, featured_work_summary, current_job_title, current_industry, current_institution, current_field_of_study, all_institutions, all_companies, linkedin_url, facebook_url, portfolio_url, city, country, is_verified', { count: 'exact' })

    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      // Search across name, current job, AND full history of institutions + companies
      query = query.or(`full_name.ilike.%${term}%,display_name.ilike.%${term}%,featured_work_summary.ilike.%${term}%,current_job_title.ilike.%${term}%,all_institutions.ilike.%${term}%,all_companies.ilike.%${term}%`)
    }
    if (filters.batchYear) query = query.eq('batch_year', filters.batchYear)
    if (filters.department) query = query.eq('department', filters.department)
    if (filters.industry) query = query.eq('current_industry', filters.industry)
    if (filters.currentStatus) query = query.eq('current_status', filters.currentStatus)
    if (filters.institution) {
      // Match against full history, not just current institution
      const term = sanitizeSearchTerm(filters.institution)
      query = query.ilike('all_institutions', `%${term}%`)
    }
    if (filters.fieldOfStudy) {
      const term = sanitizeSearchTerm(filters.fieldOfStudy)
      query = query.ilike('current_field_of_study', `%${term}%`)
    }
    if (filters.city) {
      const term = sanitizeSearchTerm(filters.city)
      query = query.ilike('city', `%${term}%`)
    }

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
    const perPage = filters.perPage || 25
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('alumni_profiles')
      .select('*', { count: 'exact' })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) {
      const term = sanitizeSearchTerm(filters.search)
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`)
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
      supabase.from('alumni_directory_view').select('*').eq('id', id).single(),
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
    try {
      await $fetch('/api/members/approve', {
        method: 'POST',
        body: { ids },
      })
      return { success: true, error: undefined }
    }
    catch (err: any) {
      return { success: false, error: err.data?.statusMessage || err.message }
    }
  }

  async function rejectMember(id: string) {
    try {
      await $fetch('/api/members/reject', {
        method: 'POST',
        body: { id },
      })
      return { success: true, error: undefined }
    }
    catch (err: any) {
      return { success: false, error: err.data?.statusMessage || err.message }
    }
  }

  async function suspendMember(id: string) {
    try {
      await $fetch('/api/members/suspend', {
        method: 'POST',
        body: { id },
      })
      return { success: true, error: undefined }
    }
    catch (err: any) {
      return { success: false, error: err.data?.statusMessage || err.message }
    }
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

  // ── Education CRUD ──────────────────────────────────────

  async function fetchEducation(alumniId: string) {
    const { data, error: fetchError } = await supabase
      .from('alumni_education')
      .select('*')
      .eq('alumni_id', alumniId)
      .order('start_year', { ascending: false })

    if (fetchError) return []
    return (data as AlumniEducation[]) || []
  }

  async function addEducation(alumniId: string, record: Partial<AlumniEducation>) {
    const { data, error: insertError } = await supabase
      .from('alumni_education')
      .insert({ ...record, alumni_id: alumniId })
      .select()
      .single()

    if (!insertError) await recalcFeaturedEducation(alumniId)
    return { success: !insertError, data: data as AlumniEducation | null, error: insertError?.message }
  }

  async function updateEducation(id: number, record: Partial<AlumniEducation>) {
    const { data, error: updateError } = await supabase
      .from('alumni_education')
      .update(record)
      .eq('id', id)
      .select()
      .single()

    if (!updateError && data) await recalcFeaturedEducation((data as AlumniEducation).alumni_id)
    return { success: !updateError, data: data as AlumniEducation | null, error: updateError?.message }
  }

  async function deleteEducation(id: number, alumniId: string) {
    const { error: deleteError } = await supabase
      .from('alumni_education')
      .delete()
      .eq('id', id)

    if (!deleteError) await recalcFeaturedEducation(alumniId)
    return { success: !deleteError, error: deleteError?.message }
  }

  // ── Work Experience CRUD ────────────────────────────────

  async function fetchWorkExperience(alumniId: string) {
    const { data, error: fetchError } = await supabase
      .from('alumni_work_experience')
      .select('*')
      .eq('alumni_id', alumniId)
      .order('start_date', { ascending: false })

    if (fetchError) return []
    return (data as AlumniWorkExperience[]) || []
  }

  async function addWorkExperience(alumniId: string, record: Partial<AlumniWorkExperience>) {
    const { data, error: insertError } = await supabase
      .from('alumni_work_experience')
      .insert({ ...record, alumni_id: alumniId })
      .select()
      .single()

    if (!insertError) await recalcFeaturedWork(alumniId)
    return { success: !insertError, data: data as AlumniWorkExperience | null, error: insertError?.message }
  }

  async function updateWorkExperience(id: number, record: Partial<AlumniWorkExperience>) {
    const { data, error: updateError } = await supabase
      .from('alumni_work_experience')
      .update(record)
      .eq('id', id)
      .select()
      .single()

    if (!updateError && data) await recalcFeaturedWork((data as AlumniWorkExperience).alumni_id)
    return { success: !updateError, data: data as AlumniWorkExperience | null, error: updateError?.message }
  }

  async function deleteWorkExperience(id: number, alumniId: string) {
    const { error: deleteError } = await supabase
      .from('alumni_work_experience')
      .delete()
      .eq('id', id)

    if (!deleteError) await recalcFeaturedWork(alumniId)
    return { success: !deleteError, error: deleteError?.message }
  }

  // ── Social Links ────────────────────────────────────────

  async function fetchSocialPlatforms() {
    const { data } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    return (data as SocialPlatform[]) || []
  }

  async function fetchSocialLinks(alumniId: string) {
    const { data } = await supabase
      .from('social_links')
      .select('*')
      .eq('entity_type', 'alumni')
      .eq('entity_id', alumniId)
      .order('sort_order')

    return (data as SocialLink[]) || []
  }

  async function saveSocialLink(alumniId: string, platformSlug: string, url: string) {
    if (!url || url.length > 2048 || !safeUrl(url)) {
      return { error: 'Invalid URL' }
    }

    const { data, error: upsertError } = await supabase
      .from('social_links')
      .upsert(
        { entity_type: 'alumni', entity_id: alumniId, platform_slug: platformSlug, url },
        { onConflict: 'entity_type,entity_id,platform_slug,url' },
      )
      .select()
      .single()

    return { success: !upsertError, data: data as SocialLink | null, error: upsertError?.message }
  }

  async function deleteSocialLink(id: number) {
    const { error: deleteError } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id)

    return { success: !deleteError, error: deleteError?.message }
  }

  // ── Featured & Sync ─────────────────────────────────────

  function buildEduSummary(edu: { institution: string, degree?: string | null, field_of_study?: string | null }): string {
    const parts = [edu.degree, edu.field_of_study].filter(Boolean)
    return parts.length ? `${parts.join(' ')} · ${edu.institution}` : edu.institution
  }

  function buildWorkSummary(work: { job_title: string, company: string }): string {
    return `${work.job_title} at ${work.company}`
  }

  async function recalcFeaturedEducation(alumniId: string) {
    const records = await fetchEducation(alumniId)
    if (records.length === 0) {
      await supabase.from('alumni_profiles').update({
        featured_education_summary: null,
        current_institution: null,
        current_field_of_study: null,
        all_institutions: null,
      }).eq('id', alumniId)
      return
    }

    let featured = records.find(r => r.is_featured)
    if (!featured) {
      featured = records.find(r => r.is_current) || records[0]
      await supabase.from('alumni_education').update({ is_featured: false }).eq('alumni_id', alumniId)
      await supabase.from('alumni_education').update({ is_featured: true }).eq('id', featured.id)
    }

    const summary = buildEduSummary(featured)
    const allInstitutions = records.map(r => r.institution).join(' | ')
    await supabase.from('alumni_profiles').update({
      featured_education_summary: summary,
      current_institution: featured.institution,
      current_field_of_study: featured.field_of_study || null,
      all_institutions: allInstitutions,
    }).eq('id', alumniId)
  }

  async function recalcFeaturedWork(alumniId: string) {
    const records = await fetchWorkExperience(alumniId)
    if (records.length === 0) {
      await supabase.from('alumni_profiles').update({
        featured_work_summary: null,
        current_job_title: null,
        current_industry: null,
        all_companies: null,
      }).eq('id', alumniId)
      return
    }

    let featured = records.find(r => r.is_featured)
    if (!featured) {
      featured = records.find(r => r.is_current) || records[0]
      await supabase.from('alumni_work_experience').update({ is_featured: false }).eq('alumni_id', alumniId)
      await supabase.from('alumni_work_experience').update({ is_featured: true }).eq('id', featured.id)
    }

    const summary = buildWorkSummary(featured)
    const allCompanies = records.map(r => r.company).join(' | ')
    await supabase.from('alumni_profiles').update({
      featured_work_summary: summary,
      current_job_title: featured.job_title,
      current_industry: featured.industry || null,
      all_companies: allCompanies,
    }).eq('id', alumniId)
  }

  async function setFeaturedEducation(alumniId: string, eduId: number) {
    await supabase.from('alumni_education').update({ is_featured: false }).eq('alumni_id', alumniId)
    await supabase.from('alumni_education').update({ is_featured: true }).eq('id', eduId)
    await recalcFeaturedEducation(alumniId)
    return { success: true }
  }

  async function unsetFeaturedEducation(alumniId: string) {
    await supabase.from('alumni_education').update({ is_featured: false }).eq('alumni_id', alumniId)
    await recalcFeaturedEducation(alumniId)
    return { success: true }
  }

  async function setFeaturedWork(alumniId: string, workId: number) {
    await supabase.from('alumni_work_experience').update({ is_featured: false }).eq('alumni_id', alumniId)
    await supabase.from('alumni_work_experience').update({ is_featured: true }).eq('id', workId)
    await recalcFeaturedWork(alumniId)
    return { success: true }
  }

  async function unsetFeaturedWork(alumniId: string) {
    await supabase.from('alumni_work_experience').update({ is_featured: false }).eq('alumni_id', alumniId)
    await recalcFeaturedWork(alumniId)
    return { success: true }
  }

  async function fetchDistinctIndustries(): Promise<string[]> {
    const { data } = await supabase
      .from('alumni_directory_view')
      .select('current_industry')
      .not('current_industry', 'is', null)
      .order('current_industry')

    const seen = new Set<string>()
    for (const row of (data || [])) {
      if (row.current_industry) seen.add(row.current_industry)
    }
    return [...seen]
  }

  async function syncSocialUrls(alumniId: string) {
    const links = await fetchSocialLinks(alumniId)
    const linkedin = links.find(l => l.platform_slug === 'linkedin')?.url || null
    const facebook = links.find(l => l.platform_slug === 'facebook')?.url || null
    const portfolio = links.find(l => l.platform_slug === 'github')?.url || null

    await supabase.from('alumni_profiles').update({
      linkedin_url: linkedin,
      facebook_url: facebook,
      portfolio_url: portfolio,
    }).eq('id', alumniId)

    return { success: true }
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
    fetchEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    fetchWorkExperience,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    fetchSocialPlatforms,
    fetchSocialLinks,
    saveSocialLink,
    deleteSocialLink,
    setFeaturedEducation,
    unsetFeaturedEducation,
    setFeaturedWork,
    unsetFeaturedWork,
    syncSocialUrls,
    recalcFeaturedEducation,
    recalcFeaturedWork,
    fetchDistinctIndustries,
  }
}
