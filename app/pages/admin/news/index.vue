<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { formatDateShort } from '~/utils/formatters'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'News | Admin', robots: 'noindex' })

const { fetchAllForAdmin, deleteArticle } = useNews()
const toast = useToast()
const confirm = useConfirm()

const articles = ref<any[]>([])
const loading = ref(false)
const search = ref('')

async function load() {
  loading.value = true
  articles.value = await fetchAllForAdmin({ search: search.value || undefined })
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
      const result = await deleteArticle(id)
      if (result.success) {
        toast.add({ severity: 'success', summary: 'Article deleted', life: 2000 })
        await load()
      }
    },
  })
}

const statusSeverity: Record<string, string> = { published: 'success', draft: 'secondary', archived: 'warn' }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-xl font-bold text-slate-900">News & Articles</h1>
      <NuxtLink to="/admin/news/new">
        <Button label="New Article" icon="pi pi-plus" size="small" />
      </NuxtLink>
    </div>

    <InputText v-model="search" placeholder="Search articles..." class="max-w-sm" @input="onSearch" />

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <DataTable :value="articles" :loading="loading" data-key="id" class="text-sm">
        <Column field="title" header="Title">
          <template #body="{ data }">
            <NuxtLink :to="`/admin/news/${data.id}`" class="font-medium text-slate-900 hover:text-primary-600">
              {{ data.title }}
            </NuxtLink>
          </template>
        </Column>
        <Column header="Category">
          <template #body="{ data }">
            <span v-if="data.category" class="text-slate-600 text-xs">{{ data.category.name }}</span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="statusSeverity[data.status] || 'secondary'" />
          </template>
        </Column>
        <Column field="published_at" header="Published">
          <template #body="{ data }">
            <span class="text-slate-500 text-xs">{{ data.published_at ? formatDateShort(data.published_at) : '—' }}</span>
          </template>
        </Column>
        <Column field="view_count" header="Views" />
        <Column header="Actions">
          <template #body="{ data }">
            <div class="flex gap-1">
              <NuxtLink :to="`/admin/news/${data.id}`">
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
