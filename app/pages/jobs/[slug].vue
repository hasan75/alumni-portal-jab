<script setup lang="ts">
import { formatSalary, formatJobType, formatDate } from '~/utils/formatters'

const { sanitizeHTML } = useSanitize()

definePageMeta({ layout: 'member', middleware: 'member-auth' })

const route = useRoute()
const slug = route.params.slug as string

const { fetchBySlug } = useJobs()
const { data: job, pending } = await useAsyncData(`job-${slug}`, () => fetchBySlug(slug))

if (!job.value && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Job not found' })
}

useSeoMeta({
  title: computed(() => `${job.value?.title || 'Job'} at ${job.value?.company || ''} | Alumni Portal`),
  description: computed(() => job.value?.description?.substring(0, 160) || ''),
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <NuxtLink to="/jobs" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4">
      <i class="pi pi-arrow-left text-xs" />
      Back to Jobs
    </NuxtLink>

    <div v-if="pending" class="bg-white border border-slate-200 rounded-xl h-96 animate-pulse" />

    <div v-else-if="job" class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="job.company_logo_url" :src="job.company_logo_url" :alt="job.company" class="w-full h-full object-contain">
            <span v-else class="text-2xl font-bold text-slate-400">{{ job.company.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-slate-900">{{ job.title }}</h1>
            <p class="text-slate-600 mt-1">
              <a v-if="job.company_website" :href="job.company_website" target="_blank" class="hover:text-primary-600">
                {{ job.company }}
              </a>
              <span v-else>{{ job.company }}</span>
            </p>

            <div class="flex flex-wrap gap-2 mt-3">
              <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{{ formatJobType(job.job_type) }}</span>
              <span v-if="job.is_remote" class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Remote</span>
              <span v-else-if="job.location" class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{{ job.location }}</span>
              <span v-if="job.is_salary_visible && (job.salary_min || job.salary_max)" class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {{ formatSalary(job.salary_min, job.salary_max, job.salary_currency) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-3">
          <a
            v-if="job.apply_url"
            :href="job.apply_url"
            target="_blank"
            class="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Apply Now
          </a>
          <a
            v-else-if="job.apply_email"
            :href="`mailto:${job.apply_email}`"
            class="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Apply via Email
          </a>
        </div>
      </div>

      <div class="p-6 space-y-5">
        <div v-if="job.description">
          <h2 class="font-semibold text-slate-900 mb-2">Description</h2>
          <div class="prose prose-sm max-w-none text-slate-600" v-html="sanitizeHTML(job.description)" />
        </div>
        <div v-if="job.requirements">
          <h2 class="font-semibold text-slate-900 mb-2">Requirements</h2>
          <div class="prose prose-sm max-w-none text-slate-600" v-html="sanitizeHTML(job.requirements)" />
        </div>
        <div v-if="job.benefits">
          <h2 class="font-semibold text-slate-900 mb-2">Benefits</h2>
          <div class="prose prose-sm max-w-none text-slate-600" v-html="sanitizeHTML(job.benefits)" />
        </div>
        <div v-if="job.application_deadline" class="text-sm text-slate-500">
          <i class="pi pi-clock mr-1" />
          Application deadline: {{ formatDate(job.application_deadline) }}
        </div>
      </div>
    </div>
  </div>
</template>
