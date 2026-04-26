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
  <div class="min-h-screen flex items-center justify-center p-4 gradient-brand-light">
    <div class="relative w-full max-w-md text-center animate-scale-in">
      <div class="glass-light relative overflow-hidden p-12">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative w-24 h-24 mx-auto mb-8 animate-float">
          <div class="w-24 h-24 rounded-full flex items-center justify-center bg-amber-50 border border-amber-200 shadow-lg shadow-amber-100">
            <i class="pi pi-clock text-amber-500 text-4xl" />
          </div>
        </div>

        <h1 class="text-2xl font-semibold text-slate-900 tracking-tight mb-3">Pending Approval</h1>
        <p class="text-slate-500 leading-relaxed mb-8">
          Your <span class="text-slate-900 font-medium">{{ appName }}</span> account is under review.
          An administrator will approve your membership soon.
          You'll be able to access the alumni portal once approved.
        </p>

        <button
          class="text-sm text-slate-400 hover:text-red-500 transition-colors duration-200 inline-flex items-center gap-1.5"
          @click="handleSignOut"
        >
          <i class="pi pi-sign-out text-xs" />
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>
