<script setup lang="ts">
import type { AuditLogEntry } from '~/types/audit'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Audit Log | Admin', robots: 'noindex' })

const { logs, totalCount, loading, fetchLogs, fetchAdminUsers } = useAuditLog()

const search = ref('')
const actionFilter = ref('')
const adminFilter = ref('')
const tableFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(25)

const selectedLog = ref<AuditLogEntry | null>(null)
const showDetail = ref(false)

const adminUsers = ref<{ id: string, email: string, role: string }[]>([])

const actionOptions = [
  { label: 'All Actions', value: '' },
  { label: 'Create', value: 'create' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
]

const tableOptions = [
  { label: 'All Tables', value: '' },
  { label: 'Alumni Profiles', value: 'alumni_profiles' },
  { label: 'Events', value: 'events' },
  { label: 'Articles', value: 'articles' },
  { label: 'Jobs', value: 'jobs' },
  { label: 'Feed Posts', value: 'feed_posts' },
]

const adminOptions = computed(() => {
  const options = [{ label: 'All Admins', value: '' }]
  adminUsers.value.forEach(u => options.push({ label: u.email, value: u.id }))
  return options
})

function actionBadgeClass(action: string) {
  switch (action) {
    case 'create': return 'bg-green-50 text-green-700'
    case 'update': return 'bg-blue-50 text-blue-700'
    case 'delete': return 'bg-red-50 text-red-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

function formatTableName(name: string) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatJson(obj: Record<string, unknown> | null) {
  if (!obj) return '—'
  return JSON.stringify(obj, null, 2)
}

async function loadLogs() {
  await fetchLogs({
    search: search.value || undefined,
    action: actionFilter.value || undefined,
    userId: adminFilter.value || undefined,
    tableName: tableFilter.value || undefined,
    page: currentPage.value,
    perPage: pageSize.value,
  })
}

function openDetail(log: AuditLogEntry) {
  selectedLog.value = log
  showDetail.value = true
}

let searchTimeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadLogs()
  }, 300)
})

watch([actionFilter, adminFilter, tableFilter], () => {
  currentPage.value = 1
  loadLogs()
})

onMounted(async () => {
  await Promise.all([loadLogs(), fetchAdminUsers().then(users => adminUsers.value = users)])
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
    <div class="mb-2">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Audit Log</h1>
      <p class="text-sm text-slate-500 mt-1">Track all admin actions across the system.</p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          v-model="search"
          type="text"
          placeholder="Search by description or admin email..."
          class="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        >
      </div>
      <Select
        v-model="actionFilter"
        :options="actionOptions"
        option-label="label"
        option-value="value"
        placeholder="Action"
        class="w-40 text-sm"
      />
      <Select
        v-model="adminFilter"
        :options="adminOptions"
        option-label="label"
        option-value="value"
        placeholder="Admin"
        class="w-48 text-sm"
      />
      <Select
        v-model="tableFilter"
        :options="tableOptions"
        option-label="label"
        option-value="value"
        placeholder="Table"
        class="w-48 text-sm"
      />
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-14 rounded-xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="logs.length === 0" class="glass relative overflow-hidden p-12 text-center">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-list text-2xl text-slate-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">No audit logs found</h3>
        <p class="text-sm text-slate-500">Try adjusting your filters or check back after admin actions are performed.</p>
      </div>
    </div>

    <div v-else class="space-y-2">
      <div class="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400">
        <div class="col-span-1">Action</div>
        <div class="col-span-4">Description</div>
        <div class="col-span-2">Admin</div>
        <div class="col-span-2">Table</div>
        <div class="col-span-2">Date</div>
        <div class="col-span-1" />
      </div>

      <div
        v-for="(log, index) in logs"
        :key="log.id"
        class="glass relative overflow-hidden hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in-up"
        :class="`delay-${Math.min(index + 1, 6)}`"
        @click="openDetail(log)"
      >
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        <div class="relative grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center p-4">
          <div class="col-span-1">
            <span :class="actionBadgeClass(log.action)" class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium capitalize">
              {{ log.action }}
            </span>
          </div>
          <div class="col-span-4 text-sm text-slate-700 truncate">
            {{ log.description || '—' }}
          </div>
          <div class="col-span-2 text-sm text-slate-500 truncate">
            {{ log.user_email || '—' }}
          </div>
          <div class="col-span-2 text-sm text-slate-500">
            {{ formatTableName(log.table_name) }}
          </div>
          <div class="col-span-2 text-xs text-slate-400">
            {{ formatDateTime(log.created_at) }}
          </div>
          <div class="col-span-1 flex justify-end">
            <button
              class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150"
              title="View details"
              @click.stop="openDetail(log)"
            >
              <i class="pi pi-eye text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalCount > pageSize" class="flex items-center justify-between pt-2">
      <p class="text-sm text-slate-500">
        Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, totalCount) }} of {{ totalCount }}
      </p>
      <div class="flex gap-2">
        <button
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          @click="currentPage--; loadLogs()"
        >
          Previous
        </button>
        <button
          :disabled="currentPage * pageSize >= totalCount"
          class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          @click="currentPage++; loadLogs()"
        >
          Next
        </button>
      </div>
    </div>

    <Dialog
      v-model:visible="showDetail"
      modal
      :closable="true"
      :style="{ width: '600px' }"
      header="Audit Log Details"
      class="glass-dialog"
    >
      <div v-if="selectedLog" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Action</p>
            <span :class="actionBadgeClass(selectedLog.action)" class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium capitalize">
              {{ selectedLog.action }}
            </span>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Table</p>
            <p class="text-sm text-slate-700">{{ formatTableName(selectedLog.table_name) }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Admin</p>
            <p class="text-sm text-slate-700">{{ selectedLog.user_email || '—' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Record ID</p>
            <p class="text-sm text-slate-700 font-mono truncate">{{ selectedLog.record_id || '—' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Date & Time</p>
            <p class="text-sm text-slate-700">{{ formatDateTime(selectedLog.created_at) }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">IP Address</p>
            <p class="text-sm text-slate-700 font-mono">{{ selectedLog.ip_address || '—' }}</p>
          </div>
        </div>

        <div v-if="selectedLog.description">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Description</p>
          <p class="text-sm text-slate-700">{{ selectedLog.description }}</p>
        </div>

        <div v-if="selectedLog.changed_fields?.length">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Changed Fields</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="field in selectedLog.changed_fields"
              :key="field"
              class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
            >
              {{ field }}
            </span>
          </div>
        </div>

        <div v-if="selectedLog.new_values" class="space-y-1">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">New Values</p>
          <pre class="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 overflow-x-auto max-h-48">{{ formatJson(selectedLog.new_values) }}</pre>
        </div>

        <div v-if="selectedLog.old_values" class="space-y-1">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Old Values</p>
          <pre class="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 overflow-x-auto max-h-48">{{ formatJson(selectedLog.old_values) }}</pre>
        </div>

        <div v-if="selectedLog.user_agent">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">User Agent</p>
          <p class="text-xs text-slate-400 break-all">{{ selectedLog.user_agent }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>
