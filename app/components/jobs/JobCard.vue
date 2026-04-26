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
    class="glass relative overflow-hidden p-5 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

    <div class="relative flex gap-4">
      <!-- Company logo -->
      <div class="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center overflow-hidden" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);">
        <img
          v-if="job.company_logo_url"
          :src="job.company_logo_url"
          :alt="job.company"
          class="w-full h-full object-contain"
        >
        <span v-else class="text-lg font-bold text-white/60">
          {{ job.company.charAt(0) }}
        </span>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold text-white leading-snug group-hover:text-white transition-colors">{{ job.title }}</h3>
            <p class="text-sm text-white/60 mt-0.5">{{ job.company }}</p>
          </div>
          <span v-if="job.is_featured" class="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full" style="background:rgba(251,191,36,0.2);color:#fcd34d;border:1px solid rgba(251,191,36,0.3);">
            Featured
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mt-3">
          <span class="inline-flex items-center gap-1 text-xs text-white/60 px-2.5 py-0.5 rounded-full" style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.15);">
            <i class="pi pi-briefcase text-[10px]" />
            {{ formatJobType(job.job_type) }}
          </span>
          <span v-if="job.is_remote" class="inline-flex items-center gap-1 text-xs text-green-300 px-2.5 py-0.5 rounded-full" style="background:rgba(52,199,89,0.15);border:1px solid rgba(52,199,89,0.25);">
            <i class="pi pi-globe text-[10px]" />
            Remote
          </span>
          <span v-else-if="job.location" class="inline-flex items-center gap-1 text-xs text-white/60 px-2.5 py-0.5 rounded-full" style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.15);">
            <i class="pi pi-map-marker text-[10px]" />
            {{ job.location }}
          </span>
          <span v-if="job.is_salary_visible && (job.salary_min || job.salary_max)" class="inline-flex items-center gap-1 text-xs text-white/70 px-2.5 py-0.5 rounded-full" style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.15);">
            {{ formatSalary(job.salary_min, job.salary_max, job.salary_currency) }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

