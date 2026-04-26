<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const route = useRoute()

const { appName } = useSiteConfig()

const mobileMenuOpen = ref(false)

const navItems = [
  { label: 'Feed', icon: 'pi pi-home', to: '/feed' },
  { label: 'Directory', icon: 'pi pi-users', to: '/directory' },
  { label: 'Events', icon: 'pi pi-calendar', to: '/events' },
  { label: 'News', icon: 'pi pi-megaphone', to: '/news' },
  { label: 'Jobs', icon: 'pi pi-briefcase', to: '/jobs' },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function handleSignOut() {
  authStore.clear()
  await supabase.auth.signOut()
  navigateTo('/')
}

onMounted(() => {
  if (!authStore.isLoaded) {
    authStore.loadProfile()
  }
})
</script>

<template>
  <div class="min-h-screen gradient-brand">    <!-- Top nav -->
    <header class="glass-nav sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <!-- Logo -->
        <NuxtLink to="/feed" class="flex items-center gap-2.5 shrink-0 group">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/30 group-hover:scale-105 transition-transform duration-200">
            A
          </div>
          <span class="font-semibold text-slate-900 tracking-tight hidden sm:inline">{{ appName }}</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
            :class="[
              isActive(item.to)
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'text-slate-700 hover:bg-white/60',
            ]"
          >
            <i :class="item.icon" class="text-xs" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Right: profile -->
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-slate-700 hover:bg-white/60 transition-all duration-200"
          >
            <img
              v-if="authStore.profile?.avatar_url"
              :src="authStore.profile.avatar_url"
              class="w-7 h-7 rounded-full object-cover ring-2 ring-white/50"
              alt="Avatar"
            >
            <div
              v-else
              class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium text-xs shadow-sm"
            >
              {{ authStore.displayName.charAt(0).toUpperCase() }}
            </div>
            <span class="hidden sm:inline font-medium">{{ authStore.displayName }}</span>
          </NuxtLink>
          <button
            class="hidden md:flex items-center p-2 rounded-xl text-slate-500 hover:bg-white/60 hover:text-red-500 transition-all duration-200"
            title="Sign out"
            @click="handleSignOut"
          >
            <i class="pi pi-sign-out text-sm" />
          </button>
          <button
            class="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white/60 transition-all duration-200"
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
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 text-sm mx-2 rounded-xl transition-all duration-150"
            :class="[
              isActive(item.to)
                ? 'text-primary-700 font-semibold bg-primary-50'
                : 'text-slate-700 hover:bg-white/60',
            ]"
            @click="mobileMenuOpen = false"
          >
            <i :class="item.icon" />
            {{ item.label }}
          </NuxtLink>
          <div class="mx-2 mt-2 pt-2 border-t border-slate-100">
            <button
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 w-full text-left rounded-xl hover:bg-red-50 transition-all duration-150"
              @click="handleSignOut"
            >
              <i class="pi pi-sign-out" />
              Sign Out
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

