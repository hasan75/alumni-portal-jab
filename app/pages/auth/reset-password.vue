<script setup lang="ts">
import Password from 'primevue/password'
import Message from 'primevue/message'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Reset Password | Alumni Portal',
  robots: 'noindex, nofollow',
})

const supabase = useSupabaseClient()
const { appName } = useSiteConfig()

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const tokenValid = ref(true)
const checking = ref(true)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    tokenValid.value = false
  }
  checking.value = false
})

async function handleReset() {
  error.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Please fill in both fields'
    return
  }

  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    })

    if (updateError) {
      error.value = updateError.message
      return
    }

    await supabase.auth.signOut()
    success.value = true
  }
  catch (e: any) {
    error.value = e.message || 'Failed to reset password'
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
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <!-- Loading state -->
        <div v-if="checking" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl text-white/60" />
          <p class="mt-3 text-white/50 text-sm">Verifying reset link...</p>
        </div>

        <!-- Invalid/expired token -->
        <template v-else-if="!tokenValid">
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-red-500/15 mx-auto mb-5 flex items-center justify-center">
              <i class="pi pi-exclamation-triangle text-3xl text-red-400" />
            </div>
            <h2 class="text-2xl font-semibold text-white tracking-tight mb-2">Link Expired</h2>
            <p class="text-white/60 text-sm leading-relaxed mb-6">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <NuxtLink
              to="/forgot-password"
              class="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
              <i class="pi pi-refresh" />
              Request New Link
            </NuxtLink>
          </div>
        </template>

        <!-- Success state -->
        <template v-else-if="success">
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-green-500/15 mx-auto mb-5 flex items-center justify-center">
              <i class="pi pi-check-circle text-3xl text-green-400" />
            </div>
            <h2 class="text-2xl font-semibold text-white tracking-tight mb-2">Password Updated</h2>
            <p class="text-white/60 text-sm leading-relaxed mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <NuxtLink
              to="/login"
              class="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
              <i class="pi pi-sign-in" />
              Go to Login
            </NuxtLink>
          </div>
        </template>

        <!-- Reset form -->
        <template v-else>
          <h2 class="text-2xl font-semibold text-white tracking-tight text-center mb-1">Set New Password</h2>
          <p class="text-white/60 text-center mb-7 text-sm">Choose a strong password for your account</p>

          <Message v-if="error" severity="error" class="mb-5" :closable="false">
            {{ error }}
          </Message>

          <form class="space-y-5" @submit.prevent="handleReset">
            <div class="animate-fade-in-up delay-2">
              <label for="new-password" class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">New Password</label>
              <Password
                id="new-password"
                v-model="newPassword"
                placeholder="Minimum 8 characters"
                :feedback="true"
                toggle-mask
                class="w-full"
                input-class="w-full"
                :disabled="loading"
              />
            </div>

            <div class="animate-fade-in-up delay-3">
              <label for="confirm-password" class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Confirm Password</label>
              <Password
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="Re-enter your password"
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
                <i v-else class="pi pi-lock" />
                Reset Password
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
