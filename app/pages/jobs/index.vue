<script setup lang="ts">
import JobCard from '~/components/jobs/JobCard.vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'

definePageMeta({ layout: 'member', middleware: 'member-auth' })

useSeoMeta({ title: 'Job Board | Alumni Portal', description: 'Job opportunities posted by and for alumni.' })

const { fetchJobs, fetchCategories } = useJobs()

const search = ref('')
const selectedCategory = ref<number | null>(null)
const selectedType = ref<string | null>(null)
const remote = ref<boolean | null>(null)

const categories = ref<{ label: string, value: number | null }[]>([])
const catList = await fetchCategories()
categories.value = [
  { label: 'All Categories', value: null },
  ...catList.map(c => ({ label: c.name, value: c.id })),
]

const jobTypes = [
  { label: 'All Types', value: null },
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
]

const { data: jobs, refresh, pending } = await useAsyncData('jobs', () =>
  fetchJobs({
    search: search.value || undefined,
    categoryId: selectedCategory.value || undefined,
    jobType: selectedType.value || undefined,
    isRemote: remote.value ?? undefined,
  }),
)

const debounceTimeout = ref<ReturnType<typeof setTimeout>>()
function onSearch() {
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(refresh, 300)
}

watch([selectedCategory, selectedType, remote], refresh)
</script>

<template>
  <div>
    <!-- Section header -->
    <div class="mb-6 animate-fade-in-up">
      <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Opportunities</p>
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Job Board</h1>
      <p class="text-slate-500 text-sm mt-1.5">Opportunities posted by alumni and partner organizations</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-8 animate-fade-in-up delay-1">
      <div class="flex-1 min-w-52 relative">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10" />
        <InputText
          v-model="search"
          placeholder="Search jobs..."
          class="w-full search-input"
          @input="onSearch"
        />
      </div>
      <Select
        v-model="selectedCategory"
        :options="categories"
        option-label="label"
        option-value="value"
        placeholder="Category"
        class="w-44"
      />
      <Select
        v-model="selectedType"
        :options="jobTypes"
        option-label="label"
        option-value="value"
        placeholder="Job Type"
        class="w-36"
      />
      <button
        class="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
        :class="remote
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white'"
        @click="remote = remote ? null : true"
      >
        <i class="pi pi-globe text-xs" />
        Remote
      </button>
    </div>

    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 5" :key="i"
        class="rounded-[20px] h-24 animate-pulse bg-white/40 border border-slate-200"
      />
    </div>

    <div v-else-if="jobs && jobs.length > 0" class="space-y-4">
      <JobCard v-for="job in jobs" :key="job.id" :job="job" />
    </div>

    <div v-else class="glass-light relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float bg-primary-50 border border-primary-200">
          <i class="pi pi-briefcase text-3xl text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">No jobs found</h3>
        <p class="text-slate-500 text-sm">Try adjusting your filters or check back later.</p>
      </div>
    </div>
  </div>
</template>
