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
  <div class="glass-light relative overflow-hidden p-5 animate-fade-in-up">
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

    <div class="relative flex gap-3">
      <!-- Avatar -->
      <div class="shrink-0">
        <AppAvatar :src="authStore.profile?.avatar_url" :name="authStore.displayName" size="sm" />
      </div>

      <div class="flex-1">
        <textarea
          v-model="content"
          :rows="expanded ? 4 : 2"
          placeholder="Share something with your alumni network..."
          class="w-full resize-none rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200 bg-slate-50 border border-slate-200"
          @focus="expanded = true"
        />

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="expanded" class="flex items-center justify-between mt-3">
            <div class="flex gap-2">
              <span v-if="scope === 'batch' && batchYear" class="text-xs text-primary-700 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200">
                Batch {{ batchYear }} feed
              </span>
              <span v-else class="text-xs text-slate-500 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                General feed
              </span>
            </div>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-150"
                @click="expanded = false; content = ''"
              >
                Cancel
              </button>
              <button
                class="px-4 py-1.5 text-sm font-semibold text-white rounded-xl bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-40 shadow-sm shadow-primary-600/20"
                :disabled="!content.trim() || loading"
                @click="handlePost"
              >
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
