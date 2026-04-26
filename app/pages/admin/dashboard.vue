<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Dashboard | Admin', robots: 'noindex' })

const supabase = useSupabaseClient()
const { appName } = useSiteConfig()

const stats = ref({
  pendingMembers: 0,
  activeMembers: 0,
  upcomingEvents: 0,
  publishedArticles: 0,
  openJobs: 0,
  recentPosts: 0,
})

const recentPendingMembers = ref<any[]>([])

onMounted(async () => {
  const [pending, active, events, articles, jobs, posts, recentPending] = await Promise.all([
    supabase.from('alumni_profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('alumni_profiles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('start_datetime', new Date().toISOString()),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('feed_posts').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('alumni_profiles').select('id, full_name, email, batch_year, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
  ])

  stats.value = {
    pendingMembers: pending.count || 0,
    activeMembers: active.count || 0,
    upcomingEvents: events.count || 0,
    publishedArticles: articles.count || 0,
    openJobs: jobs.count || 0,
    recentPosts: posts.count || 0,
  }

  recentPendingMembers.value = recentPending.data || []
})

const statCards = computed(() => [
  { label: 'Pending Approvals', value: stats.value.pendingMembers, icon: 'pi pi-clock', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', to: '/admin/members?status=pending', urgent: stats.value.pendingMembers > 0 },
  { label: 'Active Members', value: stats.value.activeMembers, icon: 'pi pi-users', iconBg: 'bg-green-50', iconColor: 'text-green-600', to: '/admin/members' },
  { label: 'Upcoming Events', value: stats.value.upcomingEvents, icon: 'pi pi-calendar', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', to: '/admin/events' },
  { label: 'Published Articles', value: stats.value.publishedArticles, icon: 'pi pi-megaphone', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', to: '/admin/news' },
  { label: 'Open Jobs', value: stats.value.openJobs, icon: 'pi pi-briefcase', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', to: '/admin/jobs' },
  { label: 'Posts This Week', value: stats.value.recentPosts, icon: 'pi pi-comments', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', to: '/admin/feed' },
])
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="animate-fade-in-up">
      <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-1">Overview</p>
      <h1 class="text-3xl font-semibold tracking-tight text-slate-800">Dashboard</h1>
      <p class="text-slate-500 text-sm mt-1">Welcome to {{ appName }} Admin Panel</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <NuxtLink
        v-for="(card, i) in statCards"
        :key="card.label"
        :to="card.to"
        class="bg-white border rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300 animate-fade-in-up"
        :class="[`delay-${i + 1}`, card.urgent ? 'border-amber-300' : 'border-slate-200']"
      >
        <div :class="[card.iconBg, card.iconColor]" class="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
          <i :class="card.icon" class="text-sm" />
        </div>
        <p class="text-2xl font-bold text-slate-900 tracking-tight">{{ card.value }}</p>
        <p class="text-xs text-slate-500 mt-0.5 font-medium">{{ card.label }}</p>
      </NuxtLink>
    </div>

    <!-- Pending Members -->
    <div v-if="recentPendingMembers.length > 0" class="bg-white border border-amber-200 rounded-xl p-6 animate-fade-in-up delay-3">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-semibold text-slate-900 flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50">
            <i class="pi pi-clock text-amber-600 text-sm" />
          </div>
          Pending Approvals
        </h2>
        <NuxtLink to="/admin/members?status=pending" class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1">
          View all <i class="pi pi-arrow-right text-[10px]" />
        </NuxtLink>
      </div>
      <div class="space-y-0">
        <div
          v-for="member in recentPendingMembers"
          :key="member.id"
          class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
        >
          <div>
            <p class="text-sm font-medium text-slate-900">{{ member.full_name }}</p>
            <p class="text-xs text-slate-500">{{ member.email }}<span v-if="member.batch_year"> · Class of {{ member.batch_year }}</span></p>
          </div>
          <NuxtLink
            :to="`/admin/members/${member.id}`"
            class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-1 rounded-lg hover:bg-primary-50"
          >
            Review →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-4">
      <NuxtLink
        v-for="link in [
          { label: 'Add Event', icon: 'pi pi-calendar-plus', to: '/admin/events/new', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderHover: 'hover:border-blue-200' },
          { label: 'Write Article', icon: 'pi pi-file-edit', to: '/admin/news/new', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', borderHover: 'hover:border-sky-200' },
          { label: 'Post Job', icon: 'pi pi-briefcase', to: '/admin/jobs/new', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', borderHover: 'hover:border-orange-200' },
          { label: 'App Settings', icon: 'pi pi-cog', to: '/admin/settings', iconBg: 'bg-slate-100', iconColor: 'text-slate-600', borderHover: 'hover:border-slate-300' },
        ]"
        :key="link.to"
        :to="link.to"
        class="bg-white border border-slate-200 rounded-xl flex items-center gap-3 p-5 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300"
        :class="link.borderHover"
      >
        <div :class="[link.iconBg, link.iconColor]" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
          <i :class="link.icon" />
        </div>
        <span class="font-medium text-slate-900 text-sm">{{ link.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

