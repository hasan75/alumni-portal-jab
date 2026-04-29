<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Select from 'primevue/select'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Register | JAB Alumni',
})

const { fetchBatches } = useMembers()
const { appName, institutionName } = useSiteConfig()

const batches = ref<{ label: string, value: number }[]>([])

const form = reactive({
  full_name: '',
  email: '',
  password: '',
  confirm_password: '',
  batch_year: null as number | null,
  student_id: '',
  phone: '',
})

const loading = ref(false)
const error = ref('')
const submitted = ref(false)

const passwordRules = [
  (p: string) => p.length >= 8,
  (p: string) => /[A-Z]/.test(p),
  (p: string) => /[a-z]/.test(p),
  (p: string) => /[0-9]/.test(p),
  (p: string) => /[^A-Za-z0-9]/.test(p),
]
const isPasswordValid = computed(() => passwordRules.every(r => r(form.password)))

onMounted(async () => {
  const batchList = await fetchBatches()
  batches.value = batchList.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year }))
})

async function handleRegister() {
  if (!form.full_name || !form.email || !form.password) {
    error.value = 'Please fill in all required fields'
    return
  }
  if (form.password !== form.confirm_password) {
    error.value = 'Passwords do not match'
    return
  }
  if (!isPasswordValid.value) {
    error.value = 'Password does not meet all requirements'
    return
  }
  if (form.student_id && !form.batch_year) {
    error.value = 'Please select your graduation year when providing a Student ID'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        batch_year: form.batch_year,
        student_id: form.student_id || undefined,
        phone: form.phone || undefined,
      },
    })

    if (response.success) {
      submitted.value = true
    }
  }
  catch (e: any) {
    error.value = e.data?.statusMessage || e.message || 'Registration failed'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 py-12 gradient-brand">
    <div class="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl animate-float orb-secondary" />
    <div class="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full opacity-15 blur-3xl animate-float delay-2 orb-secondary" />

    <div class="relative w-full max-w-lg animate-fade-in-up">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl border border-white/30 group-hover:scale-105 transition-transform duration-200">
            <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-12 w-12 rounded-xl object-cover" />
          </div>
          <div class="text-left">
            <h1 class="text-xl font-semibold text-white tracking-tight">{{ appName }}</h1>
            <p class="text-sm text-white/60">{{ institutionName }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Success state -->
      <div v-if="submitted" class="glass relative overflow-hidden p-10 text-center animate-scale-in">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        <div class="relative w-20 h-20 mx-auto mb-6 animate-scale-in">
          <div class="w-20 h-20 rounded-full flex items-center justify-center" style="background:rgba(52,199,89,0.2);border:1px solid rgba(52,199,89,0.4);">
            <i class="pi pi-check text-green-400 text-3xl" />
          </div>
        </div>
        <h2 class="text-2xl font-semibold text-white tracking-tight mb-2">Application Submitted!</h2>
        <p class="text-white/60 mb-8 leading-relaxed">
          Your registration is pending admin approval. You will be notified once your account is activated.
        </p>
        <NuxtLink to="/" class="text-white/70 hover:text-white text-sm transition-colors underline underline-offset-2">
          Return to Homepage
        </NuxtLink>
      </div>

      <!-- Form -->
      <div v-else class="glass relative overflow-hidden p-8 animate-scale-in delay-1">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <h2 class="text-2xl font-semibold text-white tracking-tight text-center mb-1">Create Account</h2>
        <p class="text-white/60 text-center mb-7 text-sm">Join the alumni network</p>

        <Message v-if="error" severity="error" class="mb-5" :closable="false">
          {{ error }}
        </Message>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <div class="animate-fade-in-up delay-1">
            <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Full Name *</label>
            <InputText v-model="form.full_name" placeholder="Your full name" class="w-full" :disabled="loading" />
          </div>

          <div class="animate-fade-in-up delay-2">
            <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Email *</label>
            <InputText v-model="form.email" type="email" placeholder="you@example.com" class="w-full" :disabled="loading" />
          </div>

          <div class="grid grid-cols-2 gap-4 animate-fade-in-up delay-3">
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Password *</label>
              <Password
                v-model="form.password"
                placeholder="Min 8 characters"
                :feedback="false"
                toggle-mask
                class="w-full"
                input-class="w-full"
                :disabled="loading"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Confirm *</label>
              <Password
                v-model="form.confirm_password"
                placeholder="Repeat password"
                :feedback="false"
                toggle-mask
                class="w-full"
                input-class="w-full"
                :disabled="loading"
              />
            </div>
          </div>
          <SharedPasswordStrengthMeter :password="form.password" context="dark" />

          <div class="animate-fade-in-up delay-3">
            <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Graduation Year</label>
            <Select
              v-model="form.batch_year"
              :options="batches"
              option-label="label"
              option-value="value"
              placeholder="Select your batch"
              class="w-full"
              :disabled="loading"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 animate-fade-in-up delay-4">
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Student ID</label>
              <InputText v-model="form.student_id" placeholder="Optional" class="w-full" :disabled="loading" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">Phone</label>
              <InputText v-model="form.phone" placeholder="Optional" class="w-full" :disabled="loading" />
            </div>
          </div>

          <div class="animate-fade-in-up delay-5 pt-1">
            <button
              type="submit"
              class="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60"
              style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 4px 20px rgba(0,0,0,0.2);"
              :disabled="loading"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-user-plus" />
              Submit Application
            </button>
          </div>
        </form>

        <p class="mt-6 text-center text-sm text-white/50 animate-fade-in-up delay-5">
          Already have an account?
          <NuxtLink to="/login" class="text-white font-semibold hover:underline ml-1">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

