<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const isNew = id === 'new'

const { saveJob, fetchCategories } = useJobs()
const user = useSupabaseUser()
const toast = useToast()

useSeoMeta({ title: isNew ? 'New Job | Admin' : 'Edit Job | Admin', robots: 'noindex' })

const categories = ref<any[]>([])
const saving = ref(false)

const form = reactive({
  title: '',
  slug: '',
  company: '',
  company_logo_url: '',
  cover_image_url: '',
  company_website: '',
  category_id: null as number | null,
  description: '',
  requirements: '',
  benefits: '',
  location: '',
  is_remote: false,
  job_type: 'full_time',
  salary_min: null as number | null,
  salary_max: null as number | null,
  salary_currency: 'USD',
  is_salary_visible: true,
  apply_url: '',
  apply_email: '',
  application_deadline: null as string | null,
  status: 'draft',
  is_featured: false,
  alumni_posted: false,
})

const jobTypes = ['full_time', 'part_time', 'contract', 'internship', 'freelance'].map(t => ({
  label: t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
  value: t,
}))
const statuses = ['draft', 'published', 'closed', 'archived'].map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))

onMounted(async () => {
  const cats = await fetchCategories()
  categories.value = cats.map(c => ({ label: c.name, value: c.id }))

  if (!isNew) {
    const supabase = useSupabaseClient()
    const { data } = await supabase.from('jobs').select('*').eq('id', id).single()
    if (data) Object.assign(form, data)
  }
})

async function save() {
  if (!form.title || !form.company) {
    toast.add({ severity: 'warn', summary: 'Title and company are required', life: 3000 })
    return
  }
  saving.value = true
  const { slug: _slug, ...formData } = form
  const payload: any = { ...formData, posted_by: user.value?.id }
  if (!isNew) {
    payload.id = Number(id)
    payload.slug = form.slug
  }

  const result = await saveJob(payload)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Job saved!', life: 2000 })
    await navigateTo('/admin/jobs')
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
      <NuxtLink to="/admin/jobs" class="text-slate-500 hover:text-primary-600"><i class="pi pi-arrow-left" /></NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">{{ isNew ? 'New Job' : 'Edit Job' }}</h1>
    </div>

    <form class="space-y-4" @submit.prevent="save">
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
            <InputText v-model="form.title" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>
            <InputText v-model="form.company" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Company Logo</label>
            <SharedImageUpload
              v-model="form.company_logo_url"
              bucket="jobs"
              :path="isNew ? 'new' : id"
              aspect-ratio="1/1"
              compact
              placeholder="Logo"
            />
          </div>
          <div v-if="!isNew">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
            <p class="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">{{ form.slug }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
            <Select v-model="form.job_type" :options="jobTypes" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <Select v-model="form.status" :options="statuses" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <Select v-model="form.category_id" :options="categories" option-label="label" option-value="value" placeholder="Select" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <InputText v-model="form.location" class="w-full" />
          </div>
        </div>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <ToggleSwitch v-model="form.is_remote" />
            Remote
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <ToggleSwitch v-model="form.is_featured" />
            Featured
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <ToggleSwitch v-model="form.is_salary_visible" />
            Show Salary
          </label>
        </div>
        <div v-if="form.is_salary_visible" class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Min Salary</label>
            <InputText v-model="form.salary_min" type="number" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Max Salary</label>
            <InputText v-model="form.salary_max" type="number" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
            <InputText v-model="form.salary_currency" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Description (HTML)</label>
          <Textarea v-model="form.description" :rows="6" class="w-full font-mono text-xs" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Requirements (HTML)</label>
          <Textarea v-model="form.requirements" :rows="4" class="w-full font-mono text-xs" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Job Cover Image</label>
          <SharedImageUpload
            v-model="form.cover_image_url"
            bucket="jobs"
            :path="isNew ? 'new' : id"
            aspect-ratio="3/1"
            placeholder="Optional cover image for the job listing"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Apply URL</label>
            <InputText v-model="form.apply_url" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Apply Email</label>
            <InputText v-model="form.apply_email" type="email" class="w-full" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <Button type="submit" label="Save Job" icon="pi pi-save" :loading="saving" />
      </div>
    </form>
  </div>
</template>
