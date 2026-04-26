<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Jobs | Admin', robots: 'noindex' })

const { fetchAllForAdmin, deleteJob, totalCount } = useJobs()
const toast = useToast()
const confirm = useConfirm()

const jobs = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(25)
const pageSizeOptions = [{ label: '10', value: 10 }, { label: '20', value: 20 }, { label: '25', value: 25 }, { label: '30', value: 30 }]

async function load() {
  loading.value = true
  jobs.value = await fetchAllForAdmin({ search: search.value || undefined, page: currentPage.value, perPage: pageSize.value })
  loading.value = false
}

onMounted(load)

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
        await load()
      }
    },
  })
}

const statusSeverity: Record<string, string> = { published: 'success', draft: 'secondary', closed: 'danger', archived: 'warn' }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-xl font-bold text-slate-900">Jobs</h1>
      <NuxtLink to="/admin/jobs/new">
        <Button label="New Job" icon="pi pi-plus" size="small" />
      </NuxtLink>
    </div>

    <InputText v-model="search" placeholder="Search jobs..." class="max-w-sm" @input="onSearch" />

    <div v-if="!loading && jobs.length === 0" class="bg-white border border-slate-200 rounded-xl text-center py-16 px-8">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 mx-auto mb-4 flex items-center justify-center">
        <i class="pi pi-briefcase text-2xl text-slate-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">No jobs found</h3>
      <p class="text-sm text-slate-500">{{ search ? 'Try a different search term.' : 'Post your first job to get started.' }}</p>
    </div>

    <template v-else>
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <DataTable :value="jobs" :loading="loading" data-key="id" class="text-sm">
          <Column field="title" header="Title">
            <template #body="{ data }">
              <NuxtLink :to="`/admin/jobs/${data.id}`" class="font-medium text-slate-900 hover:text-primary-600">
                {{ data.title }}
              </NuxtLink>
            </template>
          </Column>
          <Column field="company" header="Company" />
          <Column field="job_type" header="Type" />
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="statusSeverity[data.status] || 'secondary'" />
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
