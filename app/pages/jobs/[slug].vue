<script setup lang="ts">
import { formatSalary, formatJobType, formatDate } from '~/utils/formatters'
import type { Job } from '~/types/job'

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function lightboxPrev() {
  if (!job.value) return
  lightboxIndex.value = (lightboxIndex.value - 1 + job.value.additional_photos.length) % job.value.additional_photos.length
}

function lightboxNext() {
  if (!job.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % job.value.additional_photos.length
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') lightboxPrev()
    if (e.key === 'ArrowRight') lightboxNext()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

const { sanitizeHTML } = useSanitize()

definePageMeta({ layout: 'member', middleware: 'member-auth' })

const route = useRoute()
const slug = route.params.slug as string

const headers = useRequestHeaders(['cookie'])
const { data: job, pending } = await useAsyncData(
  `job-${slug}`,
  () => $fetch<Job>(`/api/jobs/${slug}`, { headers }),
)

if (!job.value && !pending.value) {
  throw createError({ statusCode: 404, fatal: true, statusMessage: 'Job not found' })
}

useSeoMeta({
  title: computed(() => `${job.value?.title || 'Job'} at ${job.value?.company || ''} | JAB Alumni`),
  description: computed(() => job.value?.description?.substring(0, 160) || ''),
})
</script>

<template>
  <div class="animate-fade-in-up">
    <!-- Top nav row -->
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <NuxtLink
        to="/jobs"
        class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 glass-sm px-4 py-2 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
      >
        <i class="pi pi-arrow-left text-xs" />
        Back to Jobs
      </NuxtLink>
    </div>

    <!-- Skeleton -->
    <div v-if="pending" class="space-y-6">
      <div class="glass-light rounded-[20px] overflow-hidden animate-pulse">
        <div class="h-44 bg-slate-200/60" />
        <div class="p-6 space-y-3">
          <div class="flex gap-4">
            <div class="w-16 h-16 rounded-xl bg-slate-200/80 shrink-0 -mt-12" />
            <div class="flex-1 space-y-2 pt-2">
              <div class="h-5 bg-slate-200/80 rounded-full w-2/3" />
              <div class="h-4 bg-slate-200/60 rounded-full w-1/3" />
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <div class="h-6 w-20 bg-slate-200/60 rounded-full" />
            <div class="h-6 w-16 bg-slate-200/60 rounded-full" />
            <div class="h-6 w-24 bg-slate-200/60 rounded-full" />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="glass-light rounded-[20px] h-64 animate-pulse" />
          <div class="glass-light rounded-[20px] h-48 animate-pulse" />
        </div>
        <div class="glass-light rounded-[20px] h-80 animate-pulse" />
      </div>
    </div>

    <div v-else-if="job">
      <!-- Hero card -->
      <div class="glass-light relative overflow-hidden rounded-[20px] mb-6">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/60 via-transparent to-transparent z-10" />

        <!-- Cover image / gradient banner -->
        <div class="relative h-44 overflow-hidden">
          <img
            v-if="job.cover_image_url"
            :src="job.cover_image_url"
            :alt="job.title"
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full gradient-brand" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          <!-- Badges on cover -->
          <div class="absolute top-3 right-3 flex items-center gap-2 z-20">
            <span
              v-if="job.is_featured"
              class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 backdrop-blur-sm"
            >
              ★ Featured
            </span>
            <span
              v-if="job.alumni_posted"
              class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/90 text-white backdrop-blur-sm"
            >
              Alumni Posted
            </span>
          </div>
        </div>

        <!-- Company identity -->
        <div class="relative z-10 px-6 pb-6">
          <!-- Logo lifts out of cover -->
          <div class="flex items-end gap-4 -mt-8 mb-4">
            <div class="w-16 h-16 rounded-xl bg-white border-2 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0 ring-4 ring-white/50">
              <img
                v-if="job.company_logo_url"
                :src="job.company_logo_url"
                :alt="job.company"
                class="w-full h-full object-contain"
              >
              <span v-else class="text-2xl font-bold text-primary-500">{{ job.company.charAt(0) }}</span>
            </div>
          </div>

          <h1 class="text-2xl font-bold tracking-tight text-slate-900 leading-tight">{{ job.title }}</h1>

          <p class="text-slate-500 mt-1 text-sm font-medium">
            <a
              v-if="safeUrl(job.company_website)"
              :href="safeUrl(job.company_website)"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-600 transition-colors inline-flex items-center gap-1"
            >
              {{ job.company }}
              <i class="pi pi-external-link text-[10px] opacity-60" />
            </a>
            <span v-else>{{ job.company }}</span>
          </p>

          <!-- Meta badges -->
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <i class="pi pi-briefcase text-[10px]" />
              {{ formatJobType(job.job_type) }}
            </span>
            <span v-if="job.is_remote" class="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 px-3 py-1 rounded-full bg-green-50 border border-green-200">
              <i class="pi pi-globe text-[10px]" />
              Remote
            </span>
            <span v-else-if="job.location" class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <i class="pi pi-map-marker text-[10px]" />
              {{ job.location }}
            </span>
            <span
              v-if="job.is_salary_visible && (job.salary_min || job.salary_max)"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 px-3 py-1 rounded-full bg-primary-50 border border-primary-200"
            >
              {{ formatSalary(job.salary_min, job.salary_max, job.salary_currency) }}
            </span>
            <span v-if="job.category" class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <span v-if="job.category.icon" class="text-base leading-none">{{ job.category.icon }}</span>
              {{ job.category.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Description -->
          <div v-if="job.description" class="glass-light relative overflow-hidden rounded-[20px] p-6 animate-fade-in-up delay-1">
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
            <div class="relative">
              <p class="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">Description</p>
              <div class="prose prose-sm max-w-none text-slate-700 leading-relaxed" v-html="sanitizeHTML(job.description)" />
            </div>
          </div>

          <!-- Requirements -->
          <div v-if="job.requirements" class="glass-light relative overflow-hidden rounded-[20px] p-6 animate-fade-in-up delay-2">
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
            <div class="relative">
              <p class="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">Requirements</p>
              <div class="prose prose-sm max-w-none text-slate-700 leading-relaxed" v-html="sanitizeHTML(job.requirements)" />
            </div>
          </div>

          <!-- Benefits -->
          <div v-if="job.benefits" class="glass-light relative overflow-hidden rounded-[20px] p-6 animate-fade-in-up delay-3">
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
            <div class="relative">
              <p class="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">Benefits</p>
              <div class="prose prose-sm max-w-none text-slate-700 leading-relaxed" v-html="sanitizeHTML(job.benefits)" />
            </div>
          </div>

          <!-- Additional Photos gallery -->
          <div v-if="job.additional_photos?.length" class="glass-light relative overflow-hidden rounded-[20px] p-6 animate-fade-in-up delay-4">
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
            <div class="relative">
              <p class="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-4">Photos</p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  v-for="(url, i) in job.additional_photos"
                  :key="url"
                  type="button"
                  class="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] transition-all duration-200"
                  style="aspect-ratio:4/3;"
                  @click="openLightbox(i)"
                >
                  <img :src="url" :alt="`Photo ${i + 1}`" class="h-full w-full object-cover" />
                  <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div class="rounded-full bg-white/20 p-2 backdrop-blur-sm border border-white/40">
                      <Icon name="heroicons:arrows-pointing-out" class="h-5 w-5 text-white" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Apply CTA — sticky -->
          <div class="glass-light relative overflow-hidden rounded-[20px] p-6 animate-fade-in-up delay-1 sticky top-24">
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/60 via-transparent to-transparent" />
            <div class="relative space-y-5">
              <!-- Apply button -->
              <div>
                <p class="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">Apply for this role</p>
                <a
                  v-if="safeUrl(job.apply_url)"
                  :href="safeUrl(job.apply_url)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 hover:bg-primary-500 active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/20 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  <i class="pi pi-external-link text-xs" />
                  Apply Now
                </a>
                <a
                  v-else-if="job.apply_email"
                  :href="`mailto:${job.apply_email}`"
                  class="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 hover:bg-primary-500 active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/20 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  <i class="pi pi-envelope text-xs" />
                  Apply via Email
                </a>
                <div v-else class="text-sm text-slate-400 text-center py-2">
                  Contact the company directly
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-slate-200/60" />

              <!-- Details list -->
              <div class="space-y-4">
                <!-- Job Type -->
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                    <i class="pi pi-briefcase text-xs text-primary-500" />
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Job Type</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ formatJobType(job.job_type) }}</p>
                  </div>
                </div>

                <!-- Location -->
                <div v-if="job.is_remote || job.location" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                    <i :class="job.is_remote ? 'pi pi-globe' : 'pi pi-map-marker'" class="text-xs text-green-600" />
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Location</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ job.is_remote ? 'Remote' : job.location }}</p>
                  </div>
                </div>

                <!-- Salary -->
                <div v-if="job.is_salary_visible && (job.salary_min || job.salary_max)" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <i class="pi pi-wallet text-xs text-blue-500" />
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Salary</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ formatSalary(job.salary_min, job.salary_max, job.salary_currency) }}</p>
                  </div>
                </div>

                <!-- Deadline -->
                <div v-if="job.application_deadline" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    <i class="pi pi-clock text-xs text-rose-500" />
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Deadline</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ formatDate(job.application_deadline) }}</p>
                  </div>
                </div>

                <!-- Posted -->
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <i class="pi pi-calendar text-xs text-slate-400" />
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Posted</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ formatDate(job.created_at) }}</p>
                  </div>
                </div>

                <!-- Views -->
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <i class="pi pi-eye text-xs text-slate-400" />
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Views</p>
                    <p class="text-sm font-semibold text-slate-800 mt-0.5">{{ job.view_count.toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="lightboxOpen && job?.additional_photos?.length"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background:rgba(0,0,0,0.88); backdrop-filter:blur(12px);"
        @click.self="closeLightbox"
      >
        <!-- Close -->
        <button
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 active:scale-90"
          @click="closeLightbox"
        >
          <Icon name="heroicons:x-mark" class="h-6 w-6" />
        </button>

        <!-- Counter -->
        <div class="absolute left-1/2 top-4 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white/70" style="background:rgba(255,255,255,0.08);">
          {{ lightboxIndex + 1 }} / {{ job.additional_photos.length }}
        </div>

        <!-- Prev -->
        <button
          v-if="job.additional_photos.length > 1"
          class="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 active:scale-90"
          @click="lightboxPrev"
        >
          <Icon name="heroicons:chevron-left" class="h-6 w-6" />
        </button>

        <!-- Image -->
        <div class="mx-16 max-h-[85vh] max-w-4xl w-full flex items-center justify-center">
          <img
            :src="job.additional_photos[lightboxIndex]"
            :alt="`Photo ${lightboxIndex + 1}`"
            class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>

        <!-- Next -->
        <button
          v-if="job.additional_photos.length > 1"
          class="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 active:scale-90"
          @click="lightboxNext"
        >
          <Icon name="heroicons:chevron-right" class="h-6 w-6" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
