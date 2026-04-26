<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Batches | Admin', robots: 'noindex' })

const supabase = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

const batches = ref<any[]>([])
const loading = ref(false)
const newBatchYear = ref<number | null>(null)
const newBatchLabel = ref('')
const adding = ref(false)

async function load() {
  loading.value = true
  const { data } = await supabase.from('batches').select('*').order('year', { ascending: false })
  batches.value = data || []
  loading.value = false
}

onMounted(load)

async function addBatch() {
  if (!newBatchYear.value) return
  adding.value = true
  const { error } = await supabase.from('batches').insert({
    year: newBatchYear.value,
    label: newBatchLabel.value || `Class of ${newBatchYear.value}`,
  })
  if (!error) {
    toast.add({ severity: 'success', summary: 'Batch added', life: 2000 })
    newBatchYear.value = null
    newBatchLabel.value = ''
    await load()
  }
  else {
    toast.add({ severity: 'error', summary: error.message, life: 3000 })
  }
  adding.value = false
}

async function toggleActive(id: number, current: boolean) {
  const action = current ? 'Deactivate' : 'Activate'
  confirm.require({
    message: `${action} this batch?`,
    header: `Confirm ${action}`,
    icon: current ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await supabase.from('batches').update({ is_active: !current }).eq('id', id)
      await load()
    },
  })
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-slate-900">Batches</h1>

    <!-- Add batch -->
    <div class="bg-white border border-slate-200 rounded-xl p-4">
      <h2 class="font-medium text-slate-900 mb-3">Add New Batch</h2>
      <div class="flex gap-3 flex-wrap">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">Year *</label>
          <InputText v-model="newBatchYear" type="number" placeholder="e.g. 2025" class="w-32" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium text-slate-600 mb-1">Label</label>
          <InputText v-model="newBatchLabel" placeholder="e.g. Class of 2025" class="w-full max-w-sm" />
        </div>
        <div class="flex items-end">
          <Button label="Add Batch" icon="pi pi-plus" size="small" :loading="adding" @click="addBatch" />
        </div>
      </div>
    </div>

    <div v-if="!loading && batches.length === 0" class="bg-white border border-slate-200 rounded-xl text-center py-16 px-8">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 mx-auto mb-4 flex items-center justify-center">
        <i class="pi pi-calendar text-2xl text-slate-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">No batches found</h3>
      <p class="text-sm text-slate-500">Add your first batch using the form above.</p>
    </div>

    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <DataTable :value="batches" :loading="loading" data-key="id" class="text-sm" :paginator="batches.length > 10" :rows="25" :rows-per-page-options="[10, 20, 25, 30]">
        <Column field="year" header="Year" />
        <Column field="label" header="Label" />
        <Column field="member_count" header="Members" />
        <Column field="is_active" header="Active">
          <template #body="{ data }">
            <span
              class="text-xs px-2 py-0.5 rounded-full font-medium"
              :class="data.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
            >
              {{ data.is_active ? 'Active' : 'Inactive' }}
            </span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              :label="data.is_active ? 'Deactivate' : 'Activate'"
              :severity="data.is_active ? 'warn' : 'success'"
              size="small"
              text
              @click="toggleActive(data.id, data.is_active)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
