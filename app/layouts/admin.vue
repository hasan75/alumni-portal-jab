<script setup lang="ts">
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Drawer from 'primevue/drawer'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()

const { appName } = useSiteConfig()

const mobileMenuOpen = ref(false)
const sidebarCollapsed = ref(false)

const pendingCount = ref(0)

const navSections = computed(() => [
  {
    key: 'members',
    label: 'Members',
    items: [
      { label: 'All Members', icon: 'pi pi-users', to: '/admin/members' },
      {
        label: 'Pending Approval',
        icon: 'pi pi-clock',
        to: '/admin/members?status=pending',
        badge: pendingCount.value > 0 ? String(pendingCount.value) : undefined,
      },
      { label: 'Batches', icon: 'pi pi-calendar', to: '/admin/batches' },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    items: [
      { label: 'Events', icon: 'pi pi-calendar-plus', to: '/admin/events' },
      { label: 'News', icon: 'pi pi-megaphone', to: '/admin/news' },
      { label: 'Jobs', icon: 'pi pi-briefcase', to: '/admin/jobs' },
      { label: 'Staff', icon: 'pi pi-id-card', to: '/admin/staff' },
      { label: 'Feed Moderation', icon: 'pi pi-comments', to: '/admin/feed' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    items: [
      { label: 'App Settings', icon: 'pi pi-cog', to: '/admin/settings' },
      { label: 'Audit Log', icon: 'pi pi-list', to: '/admin/audit-log' },
    ],
  },
])

const userMenu = ref()
const userMenuItems = ref([
  {
    label: user.value?.email || 'Admin',
    items: [
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: async () => {
          await supabase.auth.signOut()
          navigateTo('/admin/login')
        },
      },
    ],
  },
])

function toggleUserMenu(event: Event) {
  userMenu.value.toggle(event)
}

function isActive(navTo: string) {
  const [navPath, navQuery] = navTo.split('?')
  const currentPath = route.path
  const currentQuery = route.query

  if (navQuery) {
    if (currentPath !== navPath) return false
    const params = new URLSearchParams(navQuery)
    for (const [key, value] of params.entries()) {
      if (currentQuery[key] !== value) return false
    }
    return true
  }

  if (currentPath === navPath) {
    const allNavItems = navSections.value.flatMap(s => s.items)
    const hasQuerySibling = allNavItems.some((item) => {
      if (!item.to.includes('?')) return false
      const [sibPath, sibQuery] = item.to.split('?')
      if (sibPath !== navPath) return false
      const params = new URLSearchParams(sibQuery)
      for (const [key, value] of params.entries()) {
        if (currentQuery[key] === value) return true
      }
      return false
    })
    return !hasQuerySibling
  }

  if (currentPath.startsWith(`${navPath}/`)) {
    const allNavPaths = navSections.value.flatMap(s => s.items.map(i => i.to.split('?')[0]))
    const hasMoreSpecificMatch = allNavPaths.some(p => p !== navPath && currentPath.startsWith(p))
    return !hasMoreSpecificMatch
  }

  return false
}

function navigateAndClose(to: string) {
  navigateTo(to)
  mobileMenuOpen.value = false
}

onMounted(async () => {
  const supabaseClient = useSupabaseClient()
  const { count } = await supabaseClient
    .from('alumni_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
  pendingCount.value = count || 0
})
</script>

<template>
  <div class="min-h-screen gradient-brand-light">    <!-- Sidebar (Desktop) -->
    <aside
      class="glass-sidebar fixed left-0 top-0 z-40 h-screen transition-all duration-300 hidden lg:block overflow-visible"
      :class="sidebarCollapsed ? 'w-16' : 'w-60'"
    >
      <!-- Logo -->
      <div class="flex h-14 items-center px-3 border-b border-white/30" :class="sidebarCollapsed ? 'justify-center' : ''">
        <NuxtLink v-if="!sidebarCollapsed" to="/admin/dashboard" class="flex items-center gap-2.5 group">
          <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-8 w-8 rounded-xl object-cover shadow-md shadow-primary-500/30 group-hover:scale-105 transition-transform duration-200" />
          <div>
            <p class="font-semibold text-slate-800 text-sm leading-tight tracking-tight">{{ appName }}</p>
            <p class="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Admin Panel</p>
          </div>
        </NuxtLink>
        <NuxtLink v-else to="/admin/dashboard">
          <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-8 w-8 rounded-xl object-cover shadow-md shadow-primary-500/30" />
        </NuxtLink>
      </div>

      <!-- Floating collapse/expand toggle -->
      <button
        class="absolute top-4 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-400 hover:text-slate-700 hover:shadow-lg active:scale-90 transition-all duration-200"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <i :class="sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'" class="text-xs" />
      </button>

      <!-- Navigation -->
      <nav class="flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div class="flex-1 py-3 px-2">
          <!-- Dashboard -->
          <NuxtLink
            to="/admin/dashboard"
            class="flex items-center gap-3 rounded-xl px-3 py-2 mb-2 text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/admin/dashboard')
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'text-slate-600 hover:bg-slate-100/80',
            ]"
            :title="sidebarCollapsed ? 'Dashboard' : undefined"
          >
            <i class="pi pi-th-large" />
            <span v-if="!sidebarCollapsed">Dashboard</span>
          </NuxtLink>

          <!-- Sections -->
          <div v-for="section in navSections" :key="section.key" class="mb-4">
            <div v-if="!sidebarCollapsed" class="px-3 py-1.5">
              <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {{ section.label }}
              </p>
            </div>
            <div v-else class="border-t border-white/30 my-2" />

            <NuxtLink
              v-for="item in section.items"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200"
              :class="[
                isActive(item.to)
                  ? 'bg-primary-600 text-white font-medium shadow-sm shadow-primary-600/30'
                  : 'text-slate-600 hover:bg-slate-100/80',
              ]"
              :title="sidebarCollapsed ? item.label : undefined"
            >
              <i :class="item.icon" class="text-base shrink-0" />
              <span v-if="!sidebarCollapsed" class="flex-1">{{ item.label }}</span>
              <span
                v-if="!sidebarCollapsed && item.badge"
                class="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-white/30 p-2">
          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-100/80 transition-all duration-200"
            :title="sidebarCollapsed ? 'View Site' : undefined"
          >
            <i class="pi pi-external-link" />
            <span v-if="!sidebarCollapsed">View Site</span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Top Header -->
    <header
      class="glass-nav fixed top-0 right-0 z-30 h-14 flex items-center justify-between px-4 transition-all duration-300"
      :class="sidebarCollapsed ? 'lg:left-16' : 'lg:left-60'"
      style="left: 0;"
    >
      <div class="flex items-center gap-3">
        <button
          class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition-all duration-200"
          @click="mobileMenuOpen = true"
        >
          <i class="pi pi-bars" />
        </button>
        <NuxtLink to="/admin/dashboard" class="lg:hidden flex items-center gap-2">
          <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-7 w-7 rounded-lg object-cover shadow-sm" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-500 hidden sm:inline font-medium">{{ user?.email }}</span>
        <Button text rounded class="p-0 hover:scale-105 transition-transform duration-200" @click="toggleUserMenu">
          <Avatar
            :label="user?.email?.charAt(0).toUpperCase() || 'A'"
            shape="circle"
            class="bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold"
            style="width: 32px; height: 32px;"
          />
        </Button>
        <Menu ref="userMenu" :model="userMenuItems" popup />
      </div>
    </header>

    <!-- Mobile Drawer -->
    <Drawer v-model:visible="mobileMenuOpen" position="left" class="w-72" :show-close-icon="true">
      <template #header>
        <div class="flex items-center gap-2.5">
          <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-8 w-8 rounded-xl object-cover shadow-md shadow-primary-500/30" />
          <div>
            <p class="font-semibold text-slate-900 tracking-tight">{{ appName }}</p>
            <p class="text-xs text-slate-400 font-medium tracking-wide uppercase">Admin Panel</p>
          </div>
        </div>
      </template>
      <nav class="py-2">
        <button
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left rounded-xl mx-0 transition-all duration-150"
          :class="[
            isActive('/admin/dashboard')
              ? 'bg-primary-600 text-white font-medium'
              : 'text-slate-700 hover:bg-slate-50',
          ]"
          @click="navigateAndClose('/admin/dashboard')"
        >
          <i class="pi pi-th-large" />
          <span>Dashboard</span>
        </button>
        <div v-for="section in navSections" :key="section.key" class="mt-4">
          <div class="px-4 py-1.5">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {{ section.label }}
            </p>
          </div>
          <button
            v-for="item in section.items"
            :key="item.to"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-left rounded-xl transition-all duration-150"
            :class="[
              isActive(item.to)
                ? 'bg-primary-600 text-white font-medium'
                : 'text-slate-700 hover:bg-slate-50',
            ]"
            @click="navigateAndClose(item.to)"
          >
            <i :class="item.icon" />
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-100">
          <NuxtLink to="/" target="_blank" class="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all duration-150">
            <i class="pi pi-external-link" />
            <span>View Site</span>
          </NuxtLink>
        </div>
      </nav>
    </Drawer>

    <!-- Main Content -->
    <main
      class="pt-14 min-h-screen transition-all duration-300"
      :class="sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'"
    >
      <div class="p-4 lg:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

