<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Jobs | Admin', robots: 'noindex' })

const { fetchAllForAdmin, deleteJob, totalCount, fetchPendingReviewCount } = useJobs()
const supabase = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

const jobs = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(25)
const pageSizeOptions = [{ label: '10', value: 10 }, { label: '20', value: 20 }, { label: '25', value: 25 }, { label: '30', value: 30 }]
const activeTab = ref<string | null>(null)
const pendingCount = ref(0)

const tabs = computed(() => [
  { label: 'All', value: null },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  {
    label: pendingCount.value > 0 ? `Pending Review (${pendingCount.value})` : 'Pending Review',
    value: 'pending_review',
    highlight: pendingCount.value > 0,
  },
  { label: 'Closed', value: 'closed' },
  { label: 'Archived', value: 'archived' },
])

async function load() {
  loading.value = true
  jobs.value = await fetchAllForAdmin({
    search: search.value || undefined,
    status: activeTab.value || undefined,
    page: currentPage.value,
    perPage: pageSize.value,
  })
  loading.value = false
}

async function loadCounts() {
  pendingCount.value = await fetchPendingReviewCount()
}

const route = useRoute()

watch(() => route.query.status, (status) => {
  const qs = (status as string | undefined) || null
  if (qs !== activeTab.value) {
    activeTab.value = qs
    currentPage.value = 1
    load()
  }
})

onMounted(async () => {
  const qs = route.query.status as string | undefined
  if (qs && tabs.value.some(t => t.value === qs))
    activeTab.value = qs
  await Promise.all([load(), loadCounts()])
})

function switchTab(value: string | null) {
  activeTab.value = value
  currentPage.value = 1
  load()
}

const debounce = ref<ReturnType<typeof setTimeout>>()
function onSearch() {
  clearTimeout(debounce.value)
  debounce.value = setTimeout(() => {
    currentPage.value = 1
    load()
  }, 300)
}

function handleDelete(id: number, title: string) {
  confirm.require({
    message: `Delete "${title}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-trash',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await deleteJob(id)
      if (result.success) {
        toast.add({ severity: 'success', summary: 'Job deleted', life: 2000 })
        await Promise.all([load(), loadCounts()])
      }
    },
  })
}

const statusSeverity: Record<string, string> = {
  published: 'success',
  draft: 'secondary',
  closed: 'danger',
  archived: 'warn',
  pending_review: 'warn',
}

const jobTypeLabel: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
}

const statusLabel: Record<string, string> = {
  pending_review: 'Pending Review',
}

// View modal
const viewVisible = ref(false)
const selectedJob = ref<any>(null)
const submitter = ref<{ full_name: string, email: string, batch_year: number | null } | null>(null)
const submitterLoading = ref(false)

async function openView(job: any) {
  selectedJob.value = job
  submitter.value = null
  viewVisible.value = true

  if (job.alumni_posted && job.posted_by) {
    submitterLoading.value = true
    const { data } = await supabase
      .from('alumni_profiles')
      .select('full_name, email, batch_year')
      .eq('id', job.posted_by)
      .single()
    submitter.value = data || null
    submitterLoading.value = false
  }
}

function formatSalary(job: any) {
  if (!job.is_salary_visible || (!job.salary_min && !job.salary_max)) return null
  const currency = job.salary_currency || 'USD'
  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v)
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}`
  if (job.salary_min) return `From ${fmt(job.salary_min)}`
  return `Up to ${fmt(job.salary_max)}`
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-xl font-bold text-slate-900">Jobs</h1>
      <NuxtLink to="/admin/jobs/new">
        <Button label="New Job" icon="pi pi-plus" size="small" />
      </NuxtLink>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-1 border-b border-slate-200 pb-0">
      <button
        v-for="tab in tabs"
        :key="String(tab.value)"
        class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative"
        :class="activeTab === tab.value
          ? 'text-primary-600 border-b-2 border-primary-600 -mb-px bg-white'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
        <span
          v-if="tab.highlight"
          class="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"
        />
      </button>
    </div>

    <InputText v-model="search" placeholder="Search jobs..." class="max-w-sm" @input="onSearch" />

    <div v-if="!loading && jobs.length === 0" class="bg-white border border-slate-200 rounded-xl text-center py-16 px-8">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 mx-auto mb-4 flex items-center justify-center">
        <i class="pi pi-briefcase text-2xl text-slate-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">No jobs found</h3>
      <p class="text-sm text-slate-500">
        {{ activeTab === 'pending_review' ? 'No submissions awaiting review.' : search ? 'Try a different search term.' : 'Post your first job to get started.' }}
      </p>
    </div>

    <template v-else>
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <DataTable :value="jobs" :loading="loading" data-key="id" class="text-sm">
          <Column field="title" header="Title">
            <template #body="{ data }">
              <NuxtLink :to="`/admin/jobs/${data.id}`" class="font-medium text-slate-900 hover:text-primary-600">
                {{ data.title }}
              </NuxtLink>
              <span v-if="data.alumni_posted" class="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Alumni
              </span>
            </template>
          </Column>
          <Column field="company" header="Company" />
          <Column field="job_type" header="Type">
            <template #body="{ data }">
              {{ jobTypeLabel[data.job_type] ?? data.job_type }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag
                :value="statusLabel[data.status] || data.status"
                :severity="statusSeverity[data.status] || 'secondary'"
              />
            </template>
          </Column>
          <Column field="view_count" header="Views" />
          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex gap-1">
                <Button icon="pi pi-eye" size="small" text severity="secondary" @click="openView(data)" />
                <NuxtLink :to="`/admin/jobs/${data.id}`">
                  <Button icon="pi pi-pencil" size="small" text />
                </NuxtLink>
                <Button icon="pi pi-trash" size="small" text severity="danger" @click="handleDelete(data.id, data.title)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div v-if="totalCount > pageSize" class="flex items-center justify-between pt-2">
        <p class="text-sm text-slate-500">
          Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, totalCount) }} of {{ totalCount }}
        </p>
        <div class="flex items-center gap-3">
          <Select v-model="pageSize" :options="pageSizeOptions" option-label="label" option-value="value" class="w-20" @change="currentPage = 1; load()" />
          <Button label="Previous" icon="pi pi-chevron-left" size="small" text :disabled="currentPage <= 1" @click="currentPage--; load()" />
          <Button label="Next" icon-pos="right" icon="pi pi-chevron-right" size="small" text :disabled="currentPage * pageSize >= totalCount" @click="currentPage++; load()" />
        </div>
      </div>
    </template>
  </div>

  <!-- View Job Modal -->
  <Dialog
    v-model:visible="viewVisible"
    modal
    :header="selectedJob?.title || 'Job Details'"
    class="w-full max-w-3xl"
    :pt="{ root: { class: 'mx-4' } }"
  >
    <template v-if="selectedJob">
      <!-- ── Hero header ─────────────────────────────────────────── -->
      <div class="-mx-6 -mt-3 mb-6 px-6 pt-5 pb-6 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
        <div class="flex items-start gap-4">
          <!-- Logo -->
          <div class="w-16 h-16 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center bg-white border border-slate-200 shadow-sm">
            <img v-if="selectedJob.company_logo_url" :src="selectedJob.company_logo_url" :alt="selectedJob.company" class="w-full h-full object-contain p-1" />
            <i v-else class="pi pi-briefcase text-slate-300 text-2xl" />
          </div>
          <!-- Title & badges -->
          <div class="min-w-0 flex-1">
            <p class="font-bold text-slate-900 text-xl leading-tight tracking-tight">{{ selectedJob.title }}</p>
            <p class="text-slate-500 text-sm mt-0.5 font-medium">
              {{ selectedJob.company }}
              <span v-if="selectedJob.company_website">
                · <a :href="selectedJob.company_website" target="_blank" class="text-primary-500 hover:text-primary-700 transition-colors">Website ↗</a>
              </span>
            </p>
            <div class="flex flex-wrap items-center gap-1.5 mt-3">
              <span
                class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                :class="{
                  'bg-green-100 text-green-700 ring-1 ring-green-200': selectedJob.status === 'published',
                  'bg-slate-200 text-slate-600': selectedJob.status === 'draft',
                  'bg-red-100 text-red-700 ring-1 ring-red-200': selectedJob.status === 'closed',
                  'bg-amber-100 text-amber-700 ring-1 ring-amber-200': selectedJob.status === 'archived' || selectedJob.status === 'pending_review',
                }"
              >
                {{ statusLabel[selectedJob.status] || selectedJob.status }}
              </span>
              <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm">
                {{ jobTypeLabel[selectedJob.job_type] ?? selectedJob.job_type }}
              </span>
              <span v-if="selectedJob.is_remote" class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                <i class="pi pi-globe text-[10px]" /> Remote
              </span>
              <span v-if="selectedJob.alumni_posted" class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 border border-teal-300 text-teal-700">
                <i class="pi pi-user text-[10px]" /> Alumni
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Info chips ──────────────────────────────────────────── -->
      <div class="flex flex-wrap gap-2 mb-6">
        <div v-if="selectedJob.location" class="inline-flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <i class="pi pi-map-marker text-slate-400 text-xs" />
          {{ selectedJob.location }}
        </div>
        <div v-if="formatSalary(selectedJob)" class="inline-flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
          <i class="pi pi-dollar text-emerald-400 text-xs" />
          {{ formatSalary(selectedJob) }}
        </div>
        <div v-if="selectedJob.category?.name" class="inline-flex items-center gap-1.5 text-sm text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5">
          <i class="pi pi-tag text-violet-400 text-xs" />
          {{ selectedJob.category.name }}
        </div>
        <div v-if="selectedJob.application_deadline" class="inline-flex items-center gap-1.5 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
          <i class="pi pi-calendar text-orange-400 text-xs" />
          Deadline: {{ new Date(selectedJob.application_deadline).toLocaleDateString() }}
        </div>
      </div>

      <!-- ── Apply info ──────────────────────────────────────────── -->
      <div v-if="selectedJob.apply_url || selectedJob.apply_email" class="mb-6 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 space-y-2">
        <p class="text-[11px] font-semibold uppercase tracking-widest text-primary-400 mb-1">How to Apply</p>
        <div v-if="selectedJob.apply_url" class="flex items-center gap-2 text-sm">
          <i class="pi pi-link text-primary-400 text-xs shrink-0" />
          <a :href="selectedJob.apply_url" target="_blank" class="text-primary-600 hover:text-primary-800 hover:underline truncate font-medium transition-colors">{{ selectedJob.apply_url }}</a>
        </div>
        <div v-if="selectedJob.apply_email" class="flex items-center gap-2 text-sm">
          <i class="pi pi-envelope text-primary-400 text-xs shrink-0" />
          <span class="text-primary-700 font-medium">{{ selectedJob.apply_email }}</span>
        </div>
      </div>

      <!-- ── Content sections ───────────────────────────────────── -->
      <div class="space-y-4">
        <!-- Description -->
        <div v-if="selectedJob.description" class="rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <div class="w-1.5 h-4 rounded-full bg-primary-500" />
            <h4 class="text-xs font-semibold uppercase tracking-widest text-slate-500">Description</h4>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="px-4 py-4 prose prose-sm max-w-none text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:font-semibold [&_h3]:text-slate-900 max-h-52 overflow-y-auto" v-html="selectedJob.description" />
        </div>

        <!-- Requirements -->
        <div v-if="selectedJob.requirements" class="rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <div class="w-1.5 h-4 rounded-full bg-amber-500" />
            <h4 class="text-xs font-semibold uppercase tracking-widest text-slate-500">Requirements</h4>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="px-4 py-4 prose prose-sm max-w-none text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 max-h-44 overflow-y-auto" v-html="selectedJob.requirements" />
        </div>

        <!-- Benefits -->
        <div v-if="selectedJob.benefits" class="rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <div class="w-1.5 h-4 rounded-full bg-emerald-500" />
            <h4 class="text-xs font-semibold uppercase tracking-widest text-slate-500">Benefits</h4>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="px-4 py-4 prose prose-sm max-w-none text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2 max-h-36 overflow-y-auto" v-html="selectedJob.benefits" />
        </div>
      </div>

      <!-- ── Alumni Submitter ───────────────────────────────────── -->
      <div v-if="selectedJob.alumni_posted" class="mt-6">
        <div class="flex items-center gap-2 mb-3">
          <div class="h-px flex-1 bg-slate-200" />
          <span class="text-[11px] font-semibold uppercase tracking-widest text-slate-400 px-2">Submitted by Alumni</span>
          <div class="h-px flex-1 bg-slate-200" />
        </div>

        <!-- Skeleton -->
        <div v-if="submitterLoading" class="flex items-center gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 animate-pulse">
          <div class="w-12 h-12 rounded-full bg-teal-200 shrink-0" />
          <div class="space-y-2 flex-1">
            <div class="h-3.5 bg-teal-200 rounded-lg w-36" />
            <div class="h-3 bg-teal-100 rounded-lg w-52" />
          </div>
        </div>

        <!-- Submitter card -->
        <div v-else-if="submitter" class="flex items-center gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-teal-200">
            <span class="text-white font-bold text-base">{{ submitter.full_name?.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-900 text-sm">{{ submitter.full_name }}</p>
            <p class="text-xs text-slate-500 mt-0.5 truncate">{{ submitter.email }}</p>
            <p v-if="submitter.batch_year" class="text-xs font-medium text-teal-600 mt-0.5">Class of {{ submitter.batch_year }}</p>
          </div>
          <NuxtLink
            :to="`/admin/members/${selectedJob.posted_by}`"
            class="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-200 hover:bg-teal-600 hover:text-white hover:border-teal-600 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm"
            @click="viewVisible = false"
          >
            <i class="pi pi-user text-[10px]" /> View Profile
          </NuxtLink>
        </div>

        <p v-else class="text-sm text-center text-slate-400 italic py-3">Submitter profile not found.</p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <NuxtLink :to="`/admin/jobs/${selectedJob?.id}`" @click="viewVisible = false">
          <Button label="Edit Job" icon="pi pi-pencil" size="small" />
        </NuxtLink>
        <Button label="Close" size="small" severity="secondary" text @click="viewVisible = false" />
      </div>
    </template>
  </Dialog>
</template>
