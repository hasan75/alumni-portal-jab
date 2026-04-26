<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import MemberStatusBadge from '~/components/admin/members/MemberStatusBadge.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string

const { fetchProfile, updateMember, approveMembers, rejectMember, suspendMember, fetchBatches } = useMembers()
const toast = useToast()
const confirm = useConfirm()

const profile = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const batches = ref<{ label: string, value: number }[]>([])

onMounted(async () => {
  loading.value = true
  const [p, batchList] = await Promise.all([
    fetchProfile(id),
    fetchBatches(),
  ])
  profile.value = p
  batches.value = batchList.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year }))
  loading.value = false
})

useSeoMeta({
  title: computed(() => `${profile.value?.full_name || 'Member'} | Admin`),
  robots: 'noindex',
})

const form = reactive({
  full_name: '',
  display_name: '',
  email: '',
  batch_year: null as number | null,
  department: '',
  degree: '',
  city: '',
  country: '',
  current_job_title: '',
  current_company: '',
  bio: '',
  status: 'pending' as string,
  is_verified: false,
})

watch(profile, (p) => {
  if (p) Object.assign(form, { ...p })
}, { immediate: true })

async function save() {
  saving.value = true
  const result = await updateMember(id, form)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Member updated', life: 2000 })
    await navigateTo('/admin/members')
  }
  else {
    toast.add({ severity: 'error', summary: 'Update failed', detail: result.error, life: 3000 })
  }
  saving.value = false
}

async function approve() {
  confirm.require({
    message: `Approve ${profile.value?.full_name || 'this member'}?`,
    header: 'Confirm Approval',
    icon: 'pi pi-check-circle',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const result = await approveMembers([id])
      if (result.success) {
        profile.value.status = 'active'
        form.status = 'active'
        toast.add({ severity: 'success', summary: 'Member approved!', life: 2000 })
      }
    },
  })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/members" class="text-slate-500 hover:text-primary-600">
        <i class="pi pi-arrow-left" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">Edit Member</h1>
      <MemberStatusBadge v-if="profile" :status="profile.status" />
    </div>

    <div v-if="loading" class="bg-white border border-slate-200 rounded-xl h-64 animate-pulse" />

    <template v-else-if="profile">
      <!-- Quick actions for pending -->
      <Message v-if="profile.status === 'pending'" severity="warn" :closable="false">
        This member is awaiting approval.
        <Button label="Approve Now" size="small" severity="success" class="ml-3" @click="approve" />
      </Message>

      <form class="space-y-4" @submit.prevent="save">
        <div class="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <InputText v-model="form.full_name" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
            <InputText v-model="form.display_name" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <InputText v-model="form.email" type="email" class="w-full" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Graduation Batch</label>
            <Select v-model="form.batch_year" :options="batches" option-label="label" option-value="value" placeholder="Select batch" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
            <InputText v-model="form.department" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
            <InputText v-model="form.degree" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
            <InputText v-model="form.current_job_title" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
            <InputText v-model="form.current_company" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
            <InputText v-model="form.city" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
            <InputText v-model="form.country" class="w-full" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <Textarea v-model="form.bio" :rows="3" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <Select
              v-model="form.status"
              :options="[
                { label: 'Pending', value: 'pending' },
                { label: 'Active', value: 'active' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Rejected', value: 'rejected' },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <Button type="submit" label="Save Changes" icon="pi pi-save" :loading="saving" />
        </div>
      </form>
    </template>
  </div>
</template>
