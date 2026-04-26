<script setup lang="ts">
import type { PostScope } from '~/types/feed'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  scope?: PostScope
  batchYear?: number
}>()

const emit = defineEmits<{
  posted: []
}>()

const { createPost } = useFeed()
const authStore = useAuthStore()
const toast = useToast()

const content = ref('')
const loading = ref(false)
const expanded = ref(false)

async function handlePost() {
  if (!content.value.trim()) return

  loading.value = true
  const result = await createPost(
    content.value.trim(),
    [],
    props.scope || 'general',
    props.batchYear,
  )

  if (result.success) {
    content.value = ''
    expanded.value = false
    emit('posted')
    toast.add({ severity: 'success', summary: 'Post shared!', life: 2000 })
  }
  else {
    toast.add({ severity: 'error', summary: 'Failed to post', detail: result.error, life: 3000 })
  }

  loading.value = false
}
</script>

<template>
  <div class="glass relative overflow-hidden p-5 animate-fade-in-up">
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

    <div class="relative flex gap-3">
      <!-- Avatar -->
      <div class="shrink-0">
        <img
          v-if="authStore.profile?.avatar_url"
          :src="authStore.profile.avatar_url"
          class="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
          alt="Your avatar"
        >
        <div
          v-else
          class="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm avatar-gradient"
        >
          {{ authStore.displayName.charAt(0).toUpperCase() }}
        </div>
      </div>

      <div class="flex-1">
        <textarea
          v-model="content"
          :rows="expanded ? 4 : 2"
          placeholder="Share something with your alumni network..."
          class="w-full resize-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-200"
          style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.20);backdrop-filter:blur(10px);"
          @focus="expanded = true"
        />

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="expanded" class="flex items-center justify-between mt-3">
            <div class="flex gap-2">
              <span v-if="scope === 'batch' && batchYear" class="text-xs text-primary-300 px-2.5 py-1 rounded-full" style="background:rgba(147,197,253,0.15);border:1px solid rgba(147,197,253,0.25);">
                Batch {{ batchYear }} feed
              </span>
              <span v-else class="text-xs text-white/50 px-2.5 py-1 rounded-full" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);">
                General feed
              </span>
            </div>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150"
                @click="expanded = false; content = ''"
              >
                Cancel
              </button>
              <button
                class="relative overflow-hidden px-4 py-1.5 text-sm font-semibold text-white rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-40"
                style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.35);box-shadow:0 2px 0 rgba(255,255,255,0.2) inset;"
                :disabled="!content.trim() || loading"
                @click="handlePost"
              >
                <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
                <i v-if="loading" class="pi pi-spin pi-spinner mr-1" />
                Post
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

