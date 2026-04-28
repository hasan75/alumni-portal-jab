<script setup lang="ts">
import type { StaffMember } from '~/types/staff'

defineProps<{
  member: StaffMember
}>()
</script>

<template>
  <div
    class="glass-light relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

    <div class="relative px-5 pt-5 pb-5 text-center">
      <!-- Photo -->
      <div class="mb-3 flex justify-center">
        <div class="relative">
          <div class="w-20 h-20 rounded-2xl overflow-hidden border-[3px] border-white shadow-lg mx-auto">
            <img
              v-if="member.photo_url"
              :src="member.photo_url"
              :alt="member.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center avatar-gradient text-white text-2xl font-bold">
              {{ member.name.charAt(0) }}
            </div>
          </div>
          <!-- Deceased ribbon -->
          <div
            v-if="member.employment_status === 'deceased'"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-700 text-white text-[9px] font-medium shadow-sm whitespace-nowrap"
          >
            In Memoriam
          </div>
        </div>
      </div>

      <!-- Name -->
      <h3 class="font-semibold text-slate-900 text-sm leading-snug mt-1">
        {{ member.name }}
      </h3>

      <!-- Designation -->
      <span
        class="inline-flex items-center text-[11px] text-primary-700 px-2.5 py-0.5 rounded-full font-medium bg-primary-50 border border-primary-200 mt-2"
      >
        {{ formatDesignation(member.designation) }}
      </span>

      <!-- Subject -->
      <p v-if="member.subject" class="text-xs text-slate-500 mt-1.5 truncate">
        {{ member.subject }}
      </p>

      <!-- Status badge for non-current -->
      <span
        v-if="member.employment_status === 'retired'"
        class="inline-flex items-center text-[10px] text-amber-700 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 mt-1.5"
      >
        Retired
      </span>
      <span
        v-else-if="member.employment_status === 'left'"
        class="inline-flex items-center text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 mt-1.5"
      >
        Former
      </span>

      <!-- Phone -->
      <p v-if="member.phone" class="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
        <i class="pi pi-phone text-[10px]" />
        {{ member.phone }}
      </p>
    </div>
  </div>
</template>
