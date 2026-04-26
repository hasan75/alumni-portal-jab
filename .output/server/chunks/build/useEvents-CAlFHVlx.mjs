import { u as useSupabaseClient } from './useSupabaseClient-CkLFOMIR.mjs';
import { ref } from 'vue';
import { u as useSupabaseUser } from './server.mjs';

function useEvents() {
  const supabase = useSupabaseClient();
  const events = ref([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref(null);
  async function fetchEvents(filters = {}) {
    loading.value = true;
    error.value = null;
    const page = filters.page || 1;
    const perPage = filters.perPage || 12;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    let query = supabase.from("events").select("*", { count: "exact" }).eq("status", "published");
    if (filters.eventType) query = query.eq("event_type", filters.eventType);
    if (filters.batchYear) query = query.eq("batch_year", filters.batchYear);
    if (filters.upcoming) query = query.gte("start_datetime", (/* @__PURE__ */ new Date()).toISOString());
    if (filters.search) query = query.ilike("title", `%${filters.search}%`);
    query = query.order("start_datetime", { ascending: filters.upcoming !== false }).range(from, to);
    const { data, error: fetchError, count } = await query;
    if (fetchError) {
      error.value = fetchError.message;
    } else {
      events.value = data || [];
      totalCount.value = count || 0;
    }
    loading.value = false;
    return events.value;
  }
  async function fetchAllForAdmin(filters = {}) {
    loading.value = true;
    const page = filters.page || 1;
    const perPage = filters.perPage || 20;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    let query = supabase.from("events").select("*", { count: "exact" });
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.search) query = query.ilike("title", `%${filters.search}%`);
    query = query.order("start_datetime", { ascending: false }).range(from, to);
    const { data, error: fetchError, count } = await query;
    loading.value = false;
    if (fetchError) {
      error.value = fetchError.message;
      return [];
    }
    events.value = data || [];
    totalCount.value = count || 0;
    return events.value;
  }
  async function fetchBySlug(slug) {
    const { data, error: fetchError } = await supabase.from("events").select("*").eq("slug", slug).single();
    if (fetchError) return null;
    return data;
  }
  async function rsvpToEvent(eventId, status) {
    const user = useSupabaseUser();
    if (!user.value) return { success: false, error: "Not authenticated" };
    const { error: upsertError } = await supabase.from("event_rsvps").upsert({
      event_id: eventId,
      alumni_id: user.value.id,
      status
    }, { onConflict: "event_id,alumni_id" });
    return { success: !upsertError, error: upsertError?.message };
  }
  async function removeRsvp(eventId) {
    const user = useSupabaseUser();
    if (!user.value) return { success: false, error: "Not authenticated" };
    const { error: deleteError } = await supabase.from("event_rsvps").delete().eq("event_id", eventId).eq("alumni_id", user.value.id);
    return { success: !deleteError, error: deleteError?.message };
  }
  async function fetchMyRsvps() {
    const user = useSupabaseUser();
    if (!user.value) return [];
    const { data } = await supabase.from("event_rsvps").select("*").eq("alumni_id", user.value.id);
    return data || [];
  }
  async function fetchMyRsvpForEvent(eventId) {
    const user = useSupabaseUser();
    if (!user.value) return null;
    const { data } = await supabase.from("event_rsvps").select("*").eq("event_id", eventId).eq("alumni_id", user.value.id).single();
    return data;
  }
  async function saveEvent(event) {
    if (event.id) {
      const { data, error: updateError } = await supabase.from("events").update(event).eq("id", event.id).select().single();
      return { success: !updateError, data, error: updateError?.message };
    } else {
      const { data, error: insertError } = await supabase.from("events").insert(event).select().single();
      return { success: !insertError, data, error: insertError?.message };
    }
  }
  async function deleteEvent(id) {
    const { error: deleteError } = await supabase.from("events").delete().eq("id", id);
    return { success: !deleteError, error: deleteError?.message };
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
    deleteEvent
  };
}

export { useEvents as u };
//# sourceMappingURL=useEvents-CAlFHVlx.mjs.map
