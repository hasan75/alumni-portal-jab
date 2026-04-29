<script setup lang="ts">
const props = withDefaults(defineProps<{
  password: string
  context?: 'dark' | 'light'
}>(), {
  context: 'dark',
})

const rules = [
  { key: 'minLength', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'At least 1 number', test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', label: 'At least 1 special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

const ruleStatuses = computed(() =>
  rules.map(r => ({ ...r, passed: r.test(props.password) })),
)

const passedCount = computed(() => ruleStatuses.value.filter(r => r.passed).length)

const strengthLevel = computed(() => {
  if (!props.password) return 0
  const n = passedCount.value
  if (n <= 2) return 1
  if (n === 3) return 2
  if (n === 4) return 3
  return 4
})

const strengthConfig = computed(() => [
  { label: '', color: '' },
  { label: 'Weak', color: '#FF3B30' },
  { label: 'Fair', color: '#FF9500' },
  { label: 'Strong', color: '#FFCC00' },
  { label: 'Very Strong', color: '#34C759' },
][strengthLevel.value])

const inactiveBar = computed(() =>
  props.context === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
)
</script>

<template>
  <Transition name="meter">
    <div v-if="password.length > 0" class="mt-2.5 space-y-2.5">
      <!-- Strength bar -->
      <div class="flex items-center gap-2.5">
        <div class="flex gap-1 flex-1">
          <div
            v-for="i in 4"
            :key="i"
            class="h-1.5 flex-1 rounded-full transition-all duration-300"
            :style="{ background: i <= strengthLevel ? strengthConfig.color : inactiveBar }"
          />
        </div>
        <span
          class="text-xs font-semibold w-20 text-right transition-colors duration-300"
          :style="{ color: strengthLevel > 0 ? strengthConfig.color : 'transparent' }"
        >
          {{ strengthConfig.label }}
        </span>
      </div>

      <!-- Rules checklist -->
      <ul class="space-y-1">
        <li
          v-for="rule in ruleStatuses"
          :key="rule.key"
          class="flex items-center gap-2 transition-all duration-200"
        >
          <i
            :class="rule.passed ? 'pi pi-check-circle' : 'pi pi-circle'"
            class="text-[11px] shrink-0 transition-all duration-200"
            :style="{ color: rule.passed ? '#34C759' : (context === 'dark' ? 'rgba(255,255,255,0.30)' : '#CBD5E1') }"
          />
          <span
            class="text-xs transition-colors duration-200"
            :class="context === 'dark'
              ? (rule.passed ? 'text-white/75' : 'text-white/35')
              : (rule.passed ? 'text-slate-600' : 'text-slate-400')"
          >
            {{ rule.label }}
          </span>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped>
.meter-enter-active {
  animation: fadeInUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.meter-leave-active {
  animation: fadeInUp 0.2s cubic-bezier(0.36, 0, 0.66, 0) reverse both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
