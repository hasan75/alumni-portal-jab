import { u as useSupabaseClient } from './useSupabaseClient-CkLFOMIR.mjs';
import { ref } from 'vue';

function useJobs() {
  const supabase = useSupabaseClient();
  const jobs = ref([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref(null);
  async function fetchJobs(filters = {}) {
    loading.value = true;
    error.value = null;
    const page = filters.page || 1;
    const perPage = filters.perPage || 12;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    let query = supabase.from("jobs").select("*, category:job_categories(*)", { count: "exact" }).eq("status", "published");
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.jobType) query = query.eq("job_type", filters.jobType);
    if (filters.isRemote !== void 0) query = query.eq("is_remote", filters.isRemote);
    if (filters.featured) query = query.eq("is_featured", true);
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }
    query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false }).range(from, to);
    const { data, error: fetchError, count } = await query;
    if (fetchError) {
      error.value = fetchError.message;
    } else {
      jobs.value = data || [];
      totalCount.value = count || 0;
    }
    loading.value = false;
    return jobs.value;
  }
  async function fetchAllForAdmin(filters = {}) {
    loading.value = true;
    const page = filters.page || 1;
    const perPage = filters.perPage || 20;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    let query = supabase.from("jobs").select("*, category:job_categories(*)", { count: "exact" });
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }
    query = query.order("created_at", { ascending: false }).range(from, to);
    const { data, error: fetchError, count } = await query;
    loading.value = false;
    if (fetchError) {
      error.value = fetchError.message;
      return [];
    }
    jobs.value = data || [];
    totalCount.value = count || 0;
    return jobs.value;
  }
  async function fetchBySlug(slug) {
    const { data, error: fetchError } = await supabase.from("jobs").select("*, category:job_categories(*)").eq("slug", slug).single();
    if (fetchError) return null;
    await supabase.from("jobs").update({ view_count: data.view_count + 1 }).eq("id", data.id).catch(() => {
    });
    return data;
  }
  async function fetchCategories() {
    const { data } = await supabase.from("job_categories").select("*").order("display_order");
    return data || [];
  }
  async function saveJob(job) {
    if (job.id) {
      const { data, error: updateError } = await supabase.from("jobs").update(job).eq("id", job.id).select().single();
      return { success: !updateError, data, error: updateError?.message };
    } else {
      const { data, error: insertError } = await supabase.from("jobs").insert(job).select().single();
      return { success: !insertError, data, error: insertError?.message };
    }
  }
  async function deleteJob(id) {
    const { error: deleteError } = await supabase.from("jobs").delete().eq("id", id);
    return { success: !deleteError, error: deleteError?.message };
  }
  return {
    jobs,
    totalCount,
    loading,
    error,
    fetchJobs,
    fetchAllForAdmin,
    fetchBySlug,
    fetchCategories,
    saveJob,
    deleteJob
  };
}

export { useJobs as u };
//# sourceMappingURL=useJobs-CxDM5wuT.mjs.map
