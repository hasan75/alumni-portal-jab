<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Staff | Admin', robots: 'noindex' })

const { fetchAllForAdmin, deleteStaffMember, totalCount } = useStaff()
const toast = useToast()
const confirm = useConfirm()

const staff = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref('')
const designationFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(25)
const pageSizeOptions = [{ label: '10', value: 10 }, { label: '20', value: 20 }, { label: '25', value: 25 }, { label: '30', value: 30 }]

const designationOptions = [
  { label: 'All Designations', value: '' },
  { label: 'Headmaster', value: 'headmaster' },
  { label: 'Asst. Headmaster', value: 'assistant_headmaster' },
  { label: 'Senior Teacher', value: 'senior_teacher' },
  { label: 'Asst. Teacher', value: 'assistant_teacher' },
  { label: 'PT Teacher', value: 'physical_education_teacher' },
  { label: 'Librarian', value: 'librarian' },
  { label: 'Office Assistant', value: 'office_assistant' },
  { label: 'Night Guard', value: 'night_guard' },
  { label: 'Peon / Attendant', value: 'peon' },
]

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Current', value: 'current' },
  { label: 'Left Job', value: 'left' },
  { label: 'Retired', value: 'retired' },
  { label: 'Deceased', value: 'deceased' },
]

async function load() {
  loading.value = true
  staff.value = await fetchAllForAdmin({
    search: search.value || undefined,
    status: statusFilter.value || undefined,
    designation: designationFilter.value || undefined,
    page: currentPage.value,
    perPage: pageSize.value,
  })
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

function onFilterChange() {
  currentPage.value = 1
  load()
}

function handleDelete(id: number, name: string) {
  confirm.require({
    message: `Delete "${name}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-trash',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await deleteStaffMember(id)
      if (result.success) {
        toast.add({ severity: 'success', summary: 'Staff member deleted', life: 2000 })
        await load()
      }
    },
  })
}

const statusSeverity: Record<string, string> = { current: 'success', retired: 'warn', left: 'secondary', deceased: 'danger' }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-xl font-bold text-slate-900">Staff</h1>
      <NuxtLink to="/admin/staff/new">
        <Button label="Add Staff" icon="pi pi-plus" size="small" />
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3 flex-wrap">
      <InputText v-model="search" placeholder="Search by name..." class="max-w-xs" @input="onSearch" />
      <Select v-model="designationFilter" :options="designationOptions" option-label="label" option-value="value" placeholder="Designation" class="w-48" @change="onFilterChange" />
      <Select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value" placeholder="Status" class="w-36" @change="onFilterChange" />
    </div>

    <div v-if="!loading && staff.length === 0" class="bg-white border border-slate-200 rounded-xl text-center py-16 px-8">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 mx-auto mb-4 flex items-center justify-center">
        <i class="pi pi-id-card text-2xl text-slate-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">No staff found</h3>
      <p class="text-sm text-slate-500">{{ search ? 'Try a different search term.' : 'Add your first staff member to get started.' }}</p>
    </div>

    <template v-else>
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <DataTable :value="staff" :loading="loading" data-key="id" class="text-sm">
          <Column header="Photo" style="width: 60px">
            <template #body="{ data }">
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
                <img v-if="data.photo_url" :src="data.photo_url" :alt="data.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center avatar-gradient text-white font-bold text-sm">
                  {{ data.name.charAt(0) }}
                </div>
              </div>
            </template>
          </Column>
          <Column field="name" header="Name">
            <template #body="{ data }">
              <NuxtLink :to="`/admin/staff/${data.id}`" class="font-medium text-slate-900 hover:text-primary-600">
                {{ data.name }}
              </NuxtLink>
            </template>
          </Column>
          <Column field="designation" header="Designation">
            <template #body="{ data }">
              {{ formatDesignation(data.designation) }}
            </template>
          </Column>
          <Column field="subject" header="Subject" />
          <Column field="employment_status" header="Status">
            <template #body="{ data }">
              <Tag :value="formatEmploymentStatus(data.employment_status)" :severity="statusSeverity[data.employment_status] || 'secondary'" />
            </template>
          </Column>
          <Column field="sort_order" header="Order" style="width: 70px" />
          <Column header="Actions" style="width: 90px">
            <template #body="{ data }">
              <div class="flex gap-1">
                <NuxtLink :to="`/admin/staff/${data.id}`">
                  <Button icon="pi pi-pencil" size="small" text />
                </NuxtLink>
                <Button icon="pi pi-trash" size="small" text severity="danger" @click="handleDelete(data.id, data.name)" />
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
