<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'App Settings | Admin', robots: 'noindex' })

const { config, fetchConfig, updateMultiple, appName } = useSiteConfig()
const toast = useToast()

const form = reactive({
  app_name: '',
  institution_name: '',
  primary_color: '#2563EB',
  logo_url: '',
  tagline: '',
  contact_email: '',
  contact_phone: '',
  website_url: '',
  founded_year: '',
})

const saving = ref(false)

onMounted(async () => {
  await fetchConfig()
  Object.assign(form, {
    app_name: config.value.app_name || '',
    institution_name: config.value.institution_name || '',
    primary_color: config.value.primary_color || '#2563EB',
    logo_url: config.value.logo_url || '',
    tagline: config.value.tagline || '',
    contact_email: config.value.contact_email || '',
    contact_phone: config.value.contact_phone || '',
    website_url: config.value.website_url || '',
    founded_year: config.value.founded_year || '',
  })
})

async function save() {
  saving.value = true
  const result = await updateMultiple({
    app_name: form.app_name,
    institution_name: form.institution_name,
    primary_color: form.primary_color,
    logo_url: form.logo_url,
    tagline: form.tagline,
    contact_email: form.contact_email,
    contact_phone: form.contact_phone,
    website_url: form.website_url,
    founded_year: form.founded_year,
  })
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Settings saved!', detail: 'Changes will reflect throughout the site.', life: 3000 })
  }
  else {
    toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 })
  }
  saving.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-bold text-slate-900">App Settings</h1>
      <p class="text-slate-500 text-sm">Configure your alumni portal branding and contact information</p>
    </div>

    <form class="space-y-4" @submit.prevent="save">
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h2 class="font-semibold text-slate-900">Branding</h2>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Portal Name</label>
          <InputText v-model="form.app_name" class="w-full" placeholder="JAB Alumni" />
          <p class="text-xs text-slate-500 mt-1">Shown in the header and browser title</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Institution Name</label>
          <InputText v-model="form.institution_name" class="w-full" placeholder="Your University Name" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
          <InputText v-model="form.tagline" class="w-full" placeholder="Connecting alumni across generations" />
        </div>

        <div class="opacity-50">
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="block text-sm font-medium text-slate-700">Primary Color</label>
            <i class="pi pi-lock text-[10px] text-slate-400" />
          </div>
          <div class="flex items-center gap-3 pointer-events-none">
            <input v-model="form.primary_color" type="color" class="w-12 h-10 rounded border border-slate-200 cursor-not-allowed" disabled>
            <InputText v-model="form.primary_color" class="flex-1" placeholder="#2563EB" disabled />
          </div>
          <p class="text-xs text-slate-400 mt-1"><i class="pi pi-info-circle text-[10px]" /> This field is locked and managed via theme configuration</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">School Logo</label>
          <SharedImageUpload
            v-model="form.logo_url"
            bucket="news"
            path="branding"
            :max-size-mb="2"
            aspect-ratio="1/1"
            placeholder="Upload school logo"
            compact
          />
          <p class="text-xs text-slate-500 mt-1">Displayed in emails sent to members</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h2 class="font-semibold text-slate-900">Contact & Details</h2>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Contact Email</label>
            <InputText v-model="form.contact_email" type="email" class="w-full" placeholder="info@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Contact Phone</label>
            <InputText v-model="form.contact_phone" class="w-full" placeholder="+880 1XXX-XXXXXX" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>
            <InputText v-model="form.website_url" class="w-full" placeholder="https://..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Founded Year</label>
            <InputText v-model="form.founded_year" type="number" class="w-full" placeholder="2000" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <Button type="submit" label="Save Settings" icon="pi pi-save" :loading="saving" />
      </div>
    </form>
  </div>
</template>
