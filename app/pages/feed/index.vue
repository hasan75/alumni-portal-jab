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
        class="rounded-[20px] h-40 animate-pulse"
        style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);"
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
        class="relative overflow-hidden inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);box-shadow:0 2px 0 rgba(255,255,255,0.15) inset;"
        @click="loadMore"
      >
        <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent" />
        Load more
      </button>
    </div>

    <div v-if="!loading && posts.length === 0" class="glass relative overflow-hidden text-center py-16 px-8 animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float" style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.20);">
          <i class="pi pi-comments text-3xl text-white/40" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Nothing here yet</h3>
        <p class="text-white/50 text-sm">Be the first to share something with the alumni network!</p>
      </div>
    </div>
  </div>
</template>

