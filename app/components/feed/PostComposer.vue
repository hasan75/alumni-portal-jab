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
const { upload: uploadImage, uploading: imageUploading } = useImageUpload()
const authStore = useAuthStore()
const toast = useToast()

const content = ref('')
const loading = ref(false)
const expanded = ref(false)
const fileInput = ref<HTMLInputElement>()

const attachedImages = ref<{ file: File, preview: string }[]>([])
const MAX_IMAGES = 4

function openImagePicker() {
  fileInput.value?.click()
}

function onImageSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  for (const file of files) {
    if (attachedImages.value.length >= MAX_IMAGES) break
    if (!file.type.startsWith('image/')) continue
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ severity: 'warn', summary: 'Image too large (max 5MB)', life: 3000 })
      continue
    }
    attachedImages.value.push({ file, preview: URL.createObjectURL(file) })
  }
  input.value = ''
}

function cancelPost() {
  expanded.value = false
  content.value = ''
  attachedImages.value.forEach(img => URL.revokeObjectURL(img.preview))
  attachedImages.value = []
}

function removeImage(index: number) {
  if (attachedImages.value[index]) {
    URL.revokeObjectURL(attachedImages.value[index].preview)
  }
  attachedImages.value.splice(index, 1)
}

async function handlePost() {
  if (!content.value.trim()) return

  loading.value = true

  let imageUrls: string[] = []
  if (attachedImages.value.length > 0) {
    const userId = authStore.profile?.id || 'anonymous'
    const results = await Promise.all(
      attachedImages.value.map(img =>
        uploadImage(img.file, 'feed', userId, { maxSizeMB: 5 }),
      ),
    )
    imageUrls = results.filter(r => r.url).map(r => r.url!)
  }

  const result = await createPost(
    content.value.trim(),
    imageUrls,
    props.scope || 'general',
    props.batchYear,
  )

  if (result.success) {
    content.value = ''
    expanded.value = false
    attachedImages.value.forEach(img => URL.revokeObjectURL(img.preview))
    attachedImages.value = []
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

        <!-- Attached images preview -->
        <div v-if="attachedImages.length" class="mt-2 flex gap-2 flex-wrap">
          <div
            v-for="(img, index) in attachedImages"
            :key="index"
            class="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200"
          >
            <img :src="img.preview" alt="Attached" class="w-full h-full object-cover" />
            <button
              type="button"
              class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              @click="removeImage(index)"
            >
              <Icon name="heroicons:x-mark" class="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="expanded" class="flex items-center justify-between mt-3">
            <div class="flex gap-2 items-center">
              <button
                v-if="attachedImages.length < MAX_IMAGES"
                type="button"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-150"
                @click="openImagePicker"
              >
                <Icon name="heroicons:photo" class="h-4 w-4" />
                Photo
              </button>
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
                @click="cancelPost"
              >
                Cancel
              </button>
              <button
                class="px-4 py-1.5 text-sm font-semibold text-white rounded-xl bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-40 shadow-sm shadow-primary-600/20"
                :disabled="!content.trim() || loading || imageUploading"
                @click="handlePost"
              >
                <i v-if="loading || imageUploading" class="pi pi-spin pi-spinner mr-1" />
                Post
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onImageSelect"
    />
  </div>
</template>
