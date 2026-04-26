<script setup lang="ts">
import type { AlumniProfile } from '~/types/member'

const props = defineProps<{
  member: AlumniProfile
  compact?: boolean
}>()

const workSubtitle = computed(() => {
  return props.member.featured_work_summary || null
})

const eduSubtitle = computed(() => {
  return props.member.featured_education_summary || null
})

const hasSocialLinks = computed(() => {
  const m = props.member
  return m.linkedin_url || m.facebook_url || m.portfolio_url
})
</script>

<template>
  <NuxtLink
    :to="`/directory/${member.id}`"
    class="glass-light relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

    <!-- Content -->
    <div class="relative px-5 pt-5 pb-5 text-center">
      <!-- Avatar -->
      <div class="mb-3 flex justify-center">
        <div class="relative">
          <AppAvatar
            :src="member.avatar_url"
            :name="member.full_name"
            size="lg"
            class="!w-14 !h-14 ring-[3px] !ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-if="member.is_verified"
            class="absolute -bottom-0.5 -right-0.5 rounded-full w-5 h-5 flex items-center justify-center shadow-md bg-gradient-to-br from-primary-600 to-primary-500 border-2 border-white"
          >
            <i class="pi pi-check text-white text-[8px]" />
          </div>
        </div>
      </div>

      <!-- Name -->
      <h3 class="font-semibold text-slate-900 text-sm truncate group-hover:text-primary-600 transition-colors">
        {{ member.display_name || member.full_name }}
      </h3>

      <!-- Featured work -->
      <p v-if="workSubtitle" class="text-xs text-slate-500 mt-0.5 truncate">
        {{ workSubtitle }}
      </p>

      <!-- Featured education -->
      <p v-if="eduSubtitle" class="text-xs text-slate-400 mt-0.5 truncate flex items-center justify-center gap-1">
        <i class="pi pi-graduation-cap text-[9px]" />
        {{ eduSubtitle }}
      </p>

      <!-- Badges -->
      <div class="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
        <span
          v-if="member.batch_year"
          class="inline-flex items-center text-[11px] text-primary-700 px-2 py-0.5 rounded-full font-medium bg-primary-50 border border-primary-200"
        >
          Class of {{ member.batch_year }}
        </span>
        <span
          v-if="member.city || member.country"
          class="inline-flex items-center gap-0.5 text-[11px] text-slate-400"
        >
          <i class="pi pi-map-marker text-[9px]" />
          {{ [member.city, member.country].filter(Boolean).join(', ') }}
        </span>
      </div>

      <!-- Social links -->
      <div v-if="hasSocialLinks" class="flex items-center justify-center gap-2 mt-3">
        <a
          v-if="member.portfolio_url"
          :href="member.portfolio_url"
          target="_blank"
          class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          title="Portfolio"
          @click.stop
        >
          <i class="pi pi-globe text-[11px]" />
        </a>
        <a
          v-if="member.linkedin_url"
          :href="member.linkedin_url"
          target="_blank"
          class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 transition-all"
          title="LinkedIn"
          @click.stop
        >
          <i class="pi pi-linkedin text-[11px]" />
        </a>
        <a
          v-if="member.facebook_url"
          :href="member.facebook_url"
          target="_blank"
          class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-blue-50 transition-all"
          title="Facebook"
          @click.stop
        >
          <i class="pi pi-facebook text-[11px]" />
        </a>
      </div>
    </div>
  </NuxtLink>
</template>
