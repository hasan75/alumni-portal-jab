<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import Message from 'primevue/message'
import MemberStatusBadge from '~/components/admin/members/MemberStatusBadge.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const isNew = id === 'new'

const { fetchProfile, updateMember, approveMembers, rejectMember, suspendMember, fetchBatches, fetchEducation, addEducation, updateEducation, deleteEducation, fetchWorkExperience, addWorkExperience, updateWorkExperience, deleteWorkExperience, fetchSocialPlatforms, fetchSocialLinks, setFeaturedEducation, unsetFeaturedEducation, setFeaturedWork, unsetFeaturedWork } = useMembers()
const toast = useToast()
const confirm = useConfirm()

const profile = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const batches = ref<{ label: string, value: number }[]>([])
const educationRecords = ref<any[]>([])
const workRecords = ref<any[]>([])
const socialPlatforms = ref<any[]>([])
const socialLinks = ref<any[]>([])

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

onMounted(async () => {
  loading.value = true
  const batchList = await fetchBatches()
  batches.value = batchList.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year }))

  if (!isNew) {
    const p = await fetchProfile(id)
    profile.value = p
    if (p) {
      const [edu, work, platforms, links] = await Promise.all([
        fetchEducation(id),
        fetchWorkExperience(id),
        fetchSocialPlatforms(),
        fetchSocialLinks(id),
      ])
      educationRecords.value = edu
      workRecords.value = work
      socialPlatforms.value = platforms
      socialLinks.value = links
    }
  }
  loading.value = false
})

useSeoMeta({
  title: computed(() => isNew ? 'New Member | Admin' : `${profile.value?.full_name || 'Member'} | Admin`),
  robots: 'noindex',
})

const form = reactive({
  full_name: '',
  display_name: '',
  email: '',
  batch_year: null as number | null,
  department: '',
  degree: '',
  city: '',
  country: '',
  current_status: 'other' as string,
  bio: '',
  avatar_url: '' as string | null,
  cover_photo_url: '' as string | null,
  status: 'pending' as string,
  is_verified: false,
})

watch(profile, (p) => {
  if (p) Object.assign(form, { ...p })
}, { immediate: true })

const createForm = reactive({
  email: '',
  full_name: '',
  batch_year: null as number | null,
  student_id: '',
  phone: '',
  department: '',
  degree: '',
  current_status: 'other' as string,
  city: '',
  country: '',
  status: 'active' as string,
})

async function create() {
  if (!createForm.email || !createForm.full_name) {
    toast.add({ severity: 'warn', summary: 'Email and full name are required', life: 3000 })
    return
  }
  saving.value = true
  try {
    await $fetch('/api/auth/admin-create-member', {
      method: 'POST',
      body: createForm,
    })
    toast.add({ severity: 'success', summary: 'Member created', detail: `An invite email has been sent to ${createForm.email}.`, life: 4000 })
    await navigateTo('/admin/members')
  }
  catch (e: any) {
    toast.add({ severity: 'error', summary: 'Creation failed', detail: e.data?.statusMessage || e.message || 'Unknown error', life: 3000 })
  }
  saving.value = false
}

async function save() {
  saving.value = true
  const result = await updateMember(id, form)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Member updated', life: 2000 })
    await navigateTo('/admin/members')
  }
  else {
    toast.add({ severity: 'error', summary: 'Update failed', detail: result.error, life: 3000 })
  }
  saving.value = false
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
  if (!eduForm.institution) return
  const data = { ...eduForm, end_year: eduForm.is_current ? null : eduForm.end_year }
  const result = editingEduId.value
    ? await updateEducation(editingEduId.value, data)
    : await addEducation(id, data)
  if (result.success) {
    educationRecords.value = await fetchEducation(id)
    resetEduForm()
    toast.add({ severity: 'success', summary: 'Education saved', life: 2000 })
  }
  else { toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 }) }
}

async function removeEdu(eduId: number) {
  const result = await deleteEducation(eduId, id)
  if (result.success) {
    educationRecords.value = await fetchEducation(id)
    toast.add({ severity: 'success', summary: 'Education removed', life: 2000 })
  }
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
  if (!workForm.company || !workForm.job_title) return
  const data = { ...workForm, end_date: workForm.is_current ? null : (workForm.end_date || null), start_date: workForm.start_date || null }
  const result = editingWorkId.value
    ? await updateWorkExperience(editingWorkId.value, data)
    : await addWorkExperience(id, data)
  if (result.success) {
    workRecords.value = await fetchWorkExperience(id)
    resetWorkForm()
    toast.add({ severity: 'success', summary: 'Work experience saved', life: 2000 })
  }
  else { toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 }) }
}

async function removeWork(workId: number) {
  const result = await deleteWorkExperience(workId, id)
  if (result.success) {
    workRecords.value = await fetchWorkExperience(id)
    toast.add({ severity: 'success', summary: 'Work experience removed', life: 2000 })
  }
}

async function toggleFeaturedEdu(edu: any) {
  if (edu.is_featured) {
    await unsetFeaturedEducation(id)
  }
  else {
    await setFeaturedEducation(id, edu.id)
  }
  educationRecords.value = await fetchEducation(id)
  toast.add({ severity: 'success', summary: edu.is_featured ? 'Unfeatured' : 'Set as featured education', life: 2000 })
}

async function toggleFeaturedWork(work: any) {
  if (work.is_featured) {
    await unsetFeaturedWork(id)
  }
  else {
    await setFeaturedWork(id, work.id)
  }
  workRecords.value = await fetchWorkExperience(id)
  toast.add({ severity: 'success', summary: work.is_featured ? 'Unfeatured' : 'Set as featured work', life: 2000 })
}

async function approve() {
  confirm.require({
    message: `Approve ${profile.value?.full_name || 'this member'}?`,
    header: 'Confirm Approval',
    icon: 'pi pi-check-circle',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await approveMembers([id])
      if (result.success) {
        profile.value.status = 'active'
        form.status = 'active'
        toast.add({ severity: 'success', summary: 'Member approved!', life: 2000 })
      }
    },
  })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/members" class="text-slate-500 hover:text-primary-600">
        <i class="pi pi-arrow-left" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">{{ isNew ? 'New Member' : 'Edit Member' }}</h1>
      <MemberStatusBadge v-if="profile && !isNew" :status="profile.status" />
    </div>

    <div v-if="loading" class="bg-white border border-slate-200 rounded-xl h-64 animate-pulse" />

    <!-- Create Mode -->
    <template v-else-if="isNew">
      <form class="space-y-4" @submit.prevent="create">
        <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <InputText v-model="createForm.email" type="email" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <InputText v-model="createForm.full_name" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Graduation Batch</label>
              <Select v-model="createForm.batch_year" :options="batches" option-label="label" option-value="value" placeholder="Select batch" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Student ID</label>
              <InputText v-model="createForm.student_id" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <InputText v-model="createForm.phone" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <InputText v-model="createForm.department" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
              <InputText v-model="createForm.degree" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Current Status</label>
              <Select
                v-model="createForm.current_status"
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
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <InputText v-model="createForm.city" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
              <InputText v-model="createForm.country" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Member Status</label>
              <Select
                v-model="createForm.status"
                :options="[
                  { label: 'Active (Recommended)', value: 'active' },
                  { label: 'Pending', value: 'pending' },
                ]"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
          </div>
          <Message severity="info" :closable="false" class="text-sm">
            An invite email will be sent to the member so they can set their own password.
          </Message>
        </div>

        <div class="flex justify-end">
          <Button type="submit" label="Create Member" icon="pi pi-user-plus" :loading="saving" />
        </div>
      </form>
    </template>

    <template v-else-if="profile">
      <!-- Quick actions for pending -->
      <Message v-if="profile.status === 'pending'" severity="warn" :closable="false">
        This member is awaiting approval.
        <Button label="Approve Now" size="small" severity="success" class="ml-3" @click="approve" />
      </Message>

      <form class="space-y-4" @submit.prevent="save">
        <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Avatar</label>
              <SharedImageUpload
                v-model="form.avatar_url"
                bucket="avatars"
                :path="id"
                aspect-ratio="1/1"
                compact
                placeholder="Avatar"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Cover Photo</label>
              <SharedImageUpload
                v-model="form.cover_photo_url"
                bucket="covers"
                :path="id"
                aspect-ratio="16/9"
                placeholder="Drop a cover photo here"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <InputText v-model="form.full_name" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
            <InputText v-model="form.display_name" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <InputText v-model="form.email" type="email" class="w-full" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Graduation Batch</label>
            <Select v-model="form.batch_year" :options="batches" option-label="label" option-value="value" placeholder="Select batch" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
            <InputText v-model="form.department" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
            <InputText v-model="form.degree" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Current Status</label>
            <Select
              v-model="form.current_status"
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
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
            <InputText v-model="form.city" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
            <InputText v-model="form.country" class="w-full" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <Textarea v-model="form.bio" :rows="3" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <Select
              v-model="form.status"
              :options="[
                { label: 'Pending', value: 'pending' },
                { label: 'Active', value: 'active' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Rejected', value: 'rejected' },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          </div>
        </div>

        <div class="flex justify-end">
          <Button type="submit" label="Save Changes" icon="pi pi-save" :loading="saving" />
        </div>
      </form>

      <!-- Education Records -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-slate-900">Education History</h2>
          <button v-if="!showEduForm" type="button" class="text-xs font-medium text-primary-600 hover:text-primary-500" @click="showEduForm = true">+ Add</button>
        </div>

        <div v-if="showEduForm" class="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Institution *</label>
              <InputText v-model="eduForm.institution" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
              <InputText v-model="eduForm.degree" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Field of Study</label>
              <InputText v-model="eduForm.field_of_study" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Start Year</label>
              <InputText v-model="eduForm.start_year" type="number" class="w-full" />
            </div>
            <div v-if="!eduForm.is_current">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">End Year</label>
              <InputText v-model="eduForm.end_year" type="number" class="w-full" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Institution URL</label>
              <InputText v-model="eduForm.url" class="w-full" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="eduForm.is_current" />
            <span class="text-sm text-slate-600">Currently studying here</span>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg" @click="resetEduForm">Cancel</button>
            <button type="button" class="px-4 py-1.5 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-500 active:scale-95 transition-all" @click="saveEdu">Save</button>
          </div>
        </div>

        <div v-for="edu in educationRecords" :key="edu.id" class="group flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-graduation-cap text-primary-600 text-sm" />
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ edu.institution }}</p>
              <p v-if="edu.degree || edu.field_of_study" class="text-xs text-slate-500">{{ [edu.degree, edu.field_of_study].filter(Boolean).join(' · ') }}</p>
              <p v-if="edu.start_year" class="text-xs text-slate-400">{{ edu.start_year }}{{ edu.end_year ? ` – ${edu.end_year}` : edu.is_current ? ' – Present' : '' }}</p>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" class="p-1.5 rounded-lg transition-colors" :class="edu.is_featured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'" @click="toggleFeaturedEdu(edu)"><i :class="edu.is_featured ? 'pi pi-star-fill' : 'pi pi-star'" class="text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg" @click="editEdu(edu)"><i class="pi pi-pencil text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg" @click="removeEdu(edu.id)"><i class="pi pi-trash text-xs" /></button>
          </div>
        </div>
        <p v-if="!educationRecords.length && !showEduForm" class="text-sm text-slate-400 text-center py-3">No education records</p>
      </div>

      <!-- Work Experience -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-slate-900">Work Experience</h2>
          <button v-if="!showWorkForm" type="button" class="text-xs font-medium text-primary-600 hover:text-primary-500" @click="showWorkForm = true">+ Add</button>
        </div>

        <div v-if="showWorkForm" class="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>
              <InputText v-model="workForm.company" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
              <InputText v-model="workForm.job_title" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <InputText v-model="workForm.location" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
              <InputText v-model="workForm.industry" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
              <InputText v-model="workForm.start_date" type="date" class="w-full" />
            </div>
            <div v-if="!workForm.is_current">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
              <InputText v-model="workForm.end_date" type="date" class="w-full" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Company URL</label>
              <InputText v-model="workForm.url" class="w-full" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="workForm.is_current" />
            <span class="text-sm text-slate-600">Currently working here</span>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg" @click="resetWorkForm">Cancel</button>
            <button type="button" class="px-4 py-1.5 text-sm font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-500 active:scale-95 transition-all" @click="saveWork">Save</button>
          </div>
        </div>

        <div v-for="work in workRecords" :key="work.id" class="group flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <i class="pi pi-briefcase text-slate-500 text-sm" />
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ work.job_title }}</p>
              <p class="text-xs text-slate-500">{{ work.company }}<span v-if="work.location" class="text-slate-400"> · {{ work.location }}</span></p>
              <p v-if="work.start_date" class="text-xs text-slate-400">{{ new Date(work.start_date).getFullYear() }}{{ work.end_date ? ` – ${new Date(work.end_date).getFullYear()}` : work.is_current ? ' – Present' : '' }}</p>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" class="p-1.5 rounded-lg transition-colors" :class="work.is_featured ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'" @click="toggleFeaturedWork(work)"><i :class="work.is_featured ? 'pi pi-star-fill' : 'pi pi-star'" class="text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg" @click="editWork(work)"><i class="pi pi-pencil text-xs" /></button>
            <button type="button" class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg" @click="removeWork(work.id)"><i class="pi pi-trash text-xs" /></button>
          </div>
        </div>
        <p v-if="!workRecords.length && !showWorkForm" class="text-sm text-slate-400 text-center py-3">No work experience</p>
      </div>

      <!-- Social Links (read-only) -->
      <div v-if="socialLinks.length" class="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h2 class="font-semibold text-slate-900">Social Links</h2>
        <div v-for="link in socialLinks" :key="link.id" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :style="`background: ${socialPlatforms.find(p => p.slug === link.platform_slug)?.color || '#666'}15;`">
            <i :class="socialPlatforms.find(p => p.slug === link.platform_slug)?.icon || 'pi pi-link'" class="text-sm" :style="`color: ${socialPlatforms.find(p => p.slug === link.platform_slug)?.color || '#666'};`" />
          </div>
          <a :href="link.url" target="_blank" class="text-sm text-primary-600 hover:underline truncate">{{ link.url }}</a>
        </div>
      </div>
    </template>
  </div>
</template>
