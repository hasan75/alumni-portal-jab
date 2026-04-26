<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import MemberStatusBadge from '~/components/admin/members/MemberStatusBadge.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Members | Admin', robots: 'noindex' })

const route = useRoute()
const { fetchAllForAdmin, approveMembers, rejectMember, suspendMember, fetchPendingCount } = useMembers()
const toast = useToast()
const confirm = useConfirm()

const search = ref('')
const statusFilter = ref((route.query.status as string) || '')
const currentPage = ref(1)
const selectedMembers = ref<any[]>([])

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Rejected', value: 'rejected' },
]

const members = ref<any[]>([])
const totalCount = ref(0)
const loading = ref(false)

async function loadMembers() {
  loading.value = true
  const result = await fetchAllForAdmin({
    search: search.value || undefined,
    status: statusFilter.value || undefined,
    page: currentPage.value,
    perPage: 20,
  })
  members.value = result
  loading.value = false
}

onMounted(loadMembers)

const debounceTimeout = ref<ReturnType<typeof setTimeout>>()
function onSearch() {
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    currentPage.value = 1
    loadMembers()
  }, 300)
}

watch(statusFilter, () => {
  currentPage.value = 1
  loadMembers()
})

async function handleApprove(ids: string[]) {
  const count = ids.length
  confirm.require({
    message: count === 1
      ? 'Approve this member?'
      : `Approve ${count} selected members?`,
    header: 'Confirm Approval',
    icon: 'pi pi-check-circle',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await approveMembers(ids)
      if (result.success) {
        toast.add({ severity: 'success', summary: `${count} member(s) approved`, life: 3000 })
        await loadMembers()
        selectedMembers.value = []
      }
    },
  })
}

async function handleReject(id: string, name: string) {
  confirm.require({
    message: `Reject ${name}'s application?`,
    header: 'Confirm Rejection',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await rejectMember(id)
      if (result.success) {
        toast.add({ severity: 'info', summary: 'Member rejected', life: 2000 })
        await loadMembers()
      }
    },
  })
}

async function handleSuspend(id: string, name: string) {
  confirm.require({
    message: `Suspend ${name}'s account?`,
    header: 'Confirm Suspension',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await suspendMember(id)
      if (result.success) {
        toast.add({ severity: 'warn', summary: 'Member suspended', life: 2000 })
        await loadMembers()
      }
    },
  })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Members</h1>
        <p class="text-slate-500 text-sm">Manage alumni member accounts</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 flex-wrap">
      <InputText
        v-model="search"
        placeholder="Search by name or email..."
        class="flex-1 min-w-48"
        @input="onSearch"
      />
      <Select
        v-model="statusFilter"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="w-40"
      />
      <Button
        v-if="selectedMembers.length > 0"
        :label="`Approve Selected (${selectedMembers.length})`"
        icon="pi pi-check"
        severity="success"
        @click="handleApprove(selectedMembers.map(m => m.id))"
      />
    </div>

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <DataTable
        v-model:selection="selectedMembers"
        :value="members"
        :loading="loading"
        data-key="id"
        class="text-sm"
      >
        <Column selection-mode="multiple" header-style="width: 3rem" />
        <Column field="full_name" header="Name">
          <template #body="{ data }">
            <NuxtLink :to="`/admin/members/${data.id}`" class="font-medium text-slate-900 hover:text-primary-600">
              {{ data.full_name }}
            </NuxtLink>
          </template>
        </Column>
        <Column field="email" header="Email" class="text-slate-600" />
        <Column field="batch_year" header="Batch">
          <template #body="{ data }">
            <span v-if="data.batch_year" class="text-sm text-slate-600">{{ data.batch_year }}</span>
            <span v-else class="text-slate-400">—</span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <MemberStatusBadge :status="data.status" />
          </template>
        </Column>
        <Column field="created_at" header="Registered">
          <template #body="{ data }">
            <span class="text-slate-500 text-xs">{{ formatDate(data.created_at) }}</span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <div class="flex gap-1.5">
              <Button
                v-if="data.status === 'pending'"
                icon="pi pi-check"
                size="small"
                severity="success"
                text
                title="Approve"
                @click="handleApprove([data.id])"
              />
              <Button
                v-if="data.status === 'pending'"
                icon="pi pi-times"
                size="small"
                severity="danger"
                text
                title="Reject"
                @click="handleReject(data.id, data.full_name)"
              />
              <Button
                v-if="data.status === 'active'"
                icon="pi pi-ban"
                size="small"
                severity="warn"
                text
                title="Suspend"
                @click="handleSuspend(data.id, data.full_name)"
              />
              <NuxtLink :to="`/admin/members/${data.id}`">
                <Button icon="pi pi-pencil" size="small" text title="Edit" />
              </NuxtLink>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
