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
  { label: 'About', icon: 'pi pi-info-circle', to: '/about' },
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

onMounted(async () => {
  document.addEventListener('click', closeUserMenu)
  if (!authStore.isLoaded) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser?.id) {
      await authStore.loadProfile(authUser.id)
    }
  }
})
onUnmounted(() => document.removeEventListener('click', closeUserMenu))
</script>

<template>
  <header class="glass-nav sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink :to="user ? '/feed' : '/'" class="flex items-center gap-2.5 shrink-0 group">
        <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-9 w-9 rounded-xl object-cover shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-200" />
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
              <AppAvatar :src="authStore.profile?.avatar_url" :name="authStore.displayName || user?.email" size="xs" />
              <span class="hidden sm:inline font-medium">{{ authStore.displayName || user?.email }}</span>
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

    <!-- Mobile drawer overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" @click="mobileMenuOpen = false" />
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="mobileMenuOpen" class="md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto">
          <!-- Drawer header -->
          <div class="flex items-center justify-between px-4 h-16 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-8 w-8 rounded-xl object-cover" />
              <span class="font-semibold text-slate-900 text-sm tracking-tight">{{ appName }}</span>
            </div>
            <button class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150" @click="mobileMenuOpen = false">
              <i class="pi pi-times text-sm" />
            </button>
          </div>

          <!-- Nav items -->
          <nav class="p-3 space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-150"
              :class="[
                isActive(item.to) ? 'text-primary-700 font-semibold bg-primary-50' : 'text-slate-700 hover:bg-slate-50',
              ]"
              @click="mobileMenuOpen = false"
            >
              <i :class="item.icon" class="text-xs" />
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- User section -->
          <div class="px-3 mt-2 pt-3 border-t border-slate-100">
            <template v-if="user">
              <div class="flex items-center gap-3 px-4 py-3 mb-2">
                <AppAvatar :src="authStore.profile?.avatar_url" :name="authStore.displayName || user?.email" size="sm" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-900 truncate">{{ authStore.displayName || 'User' }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ user.email }}</p>
                </div>
              </div>
              <NuxtLink
                to="/profile"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-150"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-user text-xs" />
                My Profile
              </NuxtLink>
              <button
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 w-full text-left rounded-xl hover:bg-red-50 transition-all duration-150"
                @click="handleSignOut"
              >
                <i class="pi pi-sign-out text-xs" />
                Sign Out
              </button>
            </template>

            <template v-else>
              <div class="flex flex-col gap-2 px-1 pb-3">
                <NuxtLink
                  to="/login"
                  class="text-center py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all duration-150"
                  @click="mobileMenuOpen = false"
                >
                  Sign In
                </NuxtLink>
                <NuxtLink
                  to="/register"
                  class="text-center py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 transition-all duration-150"
                  @click="mobileMenuOpen = false"
                >
                  Join Now
                </NuxtLink>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
