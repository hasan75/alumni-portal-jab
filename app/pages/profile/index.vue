<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import { useAuthStore } from '~/stores/auth'
import type { AlumniEducation, AlumniWorkExperience } from '~/types/member'

definePageMeta({ layout: 'member', middleware: 'member-auth' })
useSeoMeta({ title: 'My Profile | Alumni Portal', robots: 'noindex' })

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const toast = useToast()
const { fetchBatches } = useMembers()

onMounted(async () => {
  if (!authStore.isLoaded) {
    await authStore.loadProfile()
  }
})

const batches = ref<{ label: string, value: number }[]>([])
onMounted(async () => {
  const list = await fetchBatches()
  batches.value = list.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year }))
})

const form = reactive({
  full_name: '',
  display_name: '',
  bio: '',
  batch_year: null as number | null,
  department: '',
  degree: '',
  graduation_year: null as number | null,
  city: '',
  country: '',
  phone: '',
  current_job_title: '',
  current_company: '',
  industry: '',
  show_email: false,
  show_phone: false,
  show_dob: false,
})

watch(() => authStore.profile, (profile) => {
  if (profile) {
    Object.assign(form, {
      full_name: profile.full_name || '',
      display_name: profile.display_name || '',
      bio: profile.bio || '',
      batch_year: profile.batch_year,
      department: profile.department || '',
      degree: profile.degree || '',
      graduation_year: profile.graduation_year,
      city: profile.city || '',
      country: profile.country || '',
      phone: profile.phone || '',
      current_job_title: profile.current_job_title || '',
      current_company: profile.current_company || '',
      industry: profile.industry || '',
      show_email: profile.show_email,
      show_phone: profile.show_phone,
      show_dob: profile.show_dob,
    })
  }
}, { immediate: true })

const saving = ref(false)

async function saveProfile() {
  saving.value = true
  const result = await authStore.updateProfile({
    ...form,
    graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
  })
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Profile saved!', life: 2000 })
  }
  else {
    toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 })
  }
  saving.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <div class="animate-fade-in-up">
      <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-1">Account</p>
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">My Profile</h1>
      <p class="text-slate-500 text-sm mt-1">Update your alumni profile information</p>
    </div>

    <form class="space-y-5" @submit.prevent="saveProfile">
      <!-- Basic Info -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-1">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">Basic Information</h2>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Full Name *</label>
            <InputText v-model="form.full_name" class="w-full" placeholder="Your full name" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Display Name</label>
            <InputText v-model="form.display_name" class="w-full" placeholder="Shown publicly" />
          </div>
        </div>

        <div class="relative">
          <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Bio</label>
          <Textarea v-model="form.bio" :rows="3" class="w-full" placeholder="Tell your alumni community about yourself" />
        </div>
      </div>

      <!-- Academic Info -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-2">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">Academic Information</h2>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Graduation Year</label>
            <Select
              v-model="form.batch_year"
              :options="batches"
              option-label="label"
              option-value="value"
              placeholder="Select batch"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Department</label>
            <InputText v-model="form.department" class="w-full" placeholder="e.g. Computer Science" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Degree</label>
            <InputText v-model="form.degree" class="w-full" placeholder="e.g. BSc, MSc" />
          </div>
        </div>
      </div>

      <!-- Professional Info -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-3">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">Professional Information</h2>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Job Title</label>
            <InputText v-model="form.current_job_title" class="w-full" placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Company</label>
            <InputText v-model="form.current_company" class="w-full" placeholder="Current employer" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Industry</label>
            <InputText v-model="form.industry" class="w-full" placeholder="e.g. Technology" />
          </div>
        </div>
      </div>

      <!-- Location & Contact -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-4">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">Location & Contact</h2>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">City</label>
            <InputText v-model="form.city" class="w-full" placeholder="Your city" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Country</label>
            <InputText v-model="form.country" class="w-full" placeholder="Your country" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Phone</label>
            <InputText v-model="form.phone" class="w-full" placeholder="Phone number" />
          </div>
        </div>
      </div>

      <!-- Privacy -->
      <div class="glass-light relative overflow-hidden p-6 space-y-3 animate-fade-in-up delay-5">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">Privacy Settings</h2>
        <p class="text-sm text-slate-500 relative">Control what other alumni can see on your profile</p>

        <div
          v-for="item in [
            { field: 'show_email', label: 'Show email address to other alumni' },
            { field: 'show_phone', label: 'Show phone number to other alumni' },
            { field: 'show_dob', label: 'Show date of birth to other alumni' },
          ]"
          :key="item.field"
          class="relative flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
        >
          <span class="text-sm text-slate-600">{{ item.label }}</span>
          <ToggleSwitch v-model="(form as any)[item.field]" />
        </div>
      </div>

      <div class="flex justify-end animate-fade-in-up delay-5">
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60 shadow-sm shadow-primary-600/30"
          :disabled="saving"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner" />
          <i v-else class="pi pi-save" />
          Save Profile
        </button>
      </div>
    </form>
  </div>
</template>
