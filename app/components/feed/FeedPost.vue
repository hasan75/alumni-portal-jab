<script setup lang="ts">
import type { FeedPost, ReactionType, FeedComment } from '~/types/feed'
import { formatRelativeTime } from '~/utils/formatters'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  post: FeedPost
  adminMode?: boolean
}>()

const emit = defineEmits<{
  removed: [id: number]
}>()

const { toggleReaction, fetchComments, addComment, removePost, hidePost } = useFeed()
const authStore = useAuthStore()
const toast = useToast()

const comments = ref<FeedComment[]>([])
const showComments = ref(false)
const loadingComments = ref(false)
const commentText = ref('')
const postingComment = ref(false)

const reactionEmojis: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  celebrate: '🎉',
  support: '🤝',
}

async function handleReaction(type: ReactionType) {
  await toggleReaction(props.post.id, type)
}

async function toggleComments() {
  showComments.value = !showComments.value
  if (showComments.value && comments.value.length === 0) {
    loadingComments.value = true
    comments.value = await fetchComments(props.post.id)
    loadingComments.value = false
  }
}

async function handleAddComment() {
  if (!commentText.value.trim()) return
  postingComment.value = true
  const result = await addComment(props.post.id, commentText.value.trim())
  if (result.success && result.data) {
    comments.value.push(result.data)
    commentText.value = ''
  }
  postingComment.value = false
}

async function handleRemove() {
  const reason = prompt('Reason for removal:')
  if (!reason) return
  const result = await removePost(props.post.id, reason)
  if (result.success) {
    emit('removed', props.post.id)
    toast.add({ severity: 'success', summary: 'Post removed', life: 2000 })
  }
}

async function handleHide() {
  const result = await hidePost(props.post.id)
  if (result.success) {
    toast.add({ severity: 'info', summary: 'Post hidden', life: 2000 })
  }
}
</script>

<template>
  <div class="glass relative overflow-hidden animate-fade-in-up">
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent z-10" />

    <!-- Header -->
    <div class="relative p-5 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <img
          v-if="post.author?.avatar_url"
          :src="post.author.avatar_url"
          class="w-10 h-10 rounded-full object-cover ring-2 ring-white/25 shrink-0"
          alt="Author"
        >
        <div
          v-else
          class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0 avatar-gradient"
        >
          {{ post.author?.full_name?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div>
          <NuxtLink
            :to="`/directory/${post.author_id}`"
            class="font-semibold text-white hover:text-primary-200 text-sm transition-colors"
          >
            {{ post.author?.display_name || post.author?.full_name }}
          </NuxtLink>
          <p v-if="post.author?.current_job_title" class="text-xs text-white/50 mt-0.5">
            {{ post.author.current_job_title }}
            <span v-if="post.author.current_company"> · {{ post.author.current_company }}</span>
          </p>
          <p class="text-xs text-white/30 mt-0.5">{{ formatRelativeTime(post.created_at) }}</p>
        </div>
      </div>

      <!-- Admin controls -->
      <div v-if="adminMode" class="flex gap-1 shrink-0">
        <button
          class="p-2 text-white/40 hover:text-amber-300 hover:bg-amber-400/10 rounded-lg transition-all duration-150 text-xs"
          title="Hide post"
          @click="handleHide"
        >
          <i class="pi pi-eye-slash" />
        </button>
        <button
          class="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-150 text-xs"
          title="Remove post"
          @click="handleRemove"
        >
          <i class="pi pi-trash" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="relative px-5 pb-4">
      <p class="text-sm text-white/85 whitespace-pre-line leading-relaxed">{{ post.content }}</p>

      <div
        v-if="post.image_urls && post.image_urls.length > 0"
        class="mt-3 grid gap-2 rounded-xl overflow-hidden"
        :class="post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
      >
        <img
          v-for="(img, idx) in post.image_urls"
          :key="idx"
          :src="img"
          class="w-full object-cover max-h-64 rounded-xl"
          alt="Post image"
        >
      </div>
    </div>

    <!-- Reactions bar -->
    <div class="relative px-5 pb-4 flex items-center justify-between border-t border-white/10 pt-3">
      <div class="flex items-center gap-1">
        <button
          v-for="(emoji, type) in reactionEmojis"
          :key="type"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm transition-all duration-150 hover:scale-110"
          :class="[
            post.my_reaction === type
              ? 'scale-110'
              : 'opacity-60 hover:opacity-100',
          ]"
          :style="post.my_reaction === type ? 'background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);' : ''"
          @click="handleReaction(type as ReactionType)"
        >
          <span>{{ emoji }}</span>
        </button>
        <span v-if="post.reaction_count > 0" class="text-xs text-white/40 ml-1">
          {{ post.reaction_count }}
        </span>
      </div>

      <button
        class="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-all duration-150"
        @click="toggleComments"
      >
        <i class="pi pi-comment text-xs" />
        <span>{{ post.comment_count }}</span>
      </button>
    </div>

    <!-- Comments section -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="showComments" class="relative border-t border-white/10 px-5 py-4 space-y-3">
        <div v-if="loadingComments" class="text-sm text-white/40 text-center py-2">
          Loading comments...
        </div>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-2"
        >
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white/60 text-xs font-medium shrink-0" style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.15);">
            {{ comment.author?.full_name?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 rounded-xl px-3.5 py-2.5" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);">
            <p class="text-xs font-semibold text-white/70">
              {{ comment.author?.display_name || comment.author?.full_name }}
            </p>
            <p class="text-sm text-white/80 mt-0.5">{{ comment.content }}</p>
          </div>
        </div>

        <!-- Comment input -->
        <div class="flex gap-2 pt-1">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white/60 text-xs font-medium shrink-0 avatar-gradient">
            {{ authStore.displayName.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 flex gap-2">
            <input
              v-model="commentText"
              type="text"
              placeholder="Write a comment..."
              class="flex-1 text-sm rounded-xl px-3.5 py-2 text-white placeholder:text-white/30 focus:outline-none transition-all duration-200"
              style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.18);"
              @keyup.enter="handleAddComment"
            >
            <button
              class="relative overflow-hidden px-3.5 py-2 text-sm font-semibold text-white rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-40"
              style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.30);box-shadow:0 2px 0 rgba(255,255,255,0.2) inset;"
              :disabled="!commentText.trim() || postingComment"
              @click="handleAddComment"
            >
              <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
              <i v-if="postingComment" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-send" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

