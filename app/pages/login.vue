<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Sign In | Alumni Portal',
  robots: 'noindex, nofollow',
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const authStore = useAuthStore()
const { appName } = useSiteConfig()

const route = useRoute()
const errorParam = route.query.error

watch(user, async (newUser) => {
  if (newUser) {
    await authStore.loadProfile()
    if (authStore.isPending) {
      navigateTo('/pending')
    }
    else if (authStore.isActive) {
      navigateTo('/feed')
    }
  }
}, { immediate: true })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(errorParam === 'suspended' ? 'Your account has been suspended. Please contact the administrator.' : '')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) {
      error.value = authError.message.includes('Invalid login credentials')
        ? 'Invalid email or password'
        : authError.message
      return
    }
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
  <div class="min-h-screen flex items-center justify-center p-4 gradient-brand">
    <!-- Floating background orbs -->
    <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl animate-float orb-primary" />
    <div class="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-20 blur-3xl animate-float delay-3 orb-secondary" />

    <div class="relative w-full max-w-md animate-fade-in-up">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in-up">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white text-2xl font-bold shadow-xl border border-white/30 group-hover:scale-105 transition-transform duration-200">
            A
          </div>
          <div class="text-left">
            <h1 class="text-xl font-semibold text-white tracking-tight">{{ appName }}</h1>
            <p class="text-sm text-white/60">Alumni Portal</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Glass card -->
      <div class="glass relative overflow-hidden p-8 animate-scale-in delay-1">
        <!-- Specular highlight -->
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <h2 class="text-2xl font-semibold text-white tracking-tight text-center mb-1">Welcome Back</h2>
        <p class="text-white/60 text-center mb-7 text-sm">Sign in to your alumni account</p>

        <Message v-if="error" severity="error" class="mb-5" :closable="false">
          {{ error }}
        </Message>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div class="animate-fade-in-up delay-2">
            <label for="email" class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full"
              :disabled="loading"
            />
          </div>

          <div class="animate-fade-in-up delay-3">
            <label for="password" class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Password</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Your password"
              :feedback="false"
              toggle-mask
              class="w-full"
              input-class="w-full"
              :disabled="loading"
            />
          </div>

          <div class="animate-fade-in-up delay-4">
            <button
              type="submit"
              class="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
              :disabled="loading"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-sign-in" />
              Sign In
            </button>
          </div>
        </form>

        <p class="mt-6 text-center text-sm text-white/50 animate-fade-in-up delay-5">
          Don't have an account?
          <NuxtLink to="/register" class="text-white font-semibold hover:underline ml-1">
            Register here
          </NuxtLink>
        </p>

        <div class="mt-4 text-center">
          <NuxtLink to="/" class="text-xs text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1">
            <i class="pi pi-arrow-left text-[10px]" />
            Back to site
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

