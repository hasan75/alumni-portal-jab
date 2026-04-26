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
    class="glass relative overflow-hidden p-5 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

    <div class="relative flex items-start gap-3.5">
      <!-- Avatar -->
      <div class="shrink-0">
        <img
          v-if="member.avatar_url"
          :src="member.avatar_url"
          :alt="member.full_name"
          class="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
        >
        <div
          v-else
          class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg avatar-gradient"
        >
          {{ (member.display_name || member.full_name).charAt(0).toUpperCase() }}
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5">
          <h3 class="font-semibold text-white text-sm truncate">
            {{ member.display_name || member.full_name }}
          </h3>
          <i v-if="member.is_verified" class="pi pi-verified text-primary-300 text-xs shrink-0" title="Verified" />
        </div>

        <p v-if="member.current_job_title" class="text-xs text-white/60 mt-0.5 truncate">
          {{ member.current_job_title }}
          <span v-if="member.current_company" class="text-white/40"> · {{ member.current_company }}</span>
        </p>

        <div class="flex items-center gap-2 mt-2 flex-wrap">
          <span
            v-if="member.batch_year"
            class="inline-flex items-center text-[11px] text-primary-200 px-2 py-0.5 rounded-full font-medium"
            style="background:rgba(147,197,253,0.15);border:1px solid rgba(147,197,253,0.25);"
          >
            Class of {{ member.batch_year }}
          </span>
          <span
            v-if="member.city || member.country"
            class="inline-flex items-center gap-0.5 text-[11px] text-white/40"
          >
            <i class="pi pi-map-marker text-[9px]" />
            {{ [member.city, member.country].filter(Boolean).join(', ') }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

