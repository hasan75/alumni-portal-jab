<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Pending Approval | Alumni Portal', robots: 'noindex' })

const supabase = useSupabaseClient()
const { appName } = useSiteConfig()

async function handleSignOut() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 gradient-brand">
    <div class="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl animate-float orb-amber" />

    <div class="relative w-full max-w-md text-center animate-scale-in">
      <div class="glass relative overflow-hidden p-12">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <div class="relative w-24 h-24 mx-auto mb-8 animate-float">
          <div class="w-24 h-24 rounded-full flex items-center justify-center"
            style="background:rgba(251,191,36,0.2);border:1px solid rgba(251,191,36,0.4);box-shadow:0 0 40px rgba(251,191,36,0.15);">
            <i class="pi pi-clock text-amber-300 text-4xl" />
          </div>
        </div>

        <h1 class="text-2xl font-semibold text-white tracking-tight mb-3">Pending Approval</h1>
        <p class="text-white/60 leading-relaxed mb-8">
          Your <span class="text-white font-medium">{{ appName }}</span> account is under review.
          An administrator will approve your membership soon.
          You'll be able to access the alumni portal once approved.
        </p>

        <button
          class="text-sm text-white/40 hover:text-red-400 transition-colors duration-200 inline-flex items-center gap-1.5"
          @click="handleSignOut"
        >
          <i class="pi pi-sign-out text-xs" />
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

