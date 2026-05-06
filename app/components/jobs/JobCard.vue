<script setup lang="ts">
import type { Job } from '~/types/job'
import { formatSalary, formatJobType } from '~/utils/formatters'

defineProps<{
  job: Job
}>()
</script>

<template>
  <NuxtLink
    :to="`/jobs/${job.slug}`"
    class="glass-light relative overflow-hidden p-5 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

    <div class="relative flex gap-4">
      <!-- Company logo -->
      <div class="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center overflow-hidden bg-slate-100 border border-slate-200">
        <img
          v-if="job.company_logo_url"
          :src="job.company_logo_url"
          :alt="job.company"
          class="w-full h-full object-contain"
        >
        <span v-else class="text-lg font-bold text-slate-400">
          {{ job.company.charAt(0) }}
        </span>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">{{ job.title }}</h3>
            <p class="text-sm text-slate-500 mt-0.5">{{ job.company }}</p>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span v-if="job.is_featured" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Featured
            </span>
            <span v-if="job.alumni_posted" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Alumni
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-3">
          <span class="inline-flex items-center gap-1 text-xs text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            <i class="pi pi-briefcase text-[10px]" />
            {{ formatJobType(job.job_type) }}
          </span>
          <span v-if="job.is_remote" class="inline-flex items-center gap-1 text-xs text-green-700 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200">
            <i class="pi pi-globe text-[10px]" />
            Remote
          </span>
          <span v-else-if="job.location" class="inline-flex items-center gap-1 text-xs text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            <i class="pi pi-map-marker text-[10px]" />
            {{ job.location }}
          </span>
          <span v-if="job.is_salary_visible && (job.salary_min || job.salary_max)" class="inline-flex items-center gap-1 text-xs text-slate-600 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            {{ formatSalary(job.salary_min, job.salary_max, job.salary_currency) }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
