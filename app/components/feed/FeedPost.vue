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
const confirm = useConfirm()

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
  confirm.require({
    message: 'Remove this post? This action cannot be undone.',
    header: 'Confirm Removal',
    icon: 'pi pi-trash',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const reason = prompt('Reason for removal:')
      if (!reason) return
      const result = await removePost(props.post.id, reason)
      if (result.success) {
        emit('removed', props.post.id)
        toast.add({ severity: 'success', summary: 'Post removed', life: 2000 })
      }
    },
  })
}

async function handleHide() {
  confirm.require({
    message: 'Hide this post from the feed?',
    header: 'Confirm Hide',
    icon: 'pi pi-eye-slash',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await hidePost(props.post.id)
      if (result.success) {
        toast.add({ severity: 'info', summary: 'Post hidden', life: 2000 })
      }
    },
  })
}
</script>

<template>
  <div class="glass-light relative overflow-hidden animate-fade-in-up">
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent z-10" />

    <!-- Header -->
    <div class="relative p-5 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <AppAvatar :src="post.author?.avatar_url" :name="post.author?.full_name" size="md" class="shrink-0" />
        <div>
          <NuxtLink
            :to="`/directory/${post.author_id}`"
            class="font-semibold text-slate-900 hover:text-primary-600 text-sm transition-colors"
          >
            {{ post.author?.display_name || post.author?.full_name }}
          </NuxtLink>
          <p v-if="post.author?.featured_work_summary" class="text-xs text-slate-500 mt-0.5">
            {{ post.author.featured_work_summary }}
          </p>
          <p class="text-xs text-slate-400 mt-0.5">{{ formatRelativeTime(post.created_at) }}</p>
        </div>
      </div>

      <!-- Admin controls -->
      <div v-if="adminMode" class="flex gap-1 shrink-0">
        <button
          class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-150 text-xs"
          title="Hide post"
          @click="handleHide"
        >
          <i class="pi pi-eye-slash" />
        </button>
        <button
          class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 text-xs"
          title="Remove post"
          @click="handleRemove"
        >
          <i class="pi pi-trash" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="relative px-5 pb-4">
      <p class="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{{ post.content }}</p>

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
    <div class="relative px-5 pb-4 flex items-center justify-between border-t border-slate-200 pt-3">
      <div class="flex items-center gap-1">
        <button
          v-for="(emoji, type) in reactionEmojis"
          :key="type"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm transition-all duration-150 hover:scale-110"
          :class="[
            post.my_reaction === type
              ? 'scale-110 bg-primary-50 border border-primary-200'
              : 'opacity-60 hover:opacity-100',
          ]"
          @click="handleReaction(type as ReactionType)"
        >
          <span>{{ emoji }}</span>
        </button>
        <span v-if="post.reaction_count > 0" class="text-xs text-slate-400 ml-1">
          {{ post.reaction_count }}
        </span>
      </div>

      <button
        class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-all duration-150"
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
      <div v-if="showComments" class="relative border-t border-slate-200 px-5 py-4 space-y-3">
        <div v-if="loadingComments" class="text-sm text-slate-400 text-center py-2">
          Loading comments...
        </div>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-2"
        >
          <div class="w-7 h-7 shrink-0">
            <AppAvatar :src="comment.author?.avatar_url" :name="comment.author?.full_name" size="xs" />
          </div>
          <div class="flex-1 rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-100">
            <p class="text-xs font-semibold text-slate-600">
              {{ comment.author?.display_name || comment.author?.full_name }}
            </p>
            <p class="text-sm text-slate-700 mt-0.5">{{ comment.content }}</p>
          </div>
        </div>

        <!-- Comment input -->
        <div class="flex gap-2 pt-1">
          <div class="w-7 h-7 shrink-0">
            <AppAvatar :src="null" :name="authStore.displayName" size="xs" />
          </div>
          <div class="flex-1 flex gap-2">
            <input
              v-model="commentText"
              type="text"
              placeholder="Write a comment..."
              class="flex-1 text-sm rounded-xl px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200 bg-slate-50 border border-slate-200"
              @keyup.enter="handleAddComment"
            >
            <button
              class="px-3.5 py-2 text-sm font-semibold text-white rounded-xl bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-40 shadow-sm shadow-primary-600/20"
              :disabled="!commentText.trim() || postingComment"
              @click="handleAddComment"
            >
              <i v-if="postingComment" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-send" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
