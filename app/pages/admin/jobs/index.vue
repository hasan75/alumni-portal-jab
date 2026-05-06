<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Jobs | Admin', robots: 'noindex' })

const { fetchAllForAdmin, deleteJob, totalCount, fetchPendingReviewCount } = useJobs()
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

onMounted(async () => {
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

const statusLabel: Record<string, string> = {
  pending_review: 'Pending Review',
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
          <Column field="job_type" header="Type" />
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
</template>
