<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | null
  bucket: string
  path: string
  maxSizeMb?: number
  accept?: string
  aspectRatio?: string
  placeholder?: string
  compact?: boolean
}>(), {
  maxSizeMb: 5,
  accept: 'image/*',
  aspectRatio: '16/9',
  placeholder: 'Click to upload',
  compact: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const { upload, remove, uploading, progress, error, extractPathFromUrl } = useImageUpload()
const toast = useToast()

const fileInput = ref<HTMLInputElement>()
const dragging = ref(false)

const previewUrl = computed(() => props.modelValue)
const hasImage = computed(() => !!props.modelValue)

function openFilePicker() {
  fileInput.value?.click()
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFile(file)
  input.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

async function handleFile(file: File) {
  if (!file.type.startsWith('image/')) {
    toast.add({ severity: 'warn', summary: 'Invalid file', detail: 'Please select an image file', life: 3000 })
    return
  }

  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    toast.add({ severity: 'warn', summary: 'File too large', detail: `Maximum size is ${props.maxSizeMb}MB`, life: 3000 })
    return
  }

  const { url, error: uploadError } = await upload(file, props.bucket, props.path, {
    maxSizeMB: props.maxSizeMb,
    accept: props.accept,
  })

  if (uploadError) {
    toast.add({ severity: 'error', summary: 'Upload failed', detail: uploadError, life: 4000 })
    return
  }

  emit('update:modelValue', url)
}

async function removeImage() {
  if (!props.modelValue) return

  const filePath = extractPathFromUrl(props.modelValue, props.bucket)
  if (filePath) {
    await remove(props.bucket, filePath)
  }

  emit('update:modelValue', null)
}
</script>

<template>
  <div :class="compact ? 'w-28' : 'w-full'">
    <!-- Upload zone (no image) -->
    <div
      v-if="!hasImage && !uploading"
      class="relative cursor-pointer overflow-hidden rounded-xl transition-all duration-200 hover:border-primary-400"
      :class="dragging ? 'border-primary-400' : ''"
      :style="`aspect-ratio: ${aspectRatio}; border: 1.5px dashed #cbd5e1;`"
      style="background: #f8fafc;"
      @click="openFilePicker"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <div class="flex h-full flex-col items-center justify-center gap-1.5 p-3">
        <Icon :name="compact ? 'heroicons:camera' : 'heroicons:cloud-arrow-up'" class="h-5 w-5" style="color: #94a3b8;" />
        <p class="text-center text-[11px] font-medium" style="color: #64748b;">
          {{ placeholder }}
        </p>
        <p v-if="!compact" class="text-center text-[10px]" style="color: #94a3b8;">
          PNG, JPG up to {{ maxSizeMb }}MB
        </p>
      </div>
    </div>

    <!-- Upload progress -->
    <div
      v-else-if="uploading"
      class="relative flex items-center justify-center overflow-hidden rounded-xl"
      :style="`aspect-ratio: ${aspectRatio}; border: 1.5px solid #e2e8f0; background: #f8fafc;`"
    >
      <div class="flex flex-col items-center gap-2">
        <div class="h-1.5 w-20 overflow-hidden rounded-full" style="background: #e2e8f0;">
          <div
            class="h-full rounded-full transition-all duration-300"
            style="background: #2563eb;"
            :style="`width: ${progress}%`"
          />
        </div>
        <p class="text-[11px]" style="color: #64748b;">Uploading...</p>
      </div>
    </div>

    <!-- Image preview -->
    <div
      v-else-if="hasImage"
      class="group relative overflow-hidden rounded-xl"
      :style="`aspect-ratio: ${aspectRatio}; border: 1.5px solid #e2e8f0;`"
    >
      <img
        :src="previewUrl!"
        alt="Uploaded image"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 active:scale-95"
          style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);"
          @click="openFilePicker"
        >
          <Icon name="heroicons:arrow-path" class="h-3.5 w-3.5" />
          Replace
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 active:scale-95"
          style="background: rgba(255,59,48,0.4); border: 1px solid rgba(255,59,48,0.5);"
          @click="removeImage"
        >
          <Icon name="heroicons:trash" class="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="onFileSelect"
    />
  </div>
</template>
