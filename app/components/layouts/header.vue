<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()
const authStore = useAuthStore()
const { appName } = useSiteConfig()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const publicNavItems = [
  { label: 'Events', icon: 'pi pi-calendar', to: '/events' },
  { label: 'News', icon: 'pi pi-megaphone', to: '/news' },
  { label: 'Jobs', icon: 'pi pi-briefcase', to: '/jobs' },
  { label: 'Directory', icon: 'pi pi-users', to: '/directory' },
]

const memberNavItems = [
  { label: 'Feed', icon: 'pi pi-home', to: '/feed' },
  { label: 'Directory', icon: 'pi pi-users', to: '/directory' },
  { label: 'Events', icon: 'pi pi-calendar', to: '/events' },
  { label: 'News', icon: 'pi pi-megaphone', to: '/news' },
  { label: 'Jobs', icon: 'pi pi-briefcase', to: '/jobs' },
]

const navItems = computed(() => user.value ? memberNavItems : publicNavItems)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function handleSignOut() {
  authStore.clear()
  await supabase.auth.signOut()
  navigateTo('/')
}

function closeUserMenu(e: Event) {
  if (!(e.target as HTMLElement).closest('.user-menu-container')) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeUserMenu))
onUnmounted(() => document.removeEventListener('click', closeUserMenu))
</script>

<template>
  <header class="glass-nav sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink :to="user ? '/feed' : '/'" class="flex items-center gap-2.5 shrink-0 group">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-200">
          A
        </div>
        <span class="font-semibold text-slate-900 text-base tracking-tight hidden sm:inline">{{ appName }}</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="[
            isActive(item.to)
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/8',
          ]"
        >
          <i :class="item.icon" class="text-xs" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Right section -->
      <div class="flex items-center gap-2">
        <!-- Logged in: user menu -->
        <template v-if="user">
          <div class="relative user-menu-container">
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-slate-700 hover:bg-slate-900/8 transition-all duration-200"
              @click.stop="userMenuOpen = !userMenuOpen"
            >
              <img
                v-if="authStore.profile?.avatar_url"
                :src="authStore.profile.avatar_url"
                class="w-7 h-7 rounded-full object-cover ring-2 ring-primary-200"
                alt="Avatar"
              >
              <div
                v-else
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium text-xs shadow-sm"
              >
                {{ authStore.displayName?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <span class="hidden sm:inline font-medium">{{ authStore.displayName }}</span>
              <i class="pi pi-chevron-down text-[10px] text-slate-400" />
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/50 py-1 z-50"
              >
                <NuxtLink
                  to="/profile"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <i class="pi pi-user text-slate-400" />
                  My Profile
                </NuxtLink>
                <div class="border-t border-slate-100 my-1" />
                <button
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  @click="handleSignOut"
                >
                  <i class="pi pi-sign-out" />
                  Sign Out
                </button>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Logged out: auth buttons -->
        <template v-else>
          <NuxtLink
            to="/login"
            class="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-900/8 rounded-xl transition-all duration-200"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-95 shadow-sm shadow-primary-600/30 transition-all duration-200"
          >
            Join Now
          </NuxtLink>
        </template>

        <!-- Mobile hamburger -->
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
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200/60 bg-white/80 backdrop-blur-xl py-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl mx-2 transition-all duration-150"
          :class="[
            isActive(item.to) ? 'text-primary-700 font-semibold bg-primary-50' : 'text-slate-700 hover:bg-slate-50',
          ]"
          @click="mobileMenuOpen = false"
        >
          <i :class="item.icon" class="text-xs" />
          {{ item.label }}
        </NuxtLink>

        <template v-if="user">
          <div class="mx-2 mt-2 pt-2 border-t border-slate-100">
            <NuxtLink
              to="/profile"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-150"
              @click="mobileMenuOpen = false"
            >
              <i class="pi pi-user" />
              My Profile
            </NuxtLink>
            <button
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 w-full text-left rounded-xl hover:bg-red-50 transition-all duration-150"
              @click="handleSignOut"
            >
              <i class="pi pi-sign-out" />
              Sign Out
            </button>
          </div>
        </template>

        <template v-else>
          <div class="px-4 pt-2 pb-3 flex gap-2">
            <NuxtLink
              to="/login"
              class="flex-1 text-center py-2 rounded-xl text-sm font-medium text-slate-700 bg-white/50 border border-slate-200 transition-all duration-150"
              @click="mobileMenuOpen = false"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="flex-1 text-center py-2 rounded-xl text-sm font-medium text-white bg-primary-600"
              @click="mobileMenuOpen = false"
            >
              Join Now
            </NuxtLink>
          </div>
        </template>
      </div>
    </Transition>
  </header>
</template>
