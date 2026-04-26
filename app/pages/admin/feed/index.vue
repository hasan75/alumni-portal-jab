<script setup lang="ts">
import FeedPost from '~/components/feed/FeedPost.vue'
import Select from 'primevue/select'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Feed Moderation | Admin', robots: 'noindex' })

const { fetchAllForAdmin } = useFeed()

const statusFilter = ref('published')
const currentPage = ref(1)
const posts = ref<any[]>([])
const loading = ref(false)

const statusOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Removed', value: 'removed' },
]

async function load() {
  loading.value = true
  posts.value = await fetchAllForAdmin(currentPage.value, statusFilter.value)
  loading.value = false
}

onMounted(load)
watch([statusFilter, currentPage], load)

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

    <div v-else-if="posts.length > 0" class="space-y-4">
      <FeedPost
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :admin-mode="true"
        @removed="onPostRemoved"
      />
    </div>

    <div v-else class="text-center py-16">
      <i class="pi pi-comments text-4xl text-slate-300 mb-3 block" />
      <p class="text-slate-500">No {{ statusFilter }} posts found</p>
    </div>
  </div>
</template>
