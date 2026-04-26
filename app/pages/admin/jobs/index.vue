<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Jobs | Admin', robots: 'noindex' })

const { fetchAllForAdmin, deleteJob } = useJobs()
const toast = useToast()
const confirm = useConfirm()

const jobs = ref<any[]>([])
const loading = ref(false)
const search = ref('')

async function load() {
  loading.value = true
  jobs.value = await fetchAllForAdmin({ search: search.value || undefined })
  loading.value = false
}

onMounted(load)

const debounce = ref<ReturnType<typeof setTimeout>>()
function onSearch() {
  clearTimeout(debounce.value)
  debounce.value = setTimeout(load, 300)
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
  </div>
</template>
