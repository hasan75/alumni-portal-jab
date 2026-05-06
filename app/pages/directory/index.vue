<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import MemberCard from '~/components/member/MemberCard.vue'
import { INDUSTRY_OPTIONS, CURRENT_STATUS_OPTIONS } from '~/composables/useMembers'

definePageMeta({ layout: 'member', middleware: 'member-auth' })

useSeoMeta({ title: 'Alumni Directory', description: 'Browse and connect with alumni.' })

const { fetchDirectory, fetchBatches, totalCount } = useMembers()
const user = useSupabaseUser()

// ── Primary filters ──────────────────────────────────────────────────────────
const search = ref('')
const selectedBatch = ref<number | null>(null)
const selectedIndustry = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(24)
const pageSizeOptions = [24, 36, 48, 60]

// ── Advanced filters (collapsible) ───────────────────────────────────────────
const showAdvanced = ref(false)
const institutionSearch = ref('')
const fieldOfStudySearch = ref('')
const citySearch = ref('')

// ── Batches ──────────────────────────────────────────────────────────────────
const batches = ref<{ label: string, value: number }[]>([])
const { data: batchList } = await useAsyncData('batches', fetchBatches)
if (batchList.value) {
  batches.value = [
    { label: 'All Batches', value: 0 },
    ...batchList.value.map(b => ({ label: b.label || `Class of ${b.year}`, value: b.year })),
  ]
}

// ── Industry options: predefined list ────────────────────────────────────────
const industryOptions = computed(() => [
  { label: 'All Industries', value: '' },
  ...INDUSTRY_OPTIONS.map(i => ({ label: i, value: i })),
])

const statusOptions = computed(() => [
  { label: 'Any Status', value: '' },
  ...CURRENT_STATUS_OPTIONS.map(s => ({ label: s.label, value: s.value })),
])

// ── Data fetching ────────────────────────────────────────────────────────────
const { data: members, refresh, pending } = await useAsyncData('directory', () =>
  fetchDirectory({
    search: search.value || undefined,
    batchYear: selectedBatch.value || undefined,
    industry: selectedIndustry.value || undefined,
    currentStatus: selectedStatus.value || undefined,
    institution: institutionSearch.value || undefined,
    fieldOfStudy: fieldOfStudySearch.value || undefined,
    city: citySearch.value || undefined,
    page: currentPage.value,
    perPage: pageSize.value,
  }),
)

// ── Debounced text inputs ────────────────────────────────────────────────────
const debounceTimeout = ref<ReturnType<typeof setTimeout>>()
function onTextFilter() {
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    currentPage.value = 1
    refresh()
  }, 300)
}

// ── Dropdown filters (immediate) ─────────────────────────────────────────────
watch([selectedBatch, selectedIndustry, selectedStatus], () => {
  currentPage.value = 1
  refresh()
})

// ── Active filter chips ───────────────────────────────────────────────────────
const activeFilters = computed(() => {
  const chips: { label: string, clear: () => void }[] = []
  if (selectedBatch.value) {
    const b = batches.value.find(x => x.value === selectedBatch.value)
    chips.push({ label: b?.label ?? `Batch ${selectedBatch.value}`, clear: () => { selectedBatch.value = null } })
  }
  if (selectedIndustry.value)
    chips.push({ label: selectedIndustry.value, clear: () => { selectedIndustry.value = '' } })
  if (selectedStatus.value) {
    const s = CURRENT_STATUS_OPTIONS.find(x => x.value === selectedStatus.value)
    chips.push({ label: s?.label ?? selectedStatus.value, clear: () => { selectedStatus.value = '' } })
  }
  if (institutionSearch.value)
    chips.push({ label: `Institution: ${institutionSearch.value}`, clear: () => { institutionSearch.value = ''; onTextFilter() } })
  if (fieldOfStudySearch.value)
    chips.push({ label: `Field: ${fieldOfStudySearch.value}`, clear: () => { fieldOfStudySearch.value = ''; onTextFilter() } })
  if (citySearch.value)
    chips.push({ label: `City: ${citySearch.value}`, clear: () => { citySearch.value = ''; onTextFilter() } })
  return chips
})

function clearAllFilters() {
  search.value = ''
  selectedBatch.value = null
  selectedIndustry.value = ''
  selectedStatus.value = ''
  institutionSearch.value = ''
  fieldOfStudySearch.value = ''
  citySearch.value = ''
  currentPage.value = 1
  refresh()
}
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

    <!-- ── Filter panel ──────────────────────────────────────────────────── -->
    <div class="mb-6 space-y-3 animate-fade-in-up delay-1">

      <!-- Row 1: primary filters -->
      <div class="flex gap-3 flex-wrap">
        <!-- Search box -->
        <div class="flex-1 min-w-56 relative">
          <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10" />
          <InputText
            v-model="search"
            placeholder="Search by name, job title, or institution…"
            class="w-full search-input"
            @input="onTextFilter"
          />
        </div>

        <!-- Batch -->
        <Select
          v-model="selectedBatch"
          :options="batches"
          option-label="label"
          option-value="value"
          placeholder="All Batches"
          class="w-40"
        />

        <!-- Industry -->
        <Select
          v-model="selectedIndustry"
          :options="industryOptions"
          option-label="label"
          option-value="value"
          placeholder="All Industries"
          class="w-52"
        />

        <!-- Status -->
        <Select
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Any Status"
          class="w-44"
        />

        <!-- More filters toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          :class="showAdvanced
            ? 'bg-primary-50 text-primary-700 border-primary-200'
            : 'bg-white/70 text-slate-600 border-slate-200 hover:bg-white'"
          @click="showAdvanced = !showAdvanced"
        >
          <i class="pi pi-sliders-h text-xs" />
          More filters
          <i class="pi text-xs transition-transform duration-200" :class="showAdvanced ? 'pi-chevron-up' : 'pi-chevron-down'" />
        </button>
      </div>

      <!-- Row 2: advanced filters (collapsible) -->
      <Transition name="slide-down">
        <div v-if="showAdvanced" class="flex gap-3 flex-wrap p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <!-- Institution -->
          <div class="flex-1 min-w-48">
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Institution</label>
            <div class="relative">
              <i class="pi pi-building absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10" />
              <InputText
                v-model="institutionSearch"
                placeholder="e.g. BUET, Dhaka University…"
                class="w-full"
                style="padding-left: 2.25rem"
                @input="onTextFilter"
              />
            </div>
          </div>

          <!-- Field of Study -->
          <div class="flex-1 min-w-48">
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">Field of Study</label>
            <div class="relative">
              <i class="pi pi-book absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10" />
              <InputText
                v-model="fieldOfStudySearch"
                placeholder="e.g. CSE, Medicine, Architecture…"
                class="w-full"
                style="padding-left: 2.25rem"
                @input="onTextFilter"
              />
            </div>
          </div>

          <!-- City -->
          <div class="flex-1 min-w-36">
            <label class="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">City</label>
            <div class="relative">
              <i class="pi pi-map-marker absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10" />
              <InputText
                v-model="citySearch"
                placeholder="e.g. Dhaka, Chittagong…"
                class="w-full"
                style="padding-left: 2.25rem"
                @input="onTextFilter"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Active filter chips -->
      <div v-if="activeFilters.length > 0" class="flex items-center gap-2 flex-wrap">
        <span class="text-xs text-slate-500 font-medium">Filters:</span>
        <button
          v-for="chip in activeFilters"
          :key="chip.label"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors"
          @click="chip.clear()"
        >
          {{ chip.label }}
          <i class="pi pi-times text-[10px]" />
        </button>
        <button
          type="button"
          class="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          @click="clearAllFilters"
        >
          Clear all
        </button>
      </div>
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
        <span v-if="activeFilters.length > 0" class="text-primary-600 font-medium"> (filtered)</span>
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

    <!-- Empty state -->
    <div v-if="!pending && (!members || members.length === 0)" class="glass-light relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float bg-primary-50 border border-primary-200">
          <i class="pi pi-users text-3xl text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">No alumni found</h3>
        <p class="text-slate-500 text-sm mb-5">
          {{ activeFilters.length > 0 ? 'No results match your current filters.' : 'Try a different search term.' }}
        </p>
        <button
          v-if="activeFilters.length > 0"
          type="button"
          class="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-500 active:scale-95 transition-all"
          @click="clearAllFilters"
        >
          Clear filters
        </button>
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

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
