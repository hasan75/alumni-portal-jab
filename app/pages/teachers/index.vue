<script setup lang="ts">
import type { StaffMember } from '~/types/staff'
import StaffCard from '~/components/staff/StaffCard.vue'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Teachers & Staff | JAB Alumni',
  description: 'Meet the dedicated teachers and staff of Janata Adarsha Bidyapith, Palash, Narsingdi.',
  ogTitle: 'Teachers & Staff | JAB Alumni',
  ogDescription: 'Meet the dedicated teachers and staff of Janata Adarsha Bidyapith.',
})

const { fetchAllStaff } = useStaff()

const showFormer = ref(false)

const { data: allStaff, pending } = await useAsyncData('teachers', () => fetchAllStaff())

const designationOrder = [
  'headmaster',
  'assistant_headmaster',
  'senior_teacher',
  'assistant_teacher',
  'physical_education_teacher',
  'librarian',
  'office_assistant',
  'night_guard',
  'peon',
]

const sectionGroups = [
  { label: 'Leadership', designations: ['headmaster', 'assistant_headmaster'] },
  { label: 'Teaching Staff', designations: ['senior_teacher', 'assistant_teacher', 'physical_education_teacher'] },
  { label: 'Administrative Staff', designations: ['librarian', 'office_assistant'] },
  { label: 'Support Staff', designations: ['night_guard', 'peon'] },
]

const filteredStaff = computed(() => {
  if (!allStaff.value) return []
  if (showFormer.value) return allStaff.value
  return allStaff.value.filter(m => m.employment_status === 'current')
})

const grouped = computed(() => {
  return sectionGroups
    .map(group => ({
      label: group.label,
      members: group.designations
        .flatMap(d => filteredStaff.value.filter(m => m.designation === d))
    }))
    .filter(g => g.members.length > 0)
})

const totalCurrent = computed(() => allStaff.value?.filter(m => m.employment_status === 'current').length || 0)
const totalFormer = computed(() => allStaff.value?.filter(m => m.employment_status !== 'current').length || 0)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="gradient-brand relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="orb-primary absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-30 animate-float" />
        <div class="orb-secondary absolute -bottom-32 -left-20 w-80 h-80 rounded-full opacity-20 animate-float" style="animation-delay: 2s" />
      </div>

      <div class="relative max-w-6xl mx-auto px-4 py-20 text-center">
        <div class="animate-fade-in-up">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-6">
            <i class="pi pi-id-card text-white/80 text-sm" />
            <span class="text-sm font-medium text-white/80">Our School</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Teachers & Staff
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto">
            The honourable educators and staff who have dedicated their service to Janata Adarsha Bidyapith.
          </p>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-center gap-8 mt-10 animate-fade-in-up delay-2">
          <div class="glass-dark px-6 py-3 text-center">
            <p class="text-2xl font-bold text-white">{{ totalCurrent }}</p>
            <p class="text-xs text-white/50">Current Staff</p>
          </div>
          <div v-if="totalFormer > 0" class="glass-dark px-6 py-3 text-center">
            <p class="text-2xl font-bold text-white">{{ totalFormer }}</p>
            <p class="text-xs text-white/50">Former Staff</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <!-- Toggle -->
      <div v-if="totalFormer > 0" class="flex items-center justify-end mb-8 animate-fade-in-up">
        <label class="inline-flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
          <input
            v-model="showFormer"
            type="checkbox"
            class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Show former staff (retired, left, deceased)
        </label>
      </div>

      <!-- Loading skeleton -->
      <div v-if="pending" class="space-y-12">
        <div v-for="i in 3" :key="i">
          <div class="h-6 w-40 bg-slate-200 rounded-lg animate-pulse mb-6" />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="j in 4" :key="j" class="h-56 bg-slate-100 rounded-[20px] animate-pulse" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!allStaff || allStaff.length === 0" class="glass-light text-center py-20 px-8 animate-fade-in-up">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
        <div class="relative">
          <div class="w-16 h-16 rounded-2xl bg-primary-50 mx-auto mb-4 flex items-center justify-center">
            <i class="pi pi-users text-2xl text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-800 mb-1">No staff listed yet</h3>
          <p class="text-sm text-slate-500">Staff information will be available soon.</p>
        </div>
      </div>

      <!-- Grouped sections -->
      <div v-else class="space-y-12">
        <div
          v-for="(group, idx) in grouped"
          :key="group.label"
          class="animate-fade-in-up"
          :class="`delay-${Math.min(idx + 1, 6)}`"
        >
          <div class="mb-6">
            <h2 class="text-xl font-semibold tracking-tight text-slate-900">{{ group.label }}</h2>
            <div class="mt-1 h-0.5 w-12 bg-primary-500 rounded-full" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <StaffCard
              v-for="member in group.members"
              :key="member.id"
              :member="member"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
