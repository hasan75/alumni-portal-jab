<script setup lang="ts">
import type { FeedComment } from '~/types/feed'
import { formatRelativeTime } from '~/utils/formatters'

defineProps<{
  comment: FeedComment
}>()
</script>

<template>
  <div class="flex gap-2">
    <div class="w-7 h-7 shrink-0">
      <AppAvatar :src="comment.author?.avatar_url" :name="comment.author?.full_name" size="xs" />
    </div>
    <div class="flex-1">
      <div class="rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-100">
        <p class="text-xs font-semibold text-slate-600">
          {{ comment.author?.display_name || comment.author?.full_name }}
        </p>
        <p class="text-sm text-slate-700 mt-0.5">{{ comment.content }}</p>
      </div>
      <p class="text-[11px] text-slate-400 mt-1 ml-1">{{ formatRelativeTime(comment.created_at) }}</p>
    </div>
  </div>
</template>
