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

const { saveStaffMember } = useStaff()
const toast = useToast()

useSeoMeta({ title: isNew ? 'New Staff | Admin' : 'Edit Staff | Admin', robots: 'noindex' })

const saving = ref(false)

const form = reactive({
  name: '',
  designation: 'assistant_teacher',
  employment_status: 'current',
  photo_url: '' as string | null,
  phone: '',
  subject: '',
  joining_year: null as number | null,
  sort_order: 0,
  is_featured: false,
  bio: '',
})

const designations = [
  { label: 'Headmaster', value: 'headmaster' },
  { label: 'Assistant Headmaster', value: 'assistant_headmaster' },
  { label: 'Senior Teacher', value: 'senior_teacher' },
  { label: 'Assistant Teacher', value: 'assistant_teacher' },
  { label: 'Physical Education Teacher', value: 'physical_education_teacher' },
  { label: 'Librarian', value: 'librarian' },
  { label: 'Office Assistant', value: 'office_assistant' },
  { label: 'Night Guard', value: 'night_guard' },
  { label: 'Peon / Attendant', value: 'peon' },
]

const statuses = [
  { label: 'Current', value: 'current' },
  { label: 'Left Job', value: 'left' },
  { label: 'Retired', value: 'retired' },
  { label: 'Deceased', value: 'deceased' },
]

onMounted(async () => {
  if (!isNew) {
    const supabase = useSupabaseClient()
    const { data } = await supabase.from('staff_members').select('*').eq('id', id).single() as { data: any }
    if (data) {
      Object.assign(form, {
        name: data.name,
        designation: data.designation,
        employment_status: data.employment_status,
        photo_url: data.photo_url,
        phone: data.phone || '',
        subject: data.subject || '',
        joining_year: data.joining_year,
        sort_order: data.sort_order,
        is_featured: data.is_featured,
        bio: data.bio || '',
      })
    }
  }
})

async function save() {
  if (!form.name.trim()) {
    toast.add({ severity: 'warn', summary: 'Name is required', life: 3000 })
    return
  }
  if (!form.designation) {
    toast.add({ severity: 'warn', summary: 'Designation is required', life: 3000 })
    return
  }

  saving.value = true

  const payload: any = {
    name: form.name.trim(),
    designation: form.designation,
    employment_status: form.employment_status,
    photo_url: form.photo_url || null,
    phone: form.phone.trim() || null,
    subject: form.subject.trim() || null,
    joining_year: form.joining_year,
    sort_order: form.sort_order,
    is_featured: form.is_featured,
    bio: form.bio.trim() || null,
  }

  if (!isNew) payload.id = Number(id)

  const result = await saveStaffMember(payload)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Staff member saved!', life: 2000 })
    await navigateTo('/admin/staff')
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
      <NuxtLink to="/admin/staff" class="text-slate-500 hover:text-primary-600"><i class="pi pi-arrow-left" /></NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">{{ isNew ? 'Add Staff Member' : 'Edit Staff Member' }}</h1>
    </div>

    <form class="space-y-4" @submit.prevent="save">
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <!-- Photo -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Photo</label>
          <SharedImageUpload
            v-model="form.photo_url"
            bucket="staff"
            :path="isNew ? 'new' : id"
            aspect-ratio="1/1"
            compact
            placeholder="Photo"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
            <InputText v-model="form.name" class="w-full" placeholder="Full name" />
          </div>
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Designation *</label>
            <Select v-model="form.designation" :options="designations" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Employment Status</label>
            <Select v-model="form.employment_status" :options="statuses" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
            <InputText v-model="form.subject" class="w-full" placeholder="e.g., Mathematics" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
            <InputText v-model="form.phone" class="w-full" placeholder="Phone number" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Joining Year</label>
            <input v-model.number="form.joining_year" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., 2010" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Sort Order</label>
            <input v-model.number="form.sort_order" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>

        <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <ToggleSwitch v-model="form.is_featured" />
          Featured on homepage
        </label>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
          <Textarea v-model="form.bio" class="w-full" rows="3" placeholder="Short bio (optional)" />
        </div>
      </div>

      <div class="flex justify-end">
        <Button type="submit" label="Save Staff Member" icon="pi pi-save" :loading="saving" />
      </div>
    </form>
  </div>
</template>
