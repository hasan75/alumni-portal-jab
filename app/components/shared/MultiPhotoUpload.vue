<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  bucket: string
  path: string
  maxPhotos?: number
  maxSizeMb?: number
}>(), {
  maxPhotos: 4,
  maxSizeMb: 5,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const { upload, remove, uploading, extractPathFromUrl } = useImageUpload()
const toast = useToast()
const fileInput = ref<HTMLInputElement>()

const photos = computed(() => props.modelValue ?? [])
const canAdd = computed(() => photos.value.length < props.maxPhotos)

function openPicker() {
  fileInput.value?.click()
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  for (const file of files) handleFile(file)
}

async function handleFile(file: File) {
  if (!file.type.startsWith('image/')) {
    toast.add({ severity: 'warn', summary: 'Images only', detail: 'Please select an image file', life: 3000 })
    return
  }
  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    toast.add({ severity: 'warn', summary: 'File too large', detail: `Maximum size is ${props.maxSizeMb} MB`, life: 3000 })
    return
  }
  if (photos.value.length >= props.maxPhotos) {
    toast.add({ severity: 'warn', summary: 'Limit reached', detail: `You can upload up to ${props.maxPhotos} photos`, life: 3000 })
    return
  }

  const { url, error } = await upload(file, props.bucket, `${props.path}/photos`)
  if (error || !url) {
    toast.add({ severity: 'error', summary: 'Upload failed', detail: error ?? 'Unknown error', life: 4000 })
    return
  }

  emit('update:modelValue', [...photos.value, url])
}

async function removePhoto(url: string) {
  const filePath = extractPathFromUrl(url, props.bucket)
  if (filePath) await remove(props.bucket, filePath)
  emit('update:modelValue', photos.value.filter(p => p !== url))
}
</script>

<template>
  <div class="space-y-3">
    <!-- Photo grid -->
    <div v-if="photos.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div
        v-for="(url, i) in photos"
        :key="url"
        class="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
        style="aspect-ratio:4/3;"
      >
        <img :src="url" :alt="`Photo ${i + 1}`" class="h-full w-full object-cover" />
        <!-- Hover overlay -->
        <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white active:scale-90 transition-all duration-150"
            style="background:rgba(255,59,48,0.55); border:1px solid rgba(255,59,48,0.6);"
            title="Remove photo"
            @click="removePhoto(url)"
          >
            <Icon name="heroicons:trash" class="h-4 w-4" />
          </button>
        </div>
        <!-- Index badge -->
        <div class="absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white" style="background:rgba(0,0,0,0.45);">
          {{ i + 1 }}
        </div>
      </div>

      <!-- Add-more tile (while under limit) -->
      <button
        v-if="canAdd && !uploading"
        type="button"
        class="relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-500 active:scale-95"
        style="aspect-ratio:4/3;"
        @click="openPicker"
      >
        <Icon name="heroicons:plus-circle" class="h-6 w-6" />
        <span class="text-[11px] font-semibold">Add photo</span>
      </button>
    </div>

    <!-- Empty state / first upload -->
    <div v-if="photos.length === 0 && !uploading">
      <button
        type="button"
        class="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-slate-400 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-500 active:scale-[0.99]"
        @click="openPicker"
      >
        <Icon name="heroicons:photo" class="h-8 w-8" />
        <div class="text-center">
          <p class="text-sm font-semibold">Click to upload photos</p>
          <p class="text-xs mt-0.5">PNG, JPG, WEBP — up to {{ maxSizeMb }} MB each · max {{ maxPhotos }}</p>
        </div>
      </button>
    </div>

    <!-- Upload progress indicator -->
    <div v-if="uploading" class="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
      <i class="pi pi-spin pi-spinner text-primary-500" />
      <p class="text-sm font-medium text-primary-700">Uploading photo…</p>
    </div>

    <!-- Counter -->
    <p v-if="photos.length > 0" class="text-xs text-slate-400">
      {{ photos.length }} / {{ maxPhotos }} photos
    </p>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onFileSelect"
    />
  </div>
</template>
