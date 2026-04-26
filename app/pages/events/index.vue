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
    <!-- Section header -->
    <div class="mb-8 flex items-center justify-between flex-wrap gap-4 animate-fade-in-up">
      <div>
        <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Alumni</p>
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Events</h1>
        <p class="text-slate-500 text-sm mt-1.5">Gatherings, workshops, and reunions</p>
      </div>
      <div class="flex gap-2 animate-fade-in-up delay-1">
        <button
          v-for="opt in [{ value: 'upcoming', label: 'Upcoming' }, { value: 'all', label: 'All Events' }]"
          :key="opt.value"
          class="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          :class="filter === opt.value
            ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
            : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-white'"
          @click="filter = opt.value as any"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 6" :key="i"
        class="rounded-[20px] h-72 animate-pulse bg-white/40 border border-slate-200"
      />
    </div>

    <div v-else-if="events && events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>

    <!-- Empty state -->
    <div v-else class="glass-light relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float bg-primary-50 border border-primary-200">
          <i class="pi pi-calendar text-3xl text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">No events found</h3>
        <p class="text-slate-500 text-sm">Check back soon for upcoming {{ filter === 'upcoming' ? 'events' : 'alumni events' }}.</p>
      </div>
    </div>
  </div>
</template>
