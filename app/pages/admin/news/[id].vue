<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import { extractStorageImagesFromHtml, deleteOrphanedImages } from '~/utils/htmlContent'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const isNew = id === 'new'

const { saveArticle, fetchCategories } = useNews()
const toast = useToast()

useSeoMeta({ title: isNew ? 'New Article | Admin' : 'Edit Article | Admin', robots: 'noindex' })

const categories = ref<any[]>([])
const saving = ref(false)
const initialContentImages = ref<string[]>([])

const form = reactive({
  title: '',
  slug: '',
  subtitle: '',
  excerpt: '',
  content: '',
  featured_image_url: '',
  category_id: null as number | null,
  author_name: '',
  author_bio: '',
  meta_title: '',
  meta_description: '',
  status: 'draft',
  is_featured: false,
  is_breaking: false,
  reading_time_minutes: null as number | null,
  published_at: null as string | null,
})

const statuses = ['draft', 'published', 'archived'].map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))

onMounted(async () => {
  const cats = await fetchCategories()
  categories.value = cats.map(c => ({ label: c.name, value: c.id }))

  if (!isNew) {
    const supabase = useSupabaseClient()
    const { data } = await supabase.from('articles').select('*').eq('id', id).single()
    if (data) {
      Object.assign(form, data)
      initialContentImages.value = extractStorageImagesFromHtml(data.content || '', 'news')
    }
  }
})

watch(() => form.status, (status) => {
  if (status === 'published' && !form.published_at) {
    form.published_at = new Date().toISOString()
  }
})

async function save() {
  if (!form.title) {
    toast.add({ severity: 'warn', summary: 'Title is required', life: 3000 })
    return
  }
  saving.value = true
  const { slug: _slug, ...formData } = form
  const payload: any = { ...formData }
  if (!isNew) {
    payload.id = Number(id)
    payload.slug = form.slug
  }

  const result = await saveArticle(payload)
  if (result.success) {
    const currentImages = extractStorageImagesFromHtml(form.content, 'news')
    await deleteOrphanedImages(initialContentImages.value, currentImages, 'news')
    toast.add({ severity: 'success', summary: 'Article saved!', life: 2000 })
    await navigateTo('/admin/news')
  }
  else {
    toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 })
  }
  saving.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/news" class="text-slate-500 hover:text-primary-600"><i class="pi pi-arrow-left" /></NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">{{ isNew ? 'New Article' : 'Edit Article' }}</h1>
    </div>

    <form class="space-y-4" @submit.prevent="save">
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
          <InputText v-model="form.title" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-if="!isNew">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
            <p class="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">{{ form.slug }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <Select v-model="form.status" :options="statuses" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <Select v-model="form.category_id" :options="categories" option-label="label" option-value="value" placeholder="Select category" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Author Name</label>
            <InputText v-model="form.author_name" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Excerpt</label>
          <Textarea v-model="form.excerpt" :rows="2" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
          <SharedRichTextEditor
            id="news-content"
            v-model="form.content"
            :height="350"
            :allow-images="true"
            bucket="news"
            :storage-path="isNew ? 'new' : id"
            placeholder="Write the article content..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Featured Image</label>
          <SharedImageUpload
            v-model="form.featured_image_url"
            bucket="news"
            :path="isNew ? 'new' : id"
            aspect-ratio="3/1"
            placeholder="Drop a featured image here or click to browse"
          />
        </div>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <ToggleSwitch v-model="form.is_featured" />
            Featured
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <ToggleSwitch v-model="form.is_breaking" />
            Breaking News
          </label>
        </div>
      </div>

      <div class="flex justify-end">
        <Button type="submit" label="Save Article" icon="pi pi-save" :loading="saving" />
      </div>
    </form>
  </div>
</template>
