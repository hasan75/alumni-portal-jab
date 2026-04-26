<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import MemberCard from '~/components/member/MemberCard.vue'

definePageMeta({ layout: 'member', middleware: 'member-auth' })

useSeoMeta({ title: 'Alumni Directory', description: 'Browse and connect with alumni.' })

const { fetchDirectory, fetchBatches, totalCount } = useMembers()
const user = useSupabaseUser()

const search = ref('')
const selectedBatch = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(24)
const pageSizeOptions = [24, 36, 48, 60]

const batches = ref<{ label: string, value: number }[]>([])
const { data: batchList } = await useAsyncData('batches', fetchBatches)
if (batchList.value) {
  batches.value = [
    { label: 'All Batches', value: 0 },
    ...batchList.value.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year })),
  ]
}

const { data: members, refresh, pending } = await useAsyncData('directory', () =>
  fetchDirectory({
    search: search.value,
    batchYear: selectedBatch.value || undefined,
    page: currentPage.value,
    perPage: pageSize.value,
  }),
)

const debounceTimeout = ref<ReturnType<typeof setTimeout>>()
function onSearch() {
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    currentPage.value = 1
    refresh()
  }, 300)
}

watch(selectedBatch, () => {
  currentPage.value = 1
  refresh()
})
</script>

<template>
  <div>
    <!-- Section header -->
    <div class="mb-6 animate-fade-in-up">
      <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Connect</p>
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Alumni Directory</h1>
      <p class="text-slate-500 text-sm mt-1.5">
        {{ user ? 'Browse all active alumni' : 'Sign in to access full profiles and contact details' }}
      </p>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 flex-wrap mb-8 animate-fade-in-up delay-1">
      <div class="flex-1 min-w-64 relative">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10" />
        <InputText
          v-model="search"
          placeholder="Search by name or company..."
          class="w-full search-input"
          @input="onSearch"
        />
      </div>
      <Select
        v-model="selectedBatch"
        :options="batches"
        option-label="label"
        option-value="value"
        placeholder="All Batches"
        class="w-44"
      />
    </div>

    <!-- Skeletons -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="i in 8" :key="i"
        class="rounded-[20px] h-28 animate-pulse bg-white/40 border border-slate-200"
      />
    </div>

    <div v-else-if="members && members.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <MemberCard v-for="member in members" :key="member.id" :member="member" />
    </div>

    <!-- Pagination -->
    <div v-if="!pending && members && members.length > 0 && totalCount > pageSize" class="flex items-center justify-between pt-6 flex-wrap gap-3 animate-fade-in-up">
      <p class="text-sm text-slate-500">
        Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, totalCount) }} of {{ totalCount }}
      </p>
      <div class="flex items-center gap-2">
        <Select
          v-model="pageSize"
          :options="pageSizeOptions.map(v => ({ label: String(v), value: v }))"
          option-label="label"
          option-value="value"
          class="w-20"
          @change="currentPage = 1; refresh()"
        />
        <button
          class="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 bg-white/70 text-slate-600 border border-slate-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
          :disabled="currentPage <= 1"
          @click="currentPage--; refresh()"
        >
          <i class="pi pi-chevron-left text-xs mr-1" />Previous
        </button>
        <button
          class="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 bg-white/70 text-slate-600 border border-slate-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
          :disabled="currentPage * pageSize >= totalCount"
          @click="currentPage++; refresh()"
        >
          Next<i class="pi pi-chevron-right text-xs ml-1" />
        </button>
      </div>
    </div>

    <div v-if="!pending && (!members || members.length === 0)" class="glass-light relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float bg-primary-50 border border-primary-200">
          <i class="pi pi-users text-3xl text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">No alumni found</h3>
        <p class="text-slate-500 text-sm">Try a different search or batch filter.</p>
      </div>
    </div>

    <!-- Guest prompt -->
    <div v-if="!user" class="mt-8 glass-light relative overflow-hidden p-8 text-center animate-fade-in-up">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <h3 class="font-semibold text-slate-800 mb-2">Want to see full profiles?</h3>
        <p class="text-slate-500 text-sm mb-5">Sign in or register to access complete alumni profiles with contact information.</p>
        <div class="flex gap-3 justify-center">
          <NuxtLink to="/login" class="px-5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Sign In
          </NuxtLink>
          <NuxtLink to="/register" class="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-600/30">
            Register
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
