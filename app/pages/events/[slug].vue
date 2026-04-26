<script setup lang="ts">
import RsvpButton from '~/components/events/RsvpButton.vue'
import { formatDateTime, formatDateShort } from '~/utils/formatters'

definePageMeta({ layout: 'member', middleware: 'member-auth' })

const route = useRoute()
const slug = route.params.slug as string

const { fetchBySlug, fetchMyRsvpForEvent } = useEvents()
const user = useSupabaseUser()

const { data: event, pending } = await useAsyncData(`event-${slug}`, () => fetchBySlug(slug))

if (!event.value && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found' })
}

const myRsvp = ref(null)
if (user.value && event.value) {
  myRsvp.value = await fetchMyRsvpForEvent(event.value.id)
}

useSeoMeta({
  title: computed(() => `${event.value?.title || 'Event'} | Alumni Portal`),
  description: computed(() => event.value?.description || ''),
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <NuxtLink to="/events" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4">
      <i class="pi pi-arrow-left text-xs" />
      Back to Events
    </NuxtLink>

    <div v-if="pending" class="bg-white border border-slate-200 rounded-xl h-96 animate-pulse" />

    <div v-else-if="event" class="space-y-4">
      <!-- Cover -->
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl h-48 overflow-hidden">
        <img v-if="event.cover_image_url" :src="event.cover_image_url" :alt="event.title" class="w-full h-full object-cover">
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span class="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
              {{ event.event_type }}
            </span>
            <h1 class="text-2xl font-bold text-slate-900 mt-2">{{ event.title }}</h1>
          </div>
          <RsvpButton
            v-if="user"
            :event-id="event.id"
            :current-rsvp="myRsvp"
            :rsvp-enabled="event.rsvp_enabled"
            :rsvp-deadline="event.rsvp_deadline"
            @change="(s) => myRsvp = s ? { id: 0, event_id: event!.id, alumni_id: user!.id, status: s, created_at: '' } : null"
          />
          <NuxtLink v-else to="/login" class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg">
            Sign in to RSVP
          </NuxtLink>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 text-sm text-slate-600">
            <i class="pi pi-calendar text-primary-500" />
            <span>{{ formatDateTime(event.start_datetime) }}</span>
          </div>
          <div v-if="event.end_datetime" class="flex items-center gap-2 text-sm text-slate-600">
            <i class="pi pi-clock text-primary-500" />
            <span>Ends: {{ formatDateTime(event.end_datetime) }}</span>
          </div>
          <div v-if="event.location_name || event.is_online" class="flex items-center gap-2 text-sm text-slate-600">
            <i :class="event.is_online ? 'pi pi-video' : 'pi pi-map-marker'" class="text-primary-500" />
            <span>{{ event.is_online ? 'Online' : event.location_name }}</span>
          </div>
          <div v-if="event.rsvp_count > 0" class="flex items-center gap-2 text-sm text-slate-600">
            <i class="pi pi-users text-primary-500" />
            <span>{{ event.rsvp_count }} attending</span>
          </div>
        </div>

        <div v-if="event.description" class="mt-4 pt-4 border-t border-slate-100">
          <p class="text-slate-700 leading-relaxed">{{ event.description }}</p>
        </div>

        <div v-if="event.content" class="mt-4 prose max-w-none text-sm text-slate-700" v-html="event.content" />
      </div>
    </div>
  </div>
</template>
