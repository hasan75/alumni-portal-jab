<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
})

const sizeClasses: Record<string, string> = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

const initials = computed(() => {
  if (!props.name) return '?'
  const words = props.name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
})
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="name || 'Avatar'"
    class="rounded-full object-cover ring-2 ring-primary-200"
    :class="sizeClasses[size]"
  >
  <div
    v-else
    class="rounded-full flex items-center justify-center text-white font-semibold avatar-gradient shrink-0"
    :class="sizeClasses[size]"
  >
    {{ initials }}
  </div>
</template>
