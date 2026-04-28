import type { Event, EventRsvp, RsvpStatus } from '~/types/event'
import { useAuthStore } from '~/stores/auth'

export interface EventFilters {
  status?: string
  eventType?: string
  batchYear?: number
  upcoming?: boolean
  search?: string
  page?: number
  perPage?: number
}

export function useEvents() {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()

  async function resolveUserId(): Promise<string | null> {
    if (authStore.profile?.id) return authStore.profile.id
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  }

  const events = ref<Event[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchEvents(filters: EventFilters = {}) {
    loading.value = true
    error.value = null

    const page = filters.page || 1
    const perPage = filters.perPage || 12
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('status', 'published')

    if (filters.eventType) query = query.eq('event_type', filters.eventType)
    if (filters.batchYear) query = query.eq('batch_year', filters.batchYear)
    if (filters.upcoming) query = query.gte('start_datetime', new Date().toISOString())
    if (filters.search) query = query.ilike('title', `%${sanitizeSearchTerm(filters.search)}%`)

    query = query.order('start_datetime', { ascending: filters.upcoming !== false }).range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      events.value = (data as Event[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
    return events.value
  }

  async function fetchAllForAdmin(filters: EventFilters = {}) {
    loading.value = true
    const page = filters.page || 1
    const perPage = filters.perPage || 25
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('title', `%${sanitizeSearchTerm(filters.search)}%`)

    query = query.order('start_datetime', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    loading.value = false
    if (fetchError) {
      error.value = fetchError.message
      return []
    }
    events.value = (data as Event[]) || []
    totalCount.value = count || 0
    return events.value
  }

  async function fetchBySlug(slug: string): Promise<Event | null> {
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError) return null
    return data as Event
  }

  async function rsvpToEvent(eventId: number, status: RsvpStatus) {
    const userId = await resolveUserId()
    if (!userId) return { success: false, error: 'Not authenticated' }

    const { error: upsertError } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        alumni_id: userId,
        status,
      }, { onConflict: 'event_id,alumni_id' })

    return { success: !upsertError, error: upsertError?.message }
  }

  async function removeRsvp(eventId: number) {
    const userId = await resolveUserId()
    if (!userId) return { success: false, error: 'Not authenticated' }

    const { error: deleteError } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('alumni_id', userId)

    return { success: !deleteError, error: deleteError?.message }
  }

  async function fetchMyRsvps(): Promise<EventRsvp[]> {
    const userId = await resolveUserId()
    if (!userId) return []

    const { data } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('alumni_id', userId)

    return (data as EventRsvp[]) || []
  }

  async function fetchMyRsvpForEvent(eventId: number): Promise<EventRsvp | null> {
    const userId = await resolveUserId()
    if (!userId) return null

    const { data } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('alumni_id', userId)
      .single()

    return data as EventRsvp | null
  }

  async function saveEvent(event: Partial<Event>) {
    if (event.id) {
      const { data, error: updateError } = await supabase
        .from('events')
        .update(event)
        .eq('id', event.id)
        .select()
        .single()
      return { success: !updateError, data, error: updateError?.message }
    }
    else {
      const { data, error: insertError } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()
      return { success: !insertError, data, error: insertError?.message }
    }
  }

  async function deleteEvent(id: number) {
    const { error: deleteError } = await supabase.from('events').delete().eq('id', id)
    return { success: !deleteError, error: deleteError?.message }
  }

  return {
    events,
    totalCount,
    loading,
    error,
    fetchEvents,
    fetchAllForAdmin,
    fetchBySlug,
    rsvpToEvent,
    removeRsvp,
    fetchMyRsvps,
    fetchMyRsvpForEvent,
    saveEvent,
    deleteEvent,
  }
}
