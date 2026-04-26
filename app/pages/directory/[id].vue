<script setup lang="ts">
import MemberProfileHeader from '~/components/member/MemberProfileHeader.vue'

const route = useRoute()
const id = route.params.id as string

definePageMeta({ layout: 'member', middleware: 'member-auth' })

const { fetchProfileWithDetails } = useMembers()
const user = useSupabaseUser()

const { data, pending, error } = await useAsyncData(`profile-${id}`, () =>
  fetchProfileWithDetails(id),
)

if (!data.value && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
}

useSeoMeta({
  title: computed(() => `${data.value?.profile.display_name || data.value?.profile.full_name || 'Profile'} | Alumni Portal`),
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-6 px-4">
    <NuxtLink to="/directory" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4 transition-colors">
      <i class="pi pi-arrow-left text-xs" />
      Back to Directory
    </NuxtLink>

    <div v-if="pending" class="space-y-4">
      <div class="bg-white border border-slate-200 rounded-xl h-64 animate-pulse" />
    </div>

    <div v-else-if="data" class="space-y-4">
      <MemberProfileHeader
        :profile="data.profile"
        :is-own-profile="user?.id === data.profile.id"
      />

      <!-- Contact info (only shown if privacy allows) -->
      <div v-if="(data.profile.show_email && data.profile.email) || (data.profile.show_phone && data.profile.phone)" class="bg-white border border-slate-200 rounded-xl p-4">
        <h2 class="font-semibold text-slate-900 mb-3">Contact</h2>
        <div class="space-y-2">
          <div v-if="data.profile.show_email && data.profile.email" class="flex items-center gap-2 text-sm">
            <i class="pi pi-envelope text-slate-400" />
            <a :href="`mailto:${data.profile.email}`" class="text-primary-600 hover:underline">{{ data.profile.email }}</a>
          </div>
          <div v-if="data.profile.show_phone && data.profile.phone" class="flex items-center gap-2 text-sm">
            <i class="pi pi-phone text-slate-400" />
            <span class="text-slate-700">{{ data.profile.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div v-if="data.education.length > 0" class="bg-white border border-slate-200 rounded-xl p-4">
        <h2 class="font-semibold text-slate-900 mb-3">Education</h2>
        <div class="space-y-3">
          <div v-for="edu in data.education" :key="edu.id" class="flex gap-3">
            <div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
              <i class="pi pi-graduation-cap text-primary-600 text-sm" />
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ edu.institution }}</p>
              <p v-if="edu.degree" class="text-sm text-slate-600">{{ edu.degree }}<span v-if="edu.field_of_study"> · {{ edu.field_of_study }}</span></p>
              <p class="text-xs text-slate-400">
                {{ edu.start_year }}<span v-if="edu.end_year"> – {{ edu.is_current ? 'Present' : edu.end_year }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Experience -->
      <div v-if="data.work.length > 0" class="bg-white border border-slate-200 rounded-xl p-4">
        <h2 class="font-semibold text-slate-900 mb-3">Work Experience</h2>
        <div class="space-y-3">
          <div v-for="exp in data.work" :key="exp.id" class="flex gap-3">
            <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <i class="pi pi-briefcase text-slate-500 text-sm" />
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ exp.job_title }}</p>
              <p class="text-sm text-slate-600">{{ exp.company }}<span v-if="exp.location" class="text-slate-400"> · {{ exp.location }}</span></p>
              <p v-if="exp.start_date" class="text-xs text-slate-400">
                {{ new Date(exp.start_date).getFullYear() }}<span v-if="exp.end_date || exp.is_current"> – {{ exp.is_current ? 'Present' : new Date(exp.end_date!).getFullYear() }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="data.profile.skills && data.profile.skills.length > 0" class="bg-white border border-slate-200 rounded-xl p-4">
        <h2 class="font-semibold text-slate-900 mb-3">Skills</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in data.profile.skills"
            :key="skill"
            class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
