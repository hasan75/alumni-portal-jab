<script setup lang="ts">
import PostComposer from '~/components/feed/PostComposer.vue'
import FeedPost from '~/components/feed/FeedPost.vue'

definePageMeta({ layout: 'member', middleware: 'member-auth' })
useSeoMeta({ title: 'Alumni Feed', robots: 'noindex' })

const { fetchPosts, posts, loading, hasMore } = useFeed()

await fetchPosts('general')

async function loadMore() {
  const nextPage = Math.ceil(posts.value.length / 10) + 1
  await fetchPosts('general', undefined, nextPage)
}

function onPostRemoved(id: number) {
  const idx = posts.value.findIndex(p => p.id === id)
  if (idx !== -1) posts.value.splice(idx, 1)
}
</script>

<template>
  <div class="max-w-xl mx-auto space-y-4">
    <PostComposer scope="general" @posted="fetchPosts('general')" />

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-[20px] h-40 animate-pulse bg-white/40 border border-slate-200"
      />
    </div>

    <template v-else>
      <FeedPost
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @removed="onPostRemoved"
      />
    </template>

    <div v-if="hasMore && posts.length > 0" class="text-center pt-2">
      <button
        class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-700 rounded-xl bg-white/70 border border-slate-200 hover:bg-white hover:-translate-y-0.5 active:scale-95 shadow-sm transition-all duration-200"
        @click="loadMore"
      >
        Load more
      </button>
    </div>

    <div v-if="!loading && posts.length === 0" class="glass-light relative overflow-hidden text-center py-16 px-8 animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float bg-primary-50 border border-primary-200">
          <i class="pi pi-comments text-3xl text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">Nothing here yet</h3>
        <p class="text-slate-500 text-sm">Be the first to share something with the alumni network!</p>
      </div>
    </div>
  </div>
</template>
