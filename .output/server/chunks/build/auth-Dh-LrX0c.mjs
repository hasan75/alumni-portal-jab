import { ref, computed } from 'vue';
import { u as useSupabaseUser } from './server.mjs';
import { defineStore } from 'pinia';
import { u as useSupabaseClient } from './useSupabaseClient-CkLFOMIR.mjs';

const useAuthStore = defineStore("auth", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const profile = ref(null);
  const isLoaded = ref(false);
  const isActive = computed(() => profile.value?.status === "active");
  const isPending = computed(() => profile.value?.status === "pending");
  const isSuspended = computed(() => profile.value?.status === "suspended");
  const batchYear = computed(() => profile.value?.batch_year);
  const displayName = computed(() => profile.value?.display_name || profile.value?.full_name || "");
  async function loadProfile() {
    if (!user.value) {
      profile.value = null;
      isLoaded.value = true;
      return;
    }
    const { data, error } = await supabase.from("alumni_profiles").select("*").eq("id", user.value.id).single();
    if (error) {
      console.error("Error loading alumni profile:", error);
      profile.value = null;
    } else {
      profile.value = data;
    }
    isLoaded.value = true;
  }
  async function updateProfile(updates) {
    if (!user.value) return { success: false, error: "Not authenticated" };
    const { data, error } = await supabase.from("alumni_profiles").update(updates).eq("id", user.value.id).select().single();
    if (error) {
      return { success: false, error: error.message };
    }
    profile.value = data;
    return { success: true };
  }
  function clear() {
    profile.value = null;
    isLoaded.value = false;
  }
  return {
    profile,
    isLoaded,
    isActive,
    isPending,
    isSuspended,
    batchYear,
    displayName,
    loadProfile,
    updateProfile,
    clear
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth-Dh-LrX0c.mjs.map
