<script setup lang="ts">
import type { EventRsvp, RsvpStatus } from '~/types/event'

const props = defineProps<{
  eventId: number
  currentRsvp: EventRsvp | null
  rsvpEnabled: boolean
  rsvpDeadline?: string | null
}>()

const emit = defineEmits<{
  change: [status: RsvpStatus | null]
}>()

const { rsvpToEvent, removeRsvp } = useEvents()
const toast = useToast()
const loading = ref(false)

const isExpired = computed(() => {
  if (!props.rsvpDeadline) return false
  return new Date(props.rsvpDeadline) < new Date()
})

async function handleRsvp(status: RsvpStatus) {
  if (loading.value) return
  loading.value = true

  if (props.currentRsvp?.status === status) {
    // Toggle off
    const result = await removeRsvp(props.eventId)
    if (result.success) {
      emit('change', null)
      toast.add({ severity: 'info', summary: 'RSVP removed', life: 2000 })
    }
  }
  else {
    const result = await rsvpToEvent(props.eventId, status)
    if (result.success) {
      emit('change', status)
      toast.add({ severity: 'success', summary: 'RSVP updated', life: 2000 })
    }
  }

  loading.value = false
}
</script>

<template>
  <div v-if="rsvpEnabled && !isExpired" class="flex gap-2">
    <button
      v-for="option in [
        { status: 'going' as RsvpStatus, label: 'Going', icon: 'pi pi-check' },
        { status: 'maybe' as RsvpStatus, label: 'Maybe', icon: 'pi pi-question' },
        { status: 'not_going' as RsvpStatus, label: 'Can\'t Go', icon: 'pi pi-times' },
      ]"
      :key="option.status"
      class="relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
      :style="currentRsvp?.status === option.status
        ? 'background:rgba(29,78,216,0.8);border:1px solid rgba(147,197,253,0.4);color:white;box-shadow:0 2px 0 rgba(255,255,255,0.2) inset,0 4px 16px rgba(29,78,216,0.3);'
        : 'background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.75);'"
      :disabled="loading"
      @click="handleRsvp(option.status)"
    >
      <span v-if="currentRsvp?.status === option.status" class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
      <i :class="option.icon" class="text-xs" />
      {{ option.label }}
    </button>
  </div>
  <p v-else-if="isExpired" class="text-sm text-white/40">
    RSVP deadline has passed
  </p>
</template>

