<script setup lang="ts">
import PostComposer from '~/components/feed/PostComposer.vue'
import FeedPost from '~/components/feed/FeedPost.vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'member', middleware: 'member-auth' })

const route = useRoute()
const year = Number(route.params.year)

const authStore = useAuthStore()
const { fetchPosts, posts, loading, hasMore } = useFeed()

useSeoMeta({ title: `Batch ${year} Feed`, robots: 'noindex' })

await fetchPosts('batch', year)

async function loadMore() {
  const nextPage = Math.ceil(posts.value.length / 10) + 1
  await fetchPosts('batch', year, nextPage)
}

function onPostRemoved(id: number) {
  const idx = posts.value.findIndex(p => p.id === id)
  if (idx !== -1) posts.value.splice(idx, 1)
}
</script>

<template>
  <div class="max-w-xl mx-auto space-y-4">
    <div class="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 flex items-center gap-2">
      <i class="pi pi-graduation-cap text-primary-600" />
      <span class="font-semibold text-primary-700">Class of {{ year }} — Batch Feed</span>
    </div>

    <PostComposer scope="batch" :batch-year="year" @posted="fetchPosts('batch', year)" />

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white border border-slate-200 rounded-xl h-40 animate-pulse" />
    </div>

    <template v-else>
      <FeedPost
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @removed="onPostRemoved"
      />
    </template>

    <div v-if="hasMore && posts.length > 0" class="text-center">
      <button
        class="px-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        @click="loadMore"
      >
        Load more
      </button>
    </div>

    <div v-if="!loading && posts.length === 0" class="text-center py-16">
      <i class="pi pi-comments text-4xl text-slate-300 mb-3 block" />
      <p class="text-slate-500">No posts in the Batch {{ year }} feed yet.</p>
    </div>
  </div>
</template>
