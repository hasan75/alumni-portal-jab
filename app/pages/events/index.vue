<script setup lang="ts">
import EventCard from '~/components/events/EventCard.vue'
import Select from 'primevue/select'

definePageMeta({ layout: 'member', middleware: 'member-auth' })

useSeoMeta({ title: 'Events | Alumni Portal', description: 'Upcoming and past alumni events.' })

const { fetchEvents } = useEvents()

const filter = ref<'upcoming' | 'all'>('upcoming')
const currentPage = ref(1)

const { data: events, refresh, pending } = await useAsyncData('events', () =>
  fetchEvents({ upcoming: filter.value === 'upcoming', page: currentPage.value }),
)

watch(filter, () => {
  currentPage.value = 1
  refresh()
})
</script>

<template>
  <div>
    <!-- Hero header -->
    <section class="relative overflow-hidden py-14 px-4 gradient-brand">
      <div class="absolute top-0 right-1/4 w-56 h-56 rounded-full opacity-20 blur-3xl animate-float orb-secondary" />
      <div class="relative max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-6">
        <div class="animate-fade-in-up">
          <p class="text-xs font-semibold tracking-widest uppercase text-white/60 mb-2">Alumni</p>
          <h1 class="text-4xl font-semibold tracking-tight text-white">Events</h1>
          <p class="text-white/60 text-sm mt-1.5">Gatherings, workshops, and reunions</p>
        </div>
        <div class="flex gap-2 animate-fade-in-up delay-1">
          <button
            v-for="opt in [{ value: 'upcoming', label: 'Upcoming' }, { value: 'all', label: 'All Events' }]"
            :key="opt.value"
            class="relative overflow-hidden px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            :style="filter === opt.value
              ? 'background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.5);color:white;box-shadow:0 2px 0 rgba(255,255,255,0.3) inset;'
              : 'background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.20);color:rgba(255,255,255,0.7);'"
            @click="filter = opt.value as any"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-10">
      <!-- Skeletons -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="i in 6" :key="i"
          class="rounded-[20px] h-72 animate-pulse"
          style="background:rgba(29,78,216,0.15);border:1px solid rgba(29,78,216,0.2);"
        />
      </div>

      <div v-else-if="events && events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div>

      <!-- Empty state -->
      <div v-else class="glass relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in" style="background:linear-gradient(135deg,rgba(29,78,216,0.12),rgba(59,130,246,0.12));">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        <div class="relative">
          <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float" style="background:rgba(29,78,216,0.15);border:1px solid rgba(29,78,216,0.3);">
            <i class="pi pi-calendar text-3xl text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-800 mb-2">No events found</h3>
          <p class="text-slate-500 text-sm">Check back soon for upcoming {{ filter === 'upcoming' ? 'events' : 'alumni events' }}.</p>
        </div>
      </div>
    </div>
  </div>
</template>

