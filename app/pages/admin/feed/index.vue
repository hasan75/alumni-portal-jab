<script setup lang="ts">
import FeedPost from '~/components/feed/FeedPost.vue'
import Select from 'primevue/select'
import Button from 'primevue/button'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Feed Moderation | Admin', robots: 'noindex' })

const { fetchAllForAdmin } = useFeed()

const statusFilter = ref('published')
const currentPage = ref(1)
const posts = ref<any[]>([])
const feedTotalCount = ref(0)
const loading = ref(false)
const pageSize = ref(25)
const pageSizeOptions = [{ label: '10', value: 10 }, { label: '20', value: 20 }, { label: '25', value: 25 }, { label: '30', value: 30 }]

const statusOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Removed', value: 'removed' },
]

async function load() {
  loading.value = true
  const result = await fetchAllForAdmin(currentPage.value, statusFilter.value, pageSize.value)
  posts.value = result.data
  feedTotalCount.value = result.totalCount
  loading.value = false
}

onMounted(load)

watch(statusFilter, () => {
  currentPage.value = 1
  load()
})

function onPostRemoved(id: number) {
  posts.value = posts.value.filter(p => p.id !== id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-xl font-bold text-slate-900">Feed Moderation</h1>
      <Select
        v-model="statusFilter"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="w-40"
      />
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="bg-white border border-slate-200 rounded-xl h-32 animate-pulse" />
    </div>

    <template v-else-if="posts.length > 0">
      <div class="space-y-4">
        <FeedPost
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :admin-mode="true"
          @removed="onPostRemoved"
        />
      </div>

      <div v-if="feedTotalCount > pageSize" class="flex items-center justify-between pt-2">
        <p class="text-sm text-slate-500">
          Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, feedTotalCount) }} of {{ feedTotalCount }}
        </p>
        <div class="flex items-center gap-3">
          <Select v-model="pageSize" :options="pageSizeOptions" option-label="label" option-value="value" class="w-20" @change="currentPage = 1; load()" />
          <Button label="Previous" icon="pi pi-chevron-left" size="small" text :disabled="currentPage <= 1" @click="currentPage--; load()" />
          <Button label="Next" icon-pos="right" icon="pi pi-chevron-right" size="small" text :disabled="currentPage * pageSize >= feedTotalCount" @click="currentPage++; load()" />
        </div>
      </div>
    </template>

    <div v-else class="bg-white border border-slate-200 rounded-xl text-center py-16 px-8">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 mx-auto mb-4 flex items-center justify-center">
        <i class="pi pi-comments text-2xl text-slate-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">No {{ statusFilter }} posts found</h3>
      <p class="text-sm text-slate-500">Posts with this status will appear here.</p>
    </div>
  </div>
</template>
