<script setup lang="ts">
import type { Event } from '~/types/event'
import { formatDateTime, formatDateShort } from '~/utils/formatters'

defineProps<{
  event: Event
}>()

const eventTypeLabels: Record<string, string> = {
  reunion: 'Reunion',
  seminar: 'Seminar',
  networking: 'Networking',
  workshop: 'Workshop',
  sports: 'Sports',
  cultural: 'Cultural',
  general: 'General',
}

const eventTypeColors: Record<string, string> = {
  reunion: 'bg-purple-400/20 text-purple-200 border border-purple-400/30',
  seminar: 'bg-blue-400/20 text-blue-200 border border-blue-400/30',
  networking: 'bg-green-400/20 text-green-200 border border-green-400/30',
  workshop: 'bg-yellow-400/20 text-yellow-200 border border-yellow-400/30',
  sports: 'bg-orange-400/20 text-orange-200 border border-orange-400/30',
  cultural: 'bg-pink-400/20 text-pink-200 border border-pink-400/30',
  general: 'bg-white/15 text-white/80 border border-white/20',
}
</script>

<template>
  <NuxtLink
    :to="`/events/${event.slug}`"
    class="glass relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
  >
    <!-- Specular highlight -->
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent z-10" />

    <!-- Cover image -->
    <div class="h-44 relative overflow-hidden rounded-t-[18px]">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-700" />
      <img
        v-if="event.cover_image_url"
        :src="event.cover_image_url"
        :alt="event.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div class="absolute top-3 left-3 z-10">
        <span
          class="text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
          :class="eventTypeColors[event.event_type] || 'bg-white/20 text-white border border-white/30'"
        >
          {{ eventTypeLabels[event.event_type] || event.event_type }}
        </span>
      </div>
    </div>

    <div class="p-5">
      <h3 class="font-semibold text-white leading-snug group-hover:text-white transition-colors">{{ event.title }}</h3>

      <div class="mt-3 space-y-1.5">
        <div class="flex items-center gap-2 text-sm text-white/70">
          <i class="pi pi-calendar text-xs text-primary-300" />
          <span>{{ formatDateShort(event.start_datetime) }}</span>
          <span class="text-white/30">·</span>
          <span>{{ new Date(event.start_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
        </div>

        <div v-if="event.location_name || event.is_online" class="flex items-center gap-2 text-sm text-white/70">
          <i :class="event.is_online ? 'pi pi-video' : 'pi pi-map-marker'" class="text-xs text-primary-300" />
          <span class="truncate">{{ event.is_online ? 'Online Event' : event.location_name }}</span>
        </div>
      </div>

      <div v-if="event.rsvp_enabled" class="mt-4 flex items-center justify-between">
        <span class="text-xs text-white/50 flex items-center gap-1">
          <i class="pi pi-users text-[10px]" />
          {{ event.rsvp_count }} going
        </span>
        <span
          v-if="event.batch_year"
          class="text-xs text-primary-300 px-2.5 py-1 rounded-full"
          style="background:rgba(147,197,253,0.15);border:1px solid rgba(147,197,253,0.25);"
        >
          Batch {{ event.batch_year }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

