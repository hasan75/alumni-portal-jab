<script setup lang="ts">
import type { FeedComment } from '~/types/feed'
import { formatRelativeTime } from '~/utils/formatters'

defineProps<{
  comment: FeedComment
}>()
</script>

<template>
  <div class="flex gap-2">
    <img
      v-if="comment.author?.avatar_url"
      :src="comment.author.avatar_url"
      class="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 shrink-0"
      alt="Author"
    >
    <div
      v-else
      class="w-7 h-7 rounded-full flex items-center justify-center text-white/60 text-xs font-medium shrink-0"
      style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.15);"
    >
      {{ comment.author?.full_name?.charAt(0)?.toUpperCase() || '?' }}
    </div>
    <div class="flex-1">
      <div class="rounded-xl px-3.5 py-2.5" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);">
        <p class="text-xs font-semibold text-white/70">
          {{ comment.author?.display_name || comment.author?.full_name }}
        </p>
        <p class="text-sm text-white/80 mt-0.5">{{ comment.content }}</p>
      </div>
      <p class="text-[11px] text-white/30 mt-1 ml-1">{{ formatRelativeTime(comment.created_at) }}</p>
    </div>
  </div>
</template>

