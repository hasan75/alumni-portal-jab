<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Forgot Password | JAB Alumni',
  robots: 'noindex, nofollow',
})

const { appName } = useSiteConfig()

const email = ref('')
const loading = ref(false)
const error = ref('')
const submitted = ref(false)

async function handleSubmit() {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    submitted.value = true
  }
  catch (e: any) {
    error.value = e.data?.statusMessage || 'Something went wrong. Please try again.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 gradient-brand">
    <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl animate-float orb-primary" />
    <div class="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-20 blur-3xl animate-float delay-3 orb-secondary" />

    <div class="relative w-full max-w-md animate-fade-in-up">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in-up">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl border border-white/30 group-hover:scale-105 transition-transform duration-200">
            <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-12 w-12 rounded-xl object-cover" />
          </div>
          <div class="text-left">
            <h1 class="text-xl font-semibold text-white tracking-tight">{{ appName }}</h1>
            <p class="text-sm text-white/60">Janata Adarsha Bidyapith</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Glass card -->
      <div class="glass relative overflow-hidden p-8 animate-scale-in delay-1">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <!-- Success state -->
        <template v-if="submitted">
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-white/15 mx-auto mb-5 flex items-center justify-center">
              <i class="pi pi-envelope text-3xl text-white/80" />
            </div>
            <h2 class="text-2xl font-semibold text-white tracking-tight mb-2">Check Your Email</h2>
            <p class="text-white/60 text-sm leading-relaxed mb-6">
              If an account with that email exists, we've sent a password reset link. Check your inbox and spam folder.
            </p>
            <p class="text-white/40 text-xs mb-6">
              The link expires in 1 hour.
            </p>
            <NuxtLink
              to="/login"
              class="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
              <i class="pi pi-arrow-left" />
              Back to Login
            </NuxtLink>
          </div>
        </template>

        <!-- Form state -->
        <template v-else>
          <h2 class="text-2xl font-semibold text-white tracking-tight text-center mb-1">Forgot Password</h2>
          <p class="text-white/60 text-center mb-7 text-sm">Enter your email and we'll send you a reset link</p>

          <Message v-if="error" severity="error" class="mb-5" :closable="false">
            {{ error }}
          </Message>

          <form class="space-y-5" @submit.prevent="handleSubmit">
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
              <button
                type="submit"
                class="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
                :disabled="loading"
              >
                <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
                <i v-if="loading" class="pi pi-spin pi-spinner" />
                <i v-else class="pi pi-send" />
                Send Reset Link
              </button>
            </div>
          </form>

          <p class="mt-6 text-center text-sm text-white/50 animate-fade-in-up delay-4">
            Remember your password?
            <NuxtLink to="/login" class="text-white font-semibold hover:underline ml-1">
              Sign in
            </NuxtLink>
          </p>

          <div class="mt-4 text-center">
            <NuxtLink to="/" class="text-xs text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1">
              <i class="pi pi-arrow-left text-[10px]" />
              Back to site
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
