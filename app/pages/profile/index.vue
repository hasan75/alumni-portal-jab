<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Password from 'primevue/password'
import ToggleSwitch from 'primevue/toggleswitch'
import { useAuthStore } from '~/stores/auth'
import type { AlumniEducation, AlumniWorkExperience } from '~/types/member'

definePageMeta({ layout: 'member', middleware: 'member-auth' })
useSeoMeta({ title: 'My Profile | JAB Alumni', robots: 'noindex' })

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const toast = useToast()
const { fetchBatches, fetchEducation, addEducation, updateEducation, deleteEducation, fetchWorkExperience, addWorkExperience, updateWorkExperience, deleteWorkExperience, fetchSocialPlatforms, fetchSocialLinks, saveSocialLink, deleteSocialLink, setFeaturedEducation, unsetFeaturedEducation, setFeaturedWork, unsetFeaturedWork, syncSocialUrls, recalcFeaturedEducation, recalcFeaturedWork } = useMembers()

// Education state
const educationRecords = ref<any[]>([])
const showEduForm = ref(false)
const editingEduId = ref<number | null>(null)
const eduForm = reactive({
  institution: '',
  degree: '',
  field_of_study: '',
  start_year: null as number | null,
  end_year: null as number | null,
  is_current: false,
  url: '',
})

// Work state
const workRecords = ref<any[]>([])
const showWorkForm = ref(false)
const editingWorkId = ref<number | null>(null)
const workForm = reactive({
  company: '',
  job_title: '',
  location: '',
  industry: '',
  start_date: '',
  end_date: '',
  is_current: false,
  url: '',
})

// Social links state
const socialPlatforms = ref<any[]>([])
const socialLinks = ref<Record<string, string>>({})

onMounted(async () => {
  if (!authStore.isLoaded) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id) {
      await authStore.loadProfile(user.id)
    }
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
  avatar_url: null as string | null,
  cover_photo_url: null as string | null,
  show_email: false,
  show_phone: false,
  show_dob: false,
  current_status: 'other' as string,
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
      avatar_url: profile.avatar_url || null,
      cover_photo_url: profile.cover_photo_url || null,
      show_email: profile.show_email,
      show_phone: profile.show_phone,
      show_dob: profile.show_dob,
      current_status: profile.current_status || 'other',
    })
  }
}, { immediate: true })

const saving = ref(false)

const showPasswordForm = ref(false)
const passwordSaving = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

async function changePassword() {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    toast.add({ severity: 'warn', summary: 'Please fill in all password fields', life: 3000 })
    return
  }
  if (passwordForm.newPassword.length < 8) {
    toast.add({ severity: 'warn', summary: 'New password must be at least 8 characters', life: 3000 })
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({ severity: 'warn', summary: 'New passwords do not match', life: 3000 })
    return
  }

  passwordSaving.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    })
    toast.add({ severity: 'success', summary: 'Password updated successfully', life: 3000 })
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    showPasswordForm.value = false
  }
  catch (e: any) {
    const msg = e.data?.statusMessage || e.message || 'Failed to change password'
    toast.add({ severity: 'error', summary: msg, life: 4000 })
  }
  finally {
    passwordSaving.value = false
  }
}

async function saveImageField(field: 'avatar_url' | 'cover_photo_url', value: string | null) {
  form[field] = value
  const result = await authStore.updateProfile({ [field]: value })
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Photo updated', life: 2000 })
  }
  else {
    toast.add({ severity: 'error', summary: 'Failed to save photo', detail: result.error, life: 4000 })
  }
}

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

watch(() => authStore.profile?.id, async (id) => {
  if (id) {
    const [edu, work, platforms, links] = await Promise.all([
      fetchEducation(id),
      fetchWorkExperience(id),
      fetchSocialPlatforms(),
      fetchSocialLinks(id),
    ])
    educationRecords.value = edu
    workRecords.value = work
    socialPlatforms.value = platforms
    for (const link of links) {
      socialLinks.value[link.platform_slug] = link.url
    }

    if (edu.length > 0 && !edu.some(e => e.is_featured)) {
      await recalcFeaturedEducation(id)
      educationRecords.value = await fetchEducation(id)
    }
    if (work.length > 0 && !work.some(w => w.is_featured)) {
      await recalcFeaturedWork(id)
      workRecords.value = await fetchWorkExperience(id)
    }
  }
}, { immediate: true })

async function saveCurrentStatus(status: string) {
  form.current_status = status
  await authStore.updateProfile({ current_status: status as any })
}

function resetEduForm() {
  Object.assign(eduForm, { institution: '', degree: '', field_of_study: '', start_year: null, end_year: null, is_current: false, url: '' })
  editingEduId.value = null
  showEduForm.value = false
}

function editEdu(record: any) {
  Object.assign(eduForm, { institution: record.institution, degree: record.degree || '', field_of_study: record.field_of_study || '', start_year: record.start_year, end_year: record.end_year, is_current: record.is_current, url: record.url || '' })
  editingEduId.value = record.id
  showEduForm.value = true
}

async function saveEdu() {
  if (!eduForm.institution || !authStore.profile?.id) return
  const data = { ...eduForm, end_year: eduForm.is_current ? null : eduForm.end_year }

  let result
  if (editingEduId.value) {
    result = await updateEducation(editingEduId.value, data)
  }
  else {
    result = await addEducation(authStore.profile.id, data)
  }

  if (result.success) {
    educationRecords.value = await fetchEducation(authStore.profile.id)
    resetEduForm()
    toast.add({ severity: 'success', summary: 'Education saved', life: 2000 })
  }
  else {
    toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 })
  }
}

async function removeEdu(id: number) {
  if (!authStore.profile?.id) return
  const result = await deleteEducation(id, authStore.profile.id)
  if (result.success && authStore.profile?.id) {
    educationRecords.value = await fetchEducation(authStore.profile.id)
    toast.add({ severity: 'success', summary: 'Education removed', life: 2000 })
  }
}

async function toggleFeaturedEdu(edu: any) {
  if (!authStore.profile?.id) return
  if (edu.is_featured) {
    await unsetFeaturedEducation(authStore.profile.id)
  }
  else {
    await setFeaturedEducation(authStore.profile.id, edu.id)
  }
  educationRecords.value = await fetchEducation(authStore.profile.id)
  toast.add({ severity: 'success', summary: edu.is_featured ? 'Unfeatured' : 'Set as featured education', life: 2000 })
}

function resetWorkForm() {
  Object.assign(workForm, { company: '', job_title: '', location: '', industry: '', start_date: '', end_date: '', is_current: false, url: '' })
  editingWorkId.value = null
  showWorkForm.value = false
}

function editWork(record: any) {
  Object.assign(workForm, { company: record.company, job_title: record.job_title, location: record.location || '', industry: record.industry || '', start_date: record.start_date || '', end_date: record.end_date || '', is_current: record.is_current, url: record.url || '' })
  editingWorkId.value = record.id
  showWorkForm.value = true
}

async function saveWork() {
  if (!workForm.company || !workForm.job_title || !authStore.profile?.id) return
  const data = { ...workForm, end_date: workForm.is_current ? null : (workForm.end_date || null), start_date: workForm.start_date || null }

  let result
  if (editingWorkId.value) {
    result = await updateWorkExperience(editingWorkId.value, data)
  }
  else {
    result = await addWorkExperience(authStore.profile.id, data)
  }

  if (result.success) {
    workRecords.value = await fetchWorkExperience(authStore.profile.id)
    resetWorkForm()
    toast.add({ severity: 'success', summary: 'Work experience saved', life: 2000 })
  }
  else {
    toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 })
  }
}

async function removeWork(id: number) {
  if (!authStore.profile?.id) return
  const result = await deleteWorkExperience(id, authStore.profile.id)
  if (result.success && authStore.profile?.id) {
    workRecords.value = await fetchWorkExperience(authStore.profile.id)
    toast.add({ severity: 'success', summary: 'Work experience removed', life: 2000 })
  }
}

async function toggleFeaturedWork(work: any) {
  if (!authStore.profile?.id) return
  if (work.is_featured) {
    await unsetFeaturedWork(authStore.profile.id)
  }
  else {
    await setFeaturedWork(authStore.profile.id, work.id)
  }
  workRecords.value = await fetchWorkExperience(authStore.profile.id)
  toast.add({ severity: 'success', summary: work.is_featured ? 'Unfeatured' : 'Set as featured work', life: 2000 })
}

async function saveSocialUrl(platformSlug: string) {
  const url = socialLinks.value[platformSlug]?.trim()
  if (!url || !authStore.profile?.id) return
  await saveSocialLink(authStore.profile.id, platformSlug, url)
  await syncSocialUrls(authStore.profile.id)
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
      <!-- Current Status -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">What describes you best?</h2>
        <div class="relative">
          <Select
            :model-value="form.current_status"
            :options="[
              { label: 'Studying', value: 'studying' },
              { label: 'Working', value: 'working' },
              { label: 'Business / Self-employed', value: 'business' },
              { label: 'Studying & Working', value: 'studying_and_working' },
              { label: 'Other', value: 'other' },
            ]"
            option-label="label"
            option-value="value"
            class="w-full"
            @update:model-value="saveCurrentStatus"
          />
        </div>
      </div>

      <!-- Profile Photos -->
      <div class="glass-light relative overflow-hidden animate-fade-in-up delay-1">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <!-- Cover photo -->
        <div class="relative">
          <SharedImageUpload
            :model-value="form.cover_photo_url"
            bucket="covers"
            :path="authStore.profile?.id || 'temp'"
            aspect-ratio="3/1"
            placeholder="Upload cover photo"
            @update:model-value="(v) => saveImageField('cover_photo_url', v)"
          />
        </div>

        <!-- Avatar + name row -->
        <div class="relative px-6 pb-5 pt-4 flex items-end gap-4">
          <div class="-mt-10 relative z-10">
            <SharedImageUpload
              :model-value="form.avatar_url"
              bucket="avatars"
              :path="authStore.profile?.id || 'temp'"
              aspect-ratio="1/1"
              compact
              placeholder="Photo"
              @update:model-value="(v) => saveImageField('avatar_url', v)"
            />
          </div>
          <div class="pb-1">
            <p class="text-sm font-semibold" style="color: #1e293b;">{{ form.full_name || 'Your Name' }}</p>
            <p class="text-xs" style="color: #64748b;">Click images above to upload</p>
          </div>
        </div>
      </div>

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

      <!-- Education History -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-3">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <div class="relative flex items-center justify-between">
          <h2 class="font-semibold text-slate-900">Education History</h2>
          <button
            v-if="!showEduForm"
            type="button"
            class="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors"
            @click="showEduForm = true"
          >
            + Add Education
          </button>
        </div>

        <!-- Education form (add/edit) -->
        <div v-if="showEduForm" class="relative space-y-3 p-4 rounded-xl" style="border: 1.5px solid #e2e8f0; background: #f8fafc;">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Institution *</label>
              <InputText v-model="eduForm.institution" class="w-full" placeholder="e.g. University of Dhaka" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Degree</label>
              <InputText v-model="eduForm.degree" class="w-full" placeholder="e.g. BSc, HSC" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Field of Study</label>
              <InputText v-model="eduForm.field_of_study" class="w-full" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Start Year</label>
              <InputText v-model="eduForm.start_year" type="number" class="w-full" placeholder="2020" />
            </div>
            <div v-if="!eduForm.is_current">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">End Year</label>
              <InputText v-model="eduForm.end_year" type="number" class="w-full" placeholder="2024" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Institution URL</label>
              <InputText v-model="eduForm.url" class="w-full" placeholder="https://university.edu" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="eduForm.is_current" />
            <span class="text-sm text-slate-600">Currently studying here</span>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg transition-colors" @click="resetEduForm">Cancel</button>
            <button type="button" class="px-4 py-1.5 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-500 active:scale-95 transition-all" @click="saveEdu">Save</button>
          </div>
        </div>

        <!-- Education list -->
        <div v-for="edu in educationRecords" :key="edu.id" class="relative group flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-graduation-cap text-primary-600 text-sm" />
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ edu.institution }}</p>
              <p v-if="edu.degree || edu.field_of_study" class="text-xs text-slate-500">{{ [edu.degree, edu.field_of_study].filter(Boolean).join(' · ') }}</p>
              <p v-if="edu.start_year" class="text-xs text-slate-400">{{ edu.start_year }}{{ edu.end_year ? ` – ${edu.end_year}` : edu.is_current ? ' – Present' : '' }}</p>
              <a v-if="edu.url" :href="safeUrl(edu.url)" target="_blank" class="text-xs text-primary-600 hover:underline">{{ edu.url }}</a>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" class="p-1.5 rounded-lg transition-colors" :class="edu.is_featured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'" @click="toggleFeaturedEdu(edu)" :title="edu.is_featured ? 'Remove from featured' : 'Set as featured'"><i :class="edu.is_featured ? 'pi pi-star-fill' : 'pi pi-star'" class="text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg transition-colors" @click="editEdu(edu)"><i class="pi pi-pencil text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors" @click="removeEdu(edu.id)"><i class="pi pi-trash text-xs" /></button>
          </div>
        </div>

        <p v-if="!educationRecords.length && !showEduForm" class="relative text-sm text-slate-400 text-center py-4">No education records yet</p>
      </div>

      <!-- Work Experience -->
      <div v-if="form.current_status === 'working' || form.current_status === 'business' || form.current_status === 'studying_and_working'" class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-4">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <div class="relative flex items-center justify-between">
          <h2 class="font-semibold text-slate-900">Work Experience</h2>
          <button
            v-if="!showWorkForm"
            type="button"
            class="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors"
            @click="showWorkForm = true"
          >
            + Add Experience
          </button>
        </div>

        <!-- Work form (add/edit) -->
        <div v-if="showWorkForm" class="relative space-y-3 p-4 rounded-xl" style="border: 1.5px solid #e2e8f0; background: #f8fafc;">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">{{ form.current_status === 'business' ? 'Business Name' : 'Company' }} *</label>
              <InputText v-model="workForm.company" class="w-full" placeholder="e.g. Google" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">{{ form.current_status === 'business' ? 'Your Role' : 'Job Title' }} *</label>
              <InputText v-model="workForm.job_title" class="w-full" placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Location</label>
              <InputText v-model="workForm.location" class="w-full" placeholder="e.g. Dhaka, Bangladesh" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Industry</label>
              <InputText v-model="workForm.industry" class="w-full" placeholder="e.g. Technology" />
            </div>
            <div>
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Start Date</label>
              <InputText v-model="workForm.start_date" type="date" class="w-full" />
            </div>
            <div v-if="!workForm.is_current">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">End Date</label>
              <InputText v-model="workForm.end_date" type="date" class="w-full" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Company URL</label>
              <InputText v-model="workForm.url" class="w-full" placeholder="https://company.com" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="workForm.is_current" />
            <span class="text-sm text-slate-600">I currently work here</span>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg transition-colors" @click="resetWorkForm">Cancel</button>
            <button type="button" class="px-4 py-1.5 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-500 active:scale-95 transition-all" @click="saveWork">Save</button>
          </div>
        </div>

        <!-- Work list -->
        <div v-for="work in workRecords" :key="work.id" class="relative group flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-briefcase text-primary-600 text-sm" />
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ work.job_title }}</p>
              <p class="text-xs text-slate-500">{{ work.company }}{{ work.location ? ` · ${work.location}` : '' }}</p>
              <p v-if="work.start_date" class="text-xs text-slate-400">{{ work.start_date }}{{ work.end_date ? ` – ${work.end_date}` : work.is_current ? ' – Present' : '' }}</p>
              <a v-if="work.url" :href="safeUrl(work.url)" target="_blank" class="text-xs text-primary-600 hover:underline">{{ work.url }}</a>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" class="p-1.5 rounded-lg transition-colors" :class="work.is_featured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'" @click="toggleFeaturedWork(work)" :title="work.is_featured ? 'Remove from featured' : 'Set as featured'"><i :class="work.is_featured ? 'pi pi-star-fill' : 'pi pi-star'" class="text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg transition-colors" @click="editWork(work)"><i class="pi pi-pencil text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors" @click="removeWork(work.id)"><i class="pi pi-trash text-xs" /></button>
          </div>
        </div>

        <p v-if="!workRecords.length && !showWorkForm" class="relative text-sm text-slate-400 text-center py-4">No work experience yet</p>
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

      <!-- Social Links -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-5">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <h2 class="font-semibold text-slate-900 relative">Social Links</h2>
        <div class="relative space-y-3">
          <div v-for="platform in socialPlatforms" :key="platform.slug" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :style="`background: ${platform.color}15;`">
              <i :class="platform.icon" class="text-sm" :style="`color: ${platform.color};`" />
            </div>
            <InputText
              v-model="socialLinks[platform.slug]"
              class="w-full"
              :placeholder="platform.placeholder || `Your ${platform.name} URL`"
              @blur="saveSocialUrl(platform.slug)"
            />
          </div>
        </div>
        <p v-if="!socialPlatforms.length" class="relative text-sm text-slate-400 text-center py-4">No social platforms configured</p>
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

      <!-- Change Password -->
      <div class="glass-light relative overflow-hidden p-6 space-y-4 animate-fade-in-up delay-5">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <div class="relative flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-slate-900">Change Password</h2>
            <p class="text-sm text-slate-500">Update your account password</p>
          </div>
          <button
            v-if="!showPasswordForm"
            type="button"
            class="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors"
            @click="showPasswordForm = true"
          >
            Change
          </button>
        </div>

        <div v-if="showPasswordForm" class="relative space-y-4 pt-2">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Current Password</label>
            <Password
              v-model="passwordForm.currentPassword"
              :feedback="false"
              toggle-mask
              class="w-full"
              input-class="w-full"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">New Password</label>
            <Password
              v-model="passwordForm.newPassword"
              :feedback="true"
              toggle-mask
              class="w-full"
              input-class="w-full"
              placeholder="Minimum 8 characters"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Confirm New Password</label>
            <Password
              v-model="passwordForm.confirmPassword"
              :feedback="false"
              toggle-mask
              class="w-full"
              input-class="w-full"
              placeholder="Re-enter new password"
            />
          </div>
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              class="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
              @click="showPasswordForm = false; passwordForm.currentPassword = ''; passwordForm.newPassword = ''; passwordForm.confirmPassword = ''"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-primary-600 hover:bg-primary-500 active:scale-95 transition-all duration-200 disabled:opacity-60"
              :disabled="passwordSaving"
              @click="changePassword"
            >
              <i v-if="passwordSaving" class="pi pi-spin pi-spinner mr-1" />
              Update Password
            </button>
          </div>
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
