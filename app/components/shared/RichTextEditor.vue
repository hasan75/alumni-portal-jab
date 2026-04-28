<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'u', 's', 'a', 'p', 'br', 'span',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
    'blockquote', 'code', 'pre', 'img', 'hr', 'div', 'font',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
    'width', 'height', 'data-align', 'color',
  ],
  ALLOW_DATA_ATTR: false,
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

interface Props {
  id?: string
  modelValue?: string
  height?: number
  placeholder?: string
  readonly?: boolean
  maxLength?: number
  showCharCount?: boolean
  maxImageSize?: number
  allowImages?: boolean
  bucket?: string
  storagePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 400,
  placeholder: 'Start writing...',
  readonly: false,
  maxLength: undefined,
  showCharCount: false,
  maxImageSize: 5,
  allowImages: true,
  bucket: 'news',
  storagePath: 'editor',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const toast = useToast()

const editorInstanceId = computed(() =>
  props.id || `editor-${Math.random().toString(36).substring(2, 11)}`,
)

const editorRef = ref<HTMLDivElement>()
const isActive = ref(false)

const activeFormats = ref({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
})

const currentBlockFormat = ref('')

const showColorPicker = ref(false)
const currentTextColor = ref('#000000')
const colorPickerRef = ref<HTMLDivElement>()

const colorPalette = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
  '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130',
]

const showLinkModal = ref(false)
const linkUrl = ref('')
const linkText = ref('')
const savedSelection = ref<Range | null>(null)

const showImageModal = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const imageAlt = ref('')
const imageWidth = ref<string>('')
const imageAlign = ref<'none' | 'left' | 'center' | 'right'>('none')
const imageUploading = ref(false)

const isDragging = ref(false)

const currentTextContent = ref('')
const characterCount = computed(() => currentTextContent.value.length)
const remainingChars = computed(() => {
  if (!props.maxLength) return null
  return props.maxLength - characterCount.value
})
const isOverLimit = computed(() => {
  return props.maxLength ? characterCount.value > props.maxLength : false
})

function syncTextContent() {
  currentTextContent.value = editorRef.value?.textContent || ''
}

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = sanitizeHtml(props.modelValue || '')
    syncTextContent()
  }
  document.addEventListener('selectionchange', handleSelectionChange)
})

onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelectionChange)
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (showColorPicker.value && colorPickerRef.value && !colorPickerRef.value.contains(event.target as Node)) {
    showColorPicker.value = false
  }
}

watch(showColorPicker, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
  }
  else {
    document.removeEventListener('click', handleClickOutside)
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerHTML !== newValue) {
    editorRef.value.innerHTML = sanitizeHtml(newValue || '')
  }
})

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG)
}

function updateActiveFormats() {
  activeFormats.value.bold = document.queryCommandState('bold')
  activeFormats.value.italic = document.queryCommandState('italic')
  activeFormats.value.underline = document.queryCommandState('underline')
  activeFormats.value.strikeThrough = document.queryCommandState('strikeThrough')

  const formatValue = document.queryCommandValue('formatBlock')
  currentBlockFormat.value = formatValue ? formatValue.toLowerCase().replace(/[<>]/g, '') : ''
}

function handleInputInternal() {
  if (editorRef.value) {
    syncTextContent()
    const content = sanitizeHtml(editorRef.value.innerHTML)
    emit('update:modelValue', content)
  }
}

const handleInput = useDebounceFn(handleInputInternal, 300)

function handleBlur() {
  isActive.value = false
  if (editorRef.value) {
    const rawContent = editorRef.value.innerHTML
    const sanitizedContent = sanitizeHtml(rawContent)
    if (rawContent !== sanitizedContent) {
      editorRef.value.innerHTML = sanitizedContent
      emit('update:modelValue', sanitizedContent)
    }
  }
}

function handleSelectionChange() {
  if (!isActive.value) return
  const selection = window.getSelection()
  if (selection && editorRef.value?.contains(selection.anchorNode)) {
    updateActiveFormats()
  }
}

function handleBeforeInput(e: InputEvent) {
  if (props.maxLength && characterCount.value >= props.maxLength) {
    if (e.inputType.includes('delete') || e.inputType.includes('cut')) return
    e.preventDefault()
  }
}

function execCommand(command: string, value?: string) {
  editorRef.value?.focus()
  nextTick(() => {
    const selection = window.getSelection()
    if (selection && editorRef.value?.contains(selection.anchorNode)) {
      if (command === 'formatBlock' && value) {
        const tagValue = value.startsWith('<') ? value : `<${value}>`
        document.execCommand(command, false, tagValue)
      }
      else {
        document.execCommand(command, false, value)
      }
      handleInput()
      updateActiveFormats()
    }
  })
}

function insertHTML(html: string) {
  editorRef.value?.focus()
  nextTick(() => {
    const selection = window.getSelection()
    if (selection && editorRef.value?.contains(selection.anchorNode)) {
      document.execCommand('insertHTML', false, html)
      handleInput()
    }
  })
}

function toggleColorPicker() {
  showColorPicker.value = !showColorPicker.value
}

function applyTextColor(color: string) {
  currentTextColor.value = color
  execCommand('foreColor', color)
  showColorPicker.value = false
}

function openLinkModal() {
  const selection = window.getSelection()
  if (!selection || !editorRef.value?.contains(selection.anchorNode)) return

  if (selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }

  linkText.value = selection.toString()
  linkUrl.value = ''
  showLinkModal.value = true
}

function insertLink() {
  if (!linkUrl.value) {
    showLinkModal.value = false
    return
  }

  editorRef.value?.focus()
  nextTick(() => {
    if (savedSelection.value) {
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(savedSelection.value)
    }

    const url = linkUrl.value.startsWith('http') ? linkUrl.value : `https://${linkUrl.value}`
    const text = linkText.value || url
    const linkHtml = `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeAttr(text)}</a>`
    insertHTML(linkHtml)

    linkUrl.value = ''
    linkText.value = ''
    savedSelection.value = null
    showLinkModal.value = false
  })
}

function openImageUpload() {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0 && editorRef.value?.contains(selection.anchorNode)) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) prepareImageUpload(file)
  }
  input.click()
}

function prepareImageUpload(file: File) {
  if (!file.type.startsWith('image/')) {
    toast.add({ severity: 'error', summary: 'Invalid File', detail: 'Please select an image file', life: 3000 })
    return
  }

  const maxSizeBytes = props.maxImageSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    toast.add({ severity: 'error', summary: 'File Too Large', detail: `Image size must be less than ${props.maxImageSize}MB`, life: 3000 })
    return
  }

  if (!savedSelection.value) {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.value?.contains(selection.anchorNode)) {
      savedSelection.value = selection.getRangeAt(0).cloneRange()
    }
  }

  imageFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  imageAlt.value = ''
  imageWidth.value = ''
  imageAlign.value = 'none'
  showImageModal.value = true
}

async function insertImage() {
  if (!imageFile.value) {
    showImageModal.value = false
    return
  }

  imageUploading.value = true

  const { upload } = useImageUpload()
  const { url, error: uploadError } = await upload(imageFile.value, props.bucket, props.storagePath, {
    maxSizeMB: props.maxImageSize,
  })

  imageUploading.value = false

  if (uploadError || !url) {
    toast.add({ severity: 'error', summary: 'Upload Failed', detail: uploadError || 'Unknown error', life: 3000 })
    return
  }

  editorRef.value?.focus()
  nextTick(() => {
    if (savedSelection.value) {
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(savedSelection.value)
    }

    const validAligns = ['none', 'left', 'center', 'right']
    const safeAlign = validAligns.includes(imageAlign.value) ? imageAlign.value : 'none'
    const alignClass = safeAlign !== 'none' ? ` class="img-${safeAlign}"` : ''
    const safeWidth = imageWidth.value.replace(/[^0-9%px]/g, '')
    const widthAttr = safeWidth ? ` width="${escapeAttr(safeWidth)}"` : ''
    const altAttr = imageAlt.value ? ` alt="${escapeAttr(imageAlt.value)}"` : ' alt=""'
    const imgHtml = `<img src="${escapeAttr(url)}"${altAttr}${widthAttr}${alignClass} />`
    insertHTML(imgHtml)

    imageFile.value = null
    imagePreview.value = ''
    imageAlt.value = ''
    imageWidth.value = ''
    imageAlign.value = 'none'
    savedSelection.value = null
    showImageModal.value = false
  })
}

function handleDragOver(e: DragEvent) {
  if (!props.allowImages) return
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  if (!props.allowImages) return
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (!props.allowImages) return

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const img = Array.from(files).find(f => f.type.startsWith('image/'))
    if (img) prepareImageUpload(img)
  }
}

function handlePaste(e: ClipboardEvent) {
  if (!props.allowImages) return
  const items = e.clipboardData?.items
  if (items) {
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) prepareImageUpload(file)
        break
      }
    }
  }
}
</script>

<template>
  <div class="rte">
    <!-- Toolbar -->
    <div class="rte-toolbar">
      <div class="rte-group">
        <button type="button" title="Bold (Ctrl+B)" class="rte-btn" :class="{ active: activeFormats.bold }" @click="execCommand('bold')">
          <strong>B</strong>
        </button>
        <button type="button" title="Italic (Ctrl+I)" class="rte-btn" :class="{ active: activeFormats.italic }" @click="execCommand('italic')">
          <em>I</em>
        </button>
        <button type="button" title="Underline (Ctrl+U)" class="rte-btn" :class="{ active: activeFormats.underline }" @click="execCommand('underline')">
          <span class="underline">U</span>
        </button>
        <button type="button" title="Strikethrough" class="rte-btn" :class="{ active: activeFormats.strikeThrough }" @click="execCommand('strikeThrough')">
          <span class="line-through">S</span>
        </button>

        <div class="relative">
          <button type="button" title="Text Color" class="rte-btn" :class="{ active: showColorPicker }" @click.stop="toggleColorPicker">
            <div class="flex flex-col items-center gap-px">
              <span class="font-semibold text-sm">A</span>
              <div class="w-4 h-[3px] rounded-sm" :style="{ backgroundColor: currentTextColor }" />
            </div>
          </button>
          <div v-if="showColorPicker" ref="colorPickerRef" class="rte-color-dropdown" @click.stop>
            <div class="grid grid-cols-10 gap-1">
              <button
                v-for="color in colorPalette"
                :key="color"
                type="button"
                class="w-5 h-5 rounded border border-slate-200 cursor-pointer hover:scale-110 hover:shadow transition-all flex items-center justify-center"
                :style="{ backgroundColor: color }"
                @click="applyTextColor(color)"
              >
                <i v-if="currentTextColor === color" class="pi pi-check text-[8px]" :style="{ color: color === '#ffffff' || color === '#f3f3f3' || color === '#efefef' ? '#000' : '#fff' }" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="rte-group">
        <button type="button" title="Heading 1" class="rte-btn" :class="{ active: currentBlockFormat === 'h1' }" @click="execCommand('formatBlock', 'h1')">H1</button>
        <button type="button" title="Heading 2" class="rte-btn" :class="{ active: currentBlockFormat === 'h2' }" @click="execCommand('formatBlock', 'h2')">H2</button>
        <button type="button" title="Heading 3" class="rte-btn" :class="{ active: currentBlockFormat === 'h3' }" @click="execCommand('formatBlock', 'h3')">H3</button>
        <button type="button" title="Paragraph" class="rte-btn" :class="{ active: currentBlockFormat === 'p' }" @click="execCommand('formatBlock', 'p')">P</button>
      </div>

      <div class="rte-group">
        <button type="button" title="Bullet List" class="rte-btn" @click="execCommand('insertUnorderedList')"><i class="pi pi-list" /></button>
        <button type="button" title="Numbered List" class="rte-btn" @click="execCommand('insertOrderedList')"><i class="pi pi-sort-numeric-down" /></button>
      </div>

      <div class="rte-group">
        <button type="button" title="Align Left" class="rte-btn" @click="execCommand('justifyLeft')"><i class="pi pi-align-left" /></button>
        <button type="button" title="Align Center" class="rte-btn" @click="execCommand('justifyCenter')"><i class="pi pi-align-center" /></button>
        <button type="button" title="Align Right" class="rte-btn" @click="execCommand('justifyRight')"><i class="pi pi-align-right" /></button>
      </div>

      <div class="rte-group">
        <button type="button" title="Insert Link" class="rte-btn" @click="openLinkModal"><i class="pi pi-link" /></button>
        <button v-if="allowImages" type="button" title="Insert Image" class="rte-btn" @click="openImageUpload"><i class="pi pi-image" /></button>
      </div>

      <div class="rte-group !border-r-0">
        <button type="button" title="Clear Formatting" class="rte-btn" @click="execCommand('removeFormat')"><i class="pi pi-eraser" /></button>
      </div>
    </div>

    <!-- Editor -->
    <div class="relative" :class="{ 'bg-blue-50': isDragging }">
      <div
        ref="editorRef"
        class="rte-content"
        :class="{ 'rte-active': isActive, 'rte-readonly': readonly }"
        :style="{ minHeight: `${height}px` }"
        :contenteditable="!readonly"
        :data-placeholder="placeholder"
        role="textbox"
        aria-multiline="true"
        :aria-readonly="readonly"
        @input="handleInput"
        @beforeinput="handleBeforeInput"
        @focus="isActive = true"
        @blur="handleBlur"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @paste="handlePaste"
      />

      <div v-if="isDragging" class="absolute inset-0 flex flex-col items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-500 pointer-events-none rounded-b-xl">
        <i class="pi pi-cloud-upload text-4xl text-blue-500 mb-2" />
        <p class="text-blue-600 font-semibold">Drop image here</p>
      </div>
    </div>

    <!-- Character Counter -->
    <div v-if="showCharCount" class="px-3 py-2 bg-slate-50 border-t border-slate-200 text-xs text-right" :class="isOverLimit ? 'text-red-600 font-semibold' : 'text-slate-500'">
      <template v-if="maxLength">
        {{ characterCount }} / {{ maxLength }}
        <span v-if="remainingChars !== null" class="text-slate-400"> ({{ remainingChars }} remaining)</span>
      </template>
      <template v-else>{{ characterCount }} characters</template>
    </div>

    <!-- Link Modal -->
    <Teleport to="body">
      <div v-if="showLinkModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showLinkModal = false">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 class="text-base font-semibold text-slate-900">Insert Link</h3>
            <button type="button" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400" @click="showLinkModal = false"><i class="pi pi-times text-sm" /></button>
          </div>
          <div class="px-5 py-4 space-y-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">URL</label>
              <input v-model="linkUrl" type="url" placeholder="https://example.com" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" @keyup.enter="insertLink">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Link Text (optional)</label>
              <input v-model="linkText" type="text" placeholder="Click here" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" @keyup.enter="insertLink">
            </div>
          </div>
          <div class="flex justify-end gap-2 px-5 py-4 border-t border-slate-200">
            <button type="button" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors" @click="showLinkModal = false">Cancel</button>
            <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors" @click="insertLink">Insert Link</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Image Modal -->
    <Teleport to="body">
      <div v-if="showImageModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showImageModal = false">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 class="text-base font-semibold text-slate-900">Insert Image</h3>
            <button type="button" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400" @click="showImageModal = false"><i class="pi pi-times text-sm" /></button>
          </div>
          <div class="px-5 py-4 space-y-3">
            <div v-if="imagePreview" class="text-center">
              <img :src="imagePreview" alt="Preview" class="max-w-full max-h-60 rounded-lg border border-slate-200 inline-block">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Alt Text (for accessibility)</label>
              <input v-model="imageAlt" type="text" placeholder="Describe the image" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Width (optional)</label>
                <input v-model="imageWidth" type="text" placeholder="auto" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Alignment</label>
                <select v-model="imageAlign" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="none">None</option>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 px-5 py-4 border-t border-slate-200">
            <button type="button" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors" @click="showImageModal = false">Cancel</button>
            <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50" :disabled="imageUploading" @click="insertImage">
              <i v-if="imageUploading" class="pi pi-spin pi-spinner mr-1" />
              {{ imageUploading ? 'Uploading...' : 'Insert Image' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.rte {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  background: white;
}

.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0.625rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.rte-group {
  display: flex;
  gap: 0.125rem;
  padding-right: 0.5rem;
  border-right: 1px solid #e2e8f0;
}

.rte-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all 0.15s;
}

.rte-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.rte-btn.active {
  background: #2563eb;
  color: white;
}

.rte-btn.active:hover {
  background: #1d4ed8;
}

.rte-color-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 0.625rem;
  z-index: 1000;
  min-width: 220px;
}

.rte-content {
  padding: 1rem;
  outline: none;
  overflow-y: auto;
  max-height: 600px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #1e293b;
}

.rte-content.rte-active {
  background: #fefefe;
}

.rte-content.rte-readonly {
  background: #f8fafc;
  cursor: not-allowed;
}

.rte-content:empty:before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}

.rte-content :deep(h1) { font-size: 1.75rem; font-weight: 700; margin: 0.75rem 0; }
.rte-content :deep(h2) { font-size: 1.375rem; font-weight: 600; margin: 0.625rem 0; }
.rte-content :deep(h3) { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; }
.rte-content :deep(p) { margin: 0.375rem 0; }
.rte-content :deep(ul) { margin: 0.5rem 0; padding-left: 1.5rem; list-style-type: disc; }
.rte-content :deep(ol) { margin: 0.5rem 0; padding-left: 1.5rem; list-style-type: decimal; }
.rte-content :deep(li) { display: list-item; margin: 0.25rem 0; }
.rte-content :deep(img) { max-width: 100%; height: auto; margin: 0.75rem 0; border-radius: 0.375rem; }
.rte-content :deep(img.img-left) { float: left; margin-right: 1rem; }
.rte-content :deep(img.img-right) { float: right; margin-left: 1rem; }
.rte-content :deep(img.img-center) { display: block; margin-left: auto; margin-right: auto; }
.rte-content :deep(a) { color: #2563eb; text-decoration: underline; }

@media (max-width: 640px) {
  .rte-toolbar { padding: 0.375rem; gap: 0.25rem; }
  .rte-group { padding-right: 0.25rem; }
}
</style>
