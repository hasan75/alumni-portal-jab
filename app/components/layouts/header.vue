<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()
const { appName } = useSiteConfig()

const mobileMenuOpen = ref(false)

const publicNavItems = [
  { label: 'Events', to: '/events' },
  { label: 'News', to: '/news' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Directory', to: '/directory' },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="glass-nav sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0 group">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-200">
          A
        </div>
        <span class="font-semibold text-slate-900 text-base tracking-tight hidden sm:inline">{{ appName }}</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="item in publicNavItems"
          :key="item.to"
          :to="item.to"
          class="px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="[
            isActive(item.to)
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/8',
          ]"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Right: Auth buttons -->
      <div class="flex items-center gap-2">
        <template v-if="user">
          <NuxtLink
            to="/feed"
            class="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            style="background:rgba(29,78,216,0.9); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.25); box-shadow:0 2px 0 rgba(255,255,255,0.2) inset,0 4px 16px rgba(29,78,216,0.3);"
          >
            <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
            My Portal
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-900/8 rounded-xl transition-all duration-200"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="relative overflow-hidden inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            style="background:rgba(29,78,216,0.9); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.25); box-shadow:0 2px 0 rgba(255,255,255,0.2) inset,0 4px 16px rgba(29,78,216,0.3);"
          >
            <span class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
            Join Now
          </NuxtLink>
        </template>
        <button
          class="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-900/8 transition-all duration-200"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <i class="pi pi-bars" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/30 bg-white/80 backdrop-blur-xl py-2">
        <NuxtLink
          v-for="item in publicNavItems"
          :key="item.to"
          :to="item.to"
          class="flex px-4 py-2.5 text-sm rounded-xl mx-2 transition-all duration-150"
          :class="[
            isActive(item.to) ? 'text-primary-700 font-semibold bg-primary-50' : 'text-slate-700 hover:bg-white/60',
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <div class="px-4 pt-2 pb-3 flex gap-2">
          <NuxtLink to="/login" class="flex-1 text-center py-2 rounded-xl text-sm font-medium text-slate-700 transition-all duration-150" style="background:rgba(255,255,255,0.5);border:1px solid rgba(0,0,0,0.08);">
            Sign In
          </NuxtLink>
          <NuxtLink to="/register" class="flex-1 text-center py-2 rounded-xl text-sm font-medium text-white" style="background:rgba(29,78,216,0.9);">
            Join Now
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
