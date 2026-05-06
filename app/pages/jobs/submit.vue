<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import type { JobType } from '~/types/job'
import { extractStorageImagesFromHtml, deleteOrphanedImages } from '~/utils/htmlContent'

definePageMeta({ layout: 'member', middleware: 'member-auth' })
useSeoMeta({ title: 'Post a Job | JAB Alumni' })

const { submitJob, fetchMySubmissions, withdrawSubmission, fetchCategories } = useJobs()
const toast = useToast()
const confirm = useConfirm()

// ── Form state ────────────────────────────────────────────────────────────────
const submitting = ref(false)

const form = reactive({
  title: '',
  company: '',
  company_logo_url: null as string | null,
  cover_image_url: null as string | null,
  company_website: '' as string | null,
  category_id: null as number | null,
  description: '',
  requirements: '' as string | null,
  location: '' as string | null,
  is_remote: false,
  job_type: '' as JobType | '',
  salary_min: null as number | null,
  salary_max: null as number | null,
  salary_currency: 'BDT',
  is_salary_visible: true,
  apply_url: '' as string | null,
  apply_email: '' as string | null,
  application_deadline: null as Date | null,
  additional_photos: [] as string[],
})

// Track images embedded in the RTEs for orphan cleanup after submit
const initialDescImages = ref<string[]>([])
const initialReqImages = ref<string[]>([])

function resetForm() {
  form.title = ''
  form.company = ''
  form.company_logo_url = null
  form.cover_image_url = null
  form.company_website = ''
  form.category_id = null
  form.description = ''
  form.requirements = ''
  form.location = ''
  form.is_remote = false
  form.job_type = ''
  form.salary_min = null
  form.salary_max = null
  form.salary_currency = 'BDT'
  form.is_salary_visible = true
  form.apply_url = ''
  form.apply_email = ''
  form.application_deadline = null
  form.additional_photos = []
  initialDescImages.value = []
  initialReqImages.value = []
}

// ── Static option lists ────────────────────────────────────────────────────────
const jobTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
]

const currencyOptions = [
  { label: 'BDT (৳)', value: 'BDT' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
]

// ── Categories ────────────────────────────────────────────────────────────────
const categoryOptions = ref<{ label: string, value: number }[]>([])

onMounted(async () => {
  const cats = await fetchCategories()
  categoryOptions.value = cats.map(c => ({ label: c.name, value: c.id }))
  await loadMySubmissions()
})

// ── Submit handler ────────────────────────────────────────────────────────────
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

async function handleSubmit() {
  if (!form.title.trim()) {
    toast.add({ severity: 'warn', summary: 'Job title is required', life: 3000 })
    return
  }
  if (!form.company.trim()) {
    toast.add({ severity: 'warn', summary: 'Company name is required', life: 3000 })
    return
  }
  if (!form.job_type) {
    toast.add({ severity: 'warn', summary: 'Please select a job type', life: 3000 })
    return
  }
  if (!stripHtml(form.description)) {
    toast.add({ severity: 'warn', summary: 'Job description is required', life: 3000 })
    return
  }

  submitting.value = true

  const deadlineStr = form.application_deadline
    ? (form.application_deadline as Date).toISOString().split('T')[0]
    : null

  const payload = {
    title: form.title.trim(),
    company: form.company.trim(),
    company_logo_url: form.company_logo_url || null,
    cover_image_url: form.cover_image_url || null,
    company_website: form.company_website?.trim() || null,
    category_id: form.category_id,
    description: form.description,
    requirements: form.requirements || null,
    location: form.location?.trim() || null,
    is_remote: form.is_remote,
    job_type: form.job_type as JobType,
    salary_min: form.salary_min,
    salary_max: form.salary_max,
    salary_currency: form.salary_currency,
    is_salary_visible: form.is_salary_visible,
    apply_url: form.apply_url?.trim() || null,
    apply_email: form.apply_email?.trim() || null,
    application_deadline: deadlineStr,
    additional_photos: form.additional_photos,
  }

  const result = await submitJob(payload)

  if (result.success) {
    // Clean up any images that were uploaded to the RTE but removed before submit
    const currentDescImages = extractStorageImagesFromHtml(form.description, 'jobs')
    const currentReqImages = extractStorageImagesFromHtml(form.requirements || '', 'jobs')
    await deleteOrphanedImages(initialDescImages.value, currentDescImages, 'jobs')
    await deleteOrphanedImages(initialReqImages.value, currentReqImages, 'jobs')

    toast.add({
      severity: 'success',
      summary: 'Job submitted for review',
      detail: 'Our admins will review it shortly and publish it on the board.',
      life: 5000,
    })
    resetForm()
    await loadMySubmissions()
  }
  else {
    toast.add({
      severity: 'error',
      summary: 'Submission failed',
      detail: result.error || 'Something went wrong. Please try again.',
      life: 5000,
    })
  }

  submitting.value = false
}

// ── My Submissions ────────────────────────────────────────────────────────────
const mySubmissions = ref<Awaited<ReturnType<typeof fetchMySubmissions>>>([])
const loadingSubmissions = ref(false)

async function loadMySubmissions() {
  loadingSubmissions.value = true
  mySubmissions.value = await fetchMySubmissions()
  loadingSubmissions.value = false
}

function handleWithdraw(id: number, title: string) {
  confirm.require({
    message: `Are you sure you want to withdraw "${title}"? This cannot be undone.`,
    header: 'Withdraw Submission',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Withdraw', severity: 'danger' },
    accept: async () => {
      const result = await withdrawSubmission(id)
      if (result.success) {
        toast.add({ severity: 'success', summary: 'Submission withdrawn', life: 3000 })
        await loadMySubmissions()
      }
      else {
        toast.add({ severity: 'error', summary: 'Failed to withdraw', detail: result.error, life: 4000 })
      }
    },
  })
}

// ── Status badge helpers ──────────────────────────────────────────────────────
function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_review: 'Pending Review',
    published: 'Published',
    draft: 'Draft',
    closed: 'Closed',
    archived: 'Archived',
  }
  return map[status] ?? status
}

function statusClasses(status: string): string {
  switch (status) {
    case 'pending_review': return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'published':      return 'bg-green-50 text-green-700 border border-green-200'
    case 'closed':         return 'bg-slate-100 text-slate-600 border border-slate-200'
    case 'archived':       return 'bg-slate-100 text-slate-500 border border-slate-200'
    case 'draft':          return 'bg-gray-100 text-gray-500 border border-gray-200'
    default:               return 'bg-gray-100 text-gray-500 border border-gray-200'
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-10">

    <!-- ── Page header ──────────────────────────────────────────────────────── -->
    <div class="animate-fade-in-up">
      <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-1">Opportunities</p>
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Post a Job</h1>
      <p class="text-slate-500 text-sm mt-1.5 max-w-xl">
        Share an opportunity with your alumni community. Submissions go through a quick admin review before appearing on the job board.
      </p>
    </div>

    <!-- ── Submission form ──────────────────────────────────────────────────── -->
    <form class="space-y-6" @submit.prevent="handleSubmit">

      <!-- Role & Company -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-1">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center gap-3 pb-1 border-b border-slate-200/60">
          <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <i class="pi pi-briefcase text-primary-600 text-sm" />
          </div>
          <h2 class="font-semibold text-slate-900">Role &amp; Company</h2>
        </div>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Job title — full width -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Job Title <span class="text-red-500">*</span></label>
            <InputText v-model="form.title" class="w-full" placeholder="e.g. Senior Software Engineer" />
          </div>

          <!-- Company name + logo upload side by side -->
          <div class="flex gap-3 sm:col-span-2">
            <div class="flex-1 min-w-0">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Company <span class="text-red-500">*</span></label>
              <InputText v-model="form.company" class="w-full" placeholder="e.g. Grameenphone" />
            </div>
            <div class="shrink-0">
              <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Logo</label>
              <SharedImageUpload
                v-model="form.company_logo_url"
                bucket="jobs"
                path="new"
                aspect-ratio="1/1"
                compact
                placeholder="Logo"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Company Website</label>
            <InputText v-model="form.company_website" class="w-full" placeholder="https://company.com" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Job Type <span class="text-red-500">*</span></label>
            <Select
              v-model="form.job_type"
              :options="jobTypeOptions"
              option-label="label"
              option-value="value"
              placeholder="Select type"
              class="w-full"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Category</label>
            <Select
              v-model="form.category_id"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              placeholder="Select category"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Cover Image -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-2">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center gap-3 pb-1 border-b border-slate-200/60">
          <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <i class="pi pi-image text-primary-600 text-sm" />
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Cover Image</h2>
            <p class="text-xs text-slate-400 mt-0.5">Optional banner shown on the job listing</p>
          </div>
        </div>

        <div class="relative">
          <SharedImageUpload
            v-model="form.cover_image_url"
            bucket="jobs"
            path="new"
            aspect-ratio="3/1"
            placeholder="Click or drag to upload a cover image"
          />
        </div>
      </div>

      <!-- Additional Photos -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-2">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center gap-3 pb-1 border-b border-slate-200/60">
          <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <i class="pi pi-images text-primary-600 text-sm" />
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Additional Photos</h2>
            <p class="text-xs text-slate-400 mt-0.5">Up to 8 photos shown in the job detail gallery (optional)</p>
          </div>
        </div>

        <div class="relative">
          <SharedMultiPhotoUpload
            v-model="form.additional_photos"
            bucket="jobs"
            path="new"
          />
        </div>
      </div>

      <!-- Description & Requirements -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-3">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center gap-3 pb-1 border-b border-slate-200/60">
          <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <i class="pi pi-align-left text-primary-600 text-sm" />
          </div>
          <h2 class="font-semibold text-slate-900">Description</h2>
        </div>

        <div class="relative space-y-5">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Job Description <span class="text-red-500">*</span></label>
            <SharedRichTextEditor
              id="job-description"
              v-model="form.description"
              :height="400"
              :allow-images="false"
              bucket="jobs"
              storage-path="new"
              placeholder="Describe the role, responsibilities, and what the candidate will be doing day-to-day…"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">
              Requirements
              <span class="text-slate-400 normal-case font-normal tracking-normal ml-1">(optional)</span>
            </label>
            <SharedRichTextEditor
              id="job-requirements"
              v-model="form.requirements"
              :height="320"
              :allow-images="false"
              bucket="jobs"
              storage-path="new"
              placeholder="List required qualifications, skills, or experience…"
            />
          </div>
        </div>
      </div>

      <!-- Location & Remote -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-3">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center gap-3 pb-1 border-b border-slate-200/60">
          <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <i class="pi pi-map-marker text-primary-600 text-sm" />
          </div>
          <h2 class="font-semibold text-slate-900">Location</h2>
        </div>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Location</label>
            <InputText v-model="form.location" class="w-full" placeholder="e.g. Dhaka, Bangladesh" />
          </div>
          <div class="flex items-center gap-3 sm:mt-7">
            <ToggleSwitch v-model="form.is_remote" />
            <div>
              <p class="text-sm font-medium text-slate-700">Remote-friendly</p>
              <p class="text-xs text-slate-400">This role can be done remotely</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Salary -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-4">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center justify-between pb-1 border-b border-slate-200/60">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <i class="pi pi-wallet text-primary-600 text-sm" />
            </div>
            <h2 class="font-semibold text-slate-900">Salary</h2>
          </div>
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.is_salary_visible" />
            <span class="text-xs text-slate-500">{{ form.is_salary_visible ? 'Shown publicly' : 'Hidden' }}</span>
          </div>
        </div>

        <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Currency</label>
            <Select
              v-model="form.salary_currency"
              :options="currencyOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Min Salary</label>
            <InputNumber
              v-model="form.salary_min"
              class="w-full"
              :min="0"
              placeholder="0"
              :use-grouping="true"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Max Salary</label>
            <InputNumber
              v-model="form.salary_max"
              class="w-full"
              :min="0"
              placeholder="0"
              :use-grouping="true"
            />
          </div>
        </div>
      </div>

      <!-- Application Details -->
      <div class="glass-light relative overflow-hidden p-6 space-y-5 animate-fade-in-up delay-4">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

        <div class="relative flex items-center gap-3 pb-1 border-b border-slate-200/60">
          <div class="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <i class="pi pi-send text-primary-600 text-sm" />
          </div>
          <h2 class="font-semibold text-slate-900">Application Details</h2>
        </div>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Apply URL</label>
            <InputText v-model="form.apply_url" class="w-full" placeholder="https://company.com/apply" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Apply Email</label>
            <InputText v-model="form.apply_email" class="w-full" placeholder="hr@company.com" />
          </div>
          <div>
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Application Deadline</label>
            <DatePicker
              v-model="form.application_deadline"
              class="w-full"
              placeholder="Select date"
              date-format="dd M yy"
              :min-date="new Date()"
              show-icon
              icon-display="input"
            />
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <div class="flex justify-end animate-fade-in-up delay-4">
        <Button
          type="submit"
          :loading="submitting"
          :disabled="submitting"
          class="inline-flex items-center gap-2 px-7 py-3 font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-sm shadow-primary-600/30 disabled:opacity-60"
          :pt="{ root: { class: 'border-0 bg-transparent p-0' } }"
        >
          <template #default>
            <i v-if="!submitting" class="pi pi-send" />
            <i v-else class="pi pi-spin pi-spinner" />
            {{ submitting ? 'Submitting…' : 'Submit for Review' }}
          </template>
        </Button>
      </div>
    </form>

    <!-- ── Divider ───────────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-4">
      <div class="flex-1 h-px bg-slate-200" />
      <p class="text-xs font-semibold tracking-widest uppercase text-slate-400">My Submissions</p>
      <div class="flex-1 h-px bg-slate-200" />
    </div>

    <!-- ── My Submissions list ───────────────────────────────────────────────── -->
    <div class="space-y-4 pb-10">

      <!-- Loading skeletons -->
      <template v-if="loadingSubmissions">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-[20px] h-20 animate-pulse bg-white/50 border border-white/60"
        />
      </template>

      <!-- Empty state -->
      <div
        v-else-if="mySubmissions.length === 0"
        class="glass-light relative overflow-hidden text-center py-16 px-8 animate-scale-in"
      >
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <div class="relative">
          <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-slate-100 border border-slate-200 animate-float">
            <i class="pi pi-inbox text-2xl text-slate-400" />
          </div>
          <h3 class="text-base font-semibold text-slate-700 mb-1">No submissions yet</h3>
          <p class="text-sm text-slate-400">Jobs you submit will appear here for tracking.</p>
        </div>
      </div>

      <!-- Submission cards -->
      <template v-else>
        <div
          v-for="(job, idx) in mySubmissions"
          :key="job.id"
          class="glass-light relative overflow-hidden p-4 sm:p-5 animate-fade-in-up hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-out"
          :class="`delay-${Math.min(idx + 1, 6)}`"
        >
          <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

          <!-- Cover image strip -->
          <div v-if="job.cover_image_url" class="relative -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-4 overflow-hidden rounded-t-[18px] h-24">
            <img :src="job.cover_image_url" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </div>

          <div class="relative flex items-start justify-between gap-4">
            <!-- Company logo + job info -->
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl shrink-0 mt-0.5 overflow-hidden flex items-center justify-center bg-primary-50 border border-slate-200">
                <img v-if="job.company_logo_url" :src="job.company_logo_url" :alt="job.company" class="w-full h-full object-contain" />
                <i v-else class="pi pi-briefcase text-primary-600 text-sm" />
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 text-sm leading-snug truncate">{{ job.title }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ job.company }}</p>
                <p class="text-xs text-slate-400 mt-1">Submitted {{ formatDate(job.created_at) }}</p>
              </div>
            </div>

            <!-- Status badge + withdraw -->
            <div class="flex items-center gap-2 shrink-0">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                :class="statusClasses(job.status)"
              >
                {{ statusLabel(job.status) }}
              </span>
              <button
                v-if="job.status === 'pending_review'"
                class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 active:scale-90"
                title="Withdraw submission"
                @click="handleWithdraw(job.id, job.title)"
              >
                <i class="pi pi-trash text-xs" />
              </button>
            </div>
          </div>

          <!-- Tags row -->
          <div class="relative mt-3 flex flex-wrap gap-1.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">
              <i class="pi pi-tag text-[10px]" />
              {{ jobTypeOptions.find(t => t.value === job.job_type)?.label ?? job.job_type }}
            </span>
            <span v-if="job.location || job.is_remote" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">
              <i class="pi pi-map-marker text-[10px]" />
              {{ job.is_remote ? 'Remote' : job.location }}
            </span>
            <span v-if="job.category" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[11px] font-medium">
              {{ job.category.name }}
            </span>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>
