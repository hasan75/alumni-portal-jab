<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const { appName } = useSiteConfig()

const status = ref<'processing' | 'error'>('processing')
const errorMessage = ref('')

onMounted(async () => {
  // The PKCE client rejects implicit-grant hash tokens in _initialize(), leaving
  // the hash intact. We read it ourselves and call setSession() directly,
  // which bypasses the flow-type check and persists the session into cookies.
  const hash = window.location.hash
  const params = new URLSearchParams(hash.substring(1))

  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  const type = params.get('type')

  if (!access_token || !refresh_token) {
    status.value = 'error'
    errorMessage.value = 'Invalid or missing confirmation link.'
    return
  }

  const { error } = await supabase.auth.setSession({ access_token, refresh_token })

  if (error) {
    status.value = 'error'
    errorMessage.value = 'This link has expired or is invalid. Please request a new one.'
    return
  }

  // Clear the hash so tokens aren't left in browser history
  window.history.replaceState(null, '', window.location.pathname)

  if (type === 'recovery') {
    await navigateTo('/auth/reset-password')
  }
  else {
    await navigateTo('/feed')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 gradient-brand">
    <div class="relative w-full max-w-sm animate-fade-in-up">
      <div class="glass relative overflow-hidden p-8 text-center animate-scale-in">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <template v-if="status === 'processing'">
          <i class="pi pi-spin pi-spinner text-3xl text-white/60 mb-4 block" />
          <h2 class="text-lg font-semibold text-white tracking-tight">Verifying link…</h2>
        </template>

        <template v-else>
          <div class="w-14 h-14 rounded-2xl bg-red-500/15 mx-auto mb-5 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-2xl text-red-400" />
          </div>
          <h2 class="text-xl font-semibold text-white tracking-tight mb-2">Link Invalid</h2>
          <p class="text-white/60 text-sm leading-relaxed mb-6">{{ errorMessage }}</p>
          <NuxtLink
            to="/forgot-password"
            class="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
          >
            <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
            <i class="pi pi-refresh" />
            Request New Link
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>
