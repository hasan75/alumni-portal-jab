<script setup lang="ts">
import type { AlumniProfile } from '~/types/member'

defineProps<{
  member: AlumniProfile
  compact?: boolean
}>()
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

      <!-- Job -->
      <p v-if="member.current_job_title" class="text-xs text-slate-500 mt-0.5 truncate">
        {{ member.current_job_title }}
      </p>
      <p v-if="member.current_company" class="text-xs text-slate-400 truncate">
        {{ member.current_company }}
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
    </div>
  </NuxtLink>
</template>
