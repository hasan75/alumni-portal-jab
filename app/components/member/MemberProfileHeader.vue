<script setup lang="ts">
import type { AlumniProfile } from '~/types/member'

defineProps<{
  profile: AlumniProfile
  isOwnProfile?: boolean
}>()
</script>

<template>
  <div class="glass-light relative overflow-hidden animate-fade-in-up">
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

    <!-- Cover photo -->
    <div class="h-36 relative overflow-hidden rounded-t-[18px]">
      <div class="absolute inset-0 gradient-cover" />
      <img
        v-if="profile.cover_photo_url"
        :src="profile.cover_photo_url"
        alt="Cover"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>

    <div class="relative px-6 pb-6">
      <!-- Avatar (overlapping cover) -->
      <div class="flex justify-between items-end -mt-12 mb-4">
        <div class="relative">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            :alt="profile.full_name"
            class="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl"
          >
          <div
            v-else
            class="w-20 h-20 rounded-full ring-4 ring-white flex items-center justify-center text-white font-bold text-2xl shadow-xl avatar-gradient"
          >
            {{ profile.full_name.charAt(0).toUpperCase() }}
          </div>
          <div
            v-if="profile.is_verified"
            class="absolute bottom-0 right-0 rounded-full w-6 h-6 flex items-center justify-center shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 border-2 border-white"
            title="Verified Alumni"
          >
            <i class="pi pi-check text-white text-[10px]" />
          </div>
        </div>
        <NuxtLink
          v-if="isOwnProfile"
          to="/profile"
          class="text-sm font-medium text-slate-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/70 border border-slate-200 hover:bg-white shadow-sm"
        >
          <i class="pi pi-pencil text-xs" />
          Edit Profile
        </NuxtLink>
      </div>

      <!-- Name & details -->
      <h1 class="text-xl font-semibold text-slate-900 tracking-tight">
        {{ profile.display_name || profile.full_name }}
      </h1>
      <p v-if="profile.current_job_title" class="text-slate-500 mt-0.5 text-sm">
        {{ profile.current_job_title }}
        <span v-if="profile.current_company"> at {{ profile.current_company }}</span>
      </p>

      <div class="flex flex-wrap gap-2.5 mt-4">
        <span
          v-if="profile.batch_year"
          class="inline-flex items-center gap-1.5 text-sm text-primary-700 px-3 py-1 rounded-full font-medium bg-primary-50 border border-primary-200"
        >
          <i class="pi pi-graduation-cap text-xs" />
          Class of {{ profile.batch_year }}
        </span>
        <span
          v-if="profile.department"
          class="inline-flex items-center gap-1.5 text-sm text-slate-500"
        >
          <i class="pi pi-book text-xs" />
          {{ profile.department }}
        </span>
        <span
          v-if="profile.city || profile.country"
          class="inline-flex items-center gap-1.5 text-sm text-slate-500"
        >
          <i class="pi pi-map-marker text-xs" />
          {{ [profile.city, profile.country].filter(Boolean).join(', ') }}
        </span>
      </div>

      <p v-if="profile.bio" class="mt-4 text-sm text-slate-600 leading-relaxed">
        {{ profile.bio }}
      </p>
    </div>
  </div>
</template>
