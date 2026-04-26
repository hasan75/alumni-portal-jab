<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import { slugify } from '~/utils/formatters'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const isNew = id === 'new'

const { fetchAllForAdmin, saveEvent } = useEvents()
const { fetchBatches } = useMembers()
const user = useSupabaseUser()
const toast = useToast()

useSeoMeta({ title: isNew ? 'New Event | Admin' : 'Edit Event | Admin', robots: 'noindex' })

const batches = ref<{ label: string, value: number | null }[]>([])
const saving = ref(false)

const form = reactive({
  title: '',
  slug: '',
  description: '',
  content: '',
  start_datetime: null as Date | null,
  end_datetime: null as Date | null,
  location_name: '',
  location_address: '',
  is_online: false,
  online_meeting_url: '',
  event_type: 'general',
  batch_year: null as number | null,
  max_attendees: null as number | null,
  cover_image_url: '',
  status: 'draft',
  rsvp_enabled: true,
  rsvp_deadline: null as Date | null,
})

const eventTypes = ['reunion', 'seminar', 'networking', 'workshop', 'sports', 'cultural', 'general'].map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))
const statuses = ['draft', 'published', 'cancelled', 'completed'].map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))

onMounted(async () => {
  const batchList = await fetchBatches()
  batches.value = [
    { label: 'All Batches', value: null },
    ...batchList.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year })),
  ]

  if (!isNew) {
    const supabase = useSupabaseClient()
    const { data } = await supabase.from('events').select('*').eq('id', id).single()
    if (data) {
      Object.assign(form, {
        ...data,
        start_datetime: data.start_datetime ? new Date(data.start_datetime) : null,
        end_datetime: data.end_datetime ? new Date(data.end_datetime) : null,
        rsvp_deadline: data.rsvp_deadline ? new Date(data.rsvp_deadline) : null,
      })
    }
  }
})

watch(() => form.title, (title) => {
  if (isNew) form.slug = slugify(title)
})

async function save() {
  if (!form.title || !form.start_datetime) {
    toast.add({ severity: 'warn', summary: 'Title and start date are required', life: 3000 })
    return
  }
  saving.value = true
  const payload: any = {
    ...form,
    start_datetime: form.start_datetime?.toISOString(),
    end_datetime: form.end_datetime?.toISOString() || null,
    rsvp_deadline: form.rsvp_deadline?.toISOString() || null,
    created_by: user.value?.id,
  }
  if (!isNew) payload.id = Number(id)

  const result = await saveEvent(payload)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Event saved!', life: 2000 })
    if (isNew) navigateTo(`/admin/events/${result.data.id}`)
  }
  else {
    toast.add({ severity: 'error', summary: 'Save failed', detail: result.error, life: 3000 })
  }
  saving.value = false
}
</script>

<template>
  <div class="max-w-3xl space-y-4">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/events" class="text-slate-500 hover:text-primary-600"><i class="pi pi-arrow-left" /></NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">{{ isNew ? 'New Event' : 'Edit Event' }}</h1>
    </div>

    <form class="space-y-4" @submit.prevent="save">
      <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
          <InputText v-model="form.title" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Slug *</label>
          <InputText v-model="form.slug" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <Textarea v-model="form.description" :rows="3" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Start Date/Time *</label>
            <DatePicker v-model="form.start_datetime" show-time hour-format="12" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">End Date/Time</label>
            <DatePicker v-model="form.end_datetime" show-time hour-format="12" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Event Type</label>
            <Select v-model="form.event_type" :options="eventTypes" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <Select v-model="form.status" :options="statuses" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Batch (optional)</label>
            <Select v-model="form.batch_year" :options="batches" option-label="label" option-value="value" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Max Attendees</label>
            <InputText v-model="form.max_attendees" type="number" class="w-full" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <ToggleSwitch v-model="form.is_online" />
          <label class="text-sm text-slate-700">Online Event</label>
        </div>
        <div v-if="!form.is_online">
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Location Name</label>
          <InputText v-model="form.location_name" class="w-full" />
        </div>
        <div v-else>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Meeting URL</label>
          <InputText v-model="form.online_meeting_url" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>
          <InputText v-model="form.cover_image_url" class="w-full" />
        </div>
        <div class="flex items-center gap-3">
          <ToggleSwitch v-model="form.rsvp_enabled" />
          <label class="text-sm text-slate-700">Enable RSVP</label>
        </div>
      </div>

      <div class="flex justify-end">
        <Button type="submit" label="Save Event" icon="pi pi-save" :loading="saving" />
      </div>
    </form>
  </div>
</template>
