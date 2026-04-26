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
      class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
      :class="currentRsvp?.status === option.status
        ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30 border border-primary-500'
        : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-white hover:text-slate-900'"
      :disabled="loading"
      @click="handleRsvp(option.status)"
    >
      <i :class="option.icon" class="text-xs" />
      {{ option.label }}
    </button>
  </div>
  <p v-else-if="isExpired" class="text-sm text-slate-400">
    RSVP deadline has passed
  </p>
</template>
