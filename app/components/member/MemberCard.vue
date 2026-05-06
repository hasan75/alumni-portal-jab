<script setup lang="ts">
import type { AlumniProfile } from '~/types/member'

const props = defineProps<{
  member: AlumniProfile
  compact?: boolean
}>()

const workSubtitle = computed(() => props.member.featured_work_summary || null)
const eduSubtitle = computed(() => props.member.featured_education_summary || null)

const hasContactOrSocial = computed(() => {
  const m = props.member
  return m.linkedin_url || m.facebook_url || m.portfolio_url || m.email || m.phone
})
</script>

<template>
  <NuxtLink
    :to="`/directory/${member.id}`"
    class="glass-light relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

    <!-- Content -->
    <div class="relative px-4 pt-5 pb-4 text-center">
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
      <h3
        v-tooltip.top="{ value: member.display_name || member.full_name, showDelay: 600 }"
        class="font-semibold text-slate-900 text-sm truncate group-hover:text-primary-600 transition-colors leading-snug"
      >
        {{ member.display_name || member.full_name }}
      </h3>

      <!-- Featured work -->
      <p
        v-if="workSubtitle"
        v-tooltip.top="{ value: workSubtitle, showDelay: 600 }"
        class="text-xs text-slate-500 mt-0.5 truncate leading-snug"
      >
        {{ workSubtitle }}
      </p>

      <!-- Featured education — icon outside the truncated span so it never gets clipped -->
      <div
        v-if="eduSubtitle"
        v-tooltip.top="{ value: eduSubtitle, showDelay: 600 }"
        class="flex items-center justify-center gap-1 mt-0.5 overflow-hidden"
      >
        <i class="pi pi-graduation-cap text-[9px] text-slate-400 shrink-0" />
        <span class="text-xs text-slate-400 truncate min-w-0 leading-snug">{{ eduSubtitle }}</span>
      </div>

      <!-- Batch + location badges -->
      <div class="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
        <span
          v-if="member.batch_year"
          class="inline-flex items-center text-[11px] text-primary-700 px-2 py-0.5 rounded-full font-medium bg-primary-50 border border-primary-200"
        >
          Class of {{ member.batch_year }}
        </span>
        <span
          v-if="member.city || member.country"
          v-tooltip.top="{ value: [member.city, member.country].filter(Boolean).join(', '), showDelay: 600 }"
          class="inline-flex items-center gap-0.5 text-[11px] text-slate-400 truncate max-w-[120px]"
        >
          <i class="pi pi-map-marker text-[9px] shrink-0" />
          <span class="truncate">{{ [member.city, member.country].filter(Boolean).join(', ') }}</span>
        </span>
      </div>

      <!-- Contact & social icons -->
      <div v-if="hasContactOrSocial" class="flex items-center justify-center gap-2 mt-3 flex-wrap">
        <!-- Email -->
        <a
          v-if="member.email"
          :href="`mailto:${member.email}`"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
          :title="member.email"
          @click.stop
        >
          <i class="pi pi-envelope text-[12px]" />
        </a>

        <!-- Phone -->
        <a
          v-if="member.phone"
          :href="`tel:${member.phone}`"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"
          :title="member.phone"
          @click.stop
        >
          <i class="pi pi-phone text-[12px]" />
        </a>

        <!-- Portfolio / GitHub -->
        <a
          v-if="member.portfolio_url"
          :href="safeUrl(member.portfolio_url)"
          target="_blank"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          title="Portfolio"
          @click.stop
        >
          <i class="pi pi-globe text-[12px]" />
        </a>

        <!-- LinkedIn -->
        <a
          v-if="member.linkedin_url"
          :href="safeUrl(member.linkedin_url)"
          target="_blank"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 transition-all"
          title="LinkedIn"
          @click.stop
        >
          <i class="pi pi-linkedin text-[12px]" />
        </a>

        <!-- Facebook -->
        <a
          v-if="member.facebook_url"
          :href="safeUrl(member.facebook_url)"
          target="_blank"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-blue-50 transition-all"
          title="Facebook"
          @click.stop
        >
          <i class="pi pi-facebook text-[12px]" />
        </a>
      </div>
    </div>
  </NuxtLink>
</template>
