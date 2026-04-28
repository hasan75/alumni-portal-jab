<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Admin Login | JAB Alumni', robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const { appName } = useSiteConfig()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) {
      error.value = authError.message.includes('Invalid login credentials')
        ? 'Invalid email or password'
        : authError.message
      return
    }

    const userId = authData.user?.id
    if (!userId) {
      error.value = 'Login failed — no user returned'
      return
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('id', userId)
      .single()

    if (!adminData || !adminData.is_active) {
      await supabase.auth.signOut()
      error.value = 'You do not have admin access'
      return
    }

    await navigateTo('/admin/dashboard')
  }
  catch (e: any) {
    error.value = e.message || 'Login failed'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 gradient-brand-dark">
    <!-- Floating orbs -->
    <div class="absolute top-1/3 left-1/5 w-56 h-56 rounded-full opacity-15 blur-3xl animate-float orb-primary" />
    <div class="absolute bottom-1/3 right-1/5 w-40 h-40 rounded-full opacity-15 blur-3xl animate-float delay-2 orb-secondary" />

    <div class="relative w-full max-w-md animate-fade-in-up">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl border border-white/20 group-hover:scale-105 transition-transform duration-200">
            <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-12 w-12 rounded-xl object-cover" />
          </div>
          <div class="text-left">
            <h1 class="text-xl font-semibold text-white tracking-tight">{{ appName }}</h1>
            <p class="text-sm text-white/40">Admin Panel</p>
          </div>
        </NuxtLink>
      </div>

      <div class="glass-dark relative overflow-hidden p-8 animate-scale-in delay-1">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/10 via-transparent to-transparent" />

        <h2 class="text-2xl font-semibold text-white tracking-tight text-center mb-1">Admin Login</h2>
        <p class="text-white/40 text-center mb-7 text-sm">Sign in to manage the alumni portal</p>

        <Message v-if="error" severity="error" class="mb-5" :closable="false">
          {{ error }}
        </Message>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div class="animate-fade-in-up delay-2">
            <label class="block text-xs font-semibold tracking-wide uppercase text-white/40 mb-2">Email</label>
            <InputText v-model="email" type="email" placeholder="admin@example.com" class="w-full" :disabled="loading" />
          </div>
          <div class="animate-fade-in-up delay-3">
            <label class="block text-xs font-semibold tracking-wide uppercase text-white/40 mb-2">Password</label>
            <Password v-model="password" placeholder="Password" :feedback="false" toggle-mask class="w-full" input-class="w-full" :disabled="loading" />
          </div>
          <div class="animate-fade-in-up delay-4">
            <button
              type="submit"
              class="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60"
              style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);box-shadow:0 2px 0 rgba(255,255,255,0.12) inset,0 4px 20px rgba(0,0,0,0.3);"
              :disabled="loading"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent" />
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-sign-in" />
              Sign In
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-xs text-white/30 hover:text-white/60 transition-colors inline-flex items-center gap-1">
            <i class="pi pi-arrow-left text-[10px]" />
            Back to site
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

