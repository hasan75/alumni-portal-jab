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
  { label: 'Pending Approvals', value: stats.value.pendingMembers, icon: 'pi pi-clock', color: 'bg-amber-400/20 text-amber-300', to: '/admin/members?status=pending', urgent: stats.value.pendingMembers > 0 },
  { label: 'Active Members', value: stats.value.activeMembers, icon: 'pi pi-users', color: 'bg-green-400/20 text-green-300', to: '/admin/members' },
  { label: 'Upcoming Events', value: stats.value.upcomingEvents, icon: 'pi pi-calendar', color: 'bg-blue-400/20 text-blue-300', to: '/admin/events' },
  { label: 'Published Articles', value: stats.value.publishedArticles, icon: 'pi pi-megaphone', color: 'bg-purple-400/20 text-purple-300', to: '/admin/news' },
  { label: 'Open Jobs', value: stats.value.openJobs, icon: 'pi pi-briefcase', color: 'bg-orange-400/20 text-orange-300', to: '/admin/jobs' },
  { label: 'Posts This Week', value: stats.value.recentPosts, icon: 'pi pi-comments', color: 'bg-sky-400/20 text-sky-300', to: '/admin/feed' },
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
        class="glass relative overflow-hidden p-5 hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all duration-300 animate-fade-in-up"
        :class="`delay-${i + 1}`"
        :style="card.urgent ? 'border-color:rgba(251,191,36,0.5)!important;' : ''"
      >
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        <div class="relative">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" :class="card.color">
            <i :class="card.icon" class="text-sm" />
          </div>
          <p class="text-2xl font-bold text-white tracking-tight">{{ card.value }}</p>
          <p class="text-xs text-white/60 mt-0.5 font-medium">{{ card.label }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Pending Members -->
    <div v-if="recentPendingMembers.length > 0" class="glass relative overflow-hidden p-6 animate-fade-in-up delay-3" style="border-color:rgba(251,191,36,0.4)!important;">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-amber-400/10 via-transparent to-transparent" />
      <div class="relative">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-semibold text-white flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:rgba(251,191,36,0.2);border:1px solid rgba(251,191,36,0.3);">
              <i class="pi pi-clock text-amber-300 text-sm" />
            </div>
            Pending Approvals
          </h2>
          <NuxtLink to="/admin/members?status=pending" class="text-xs font-medium text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
            View all <i class="pi pi-arrow-right text-[10px]" />
          </NuxtLink>
        </div>
        <div class="space-y-2">
          <div
            v-for="member in recentPendingMembers"
            :key="member.id"
            class="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-white">{{ member.full_name }}</p>
              <p class="text-xs text-white/50">{{ member.email }}<span v-if="member.batch_year"> · Class of {{ member.batch_year }}</span></p>
            </div>
            <NuxtLink
              :to="`/admin/members/${member.id}`"
              class="text-xs font-medium text-white/60 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
            >
              Review →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-4">
      <NuxtLink
        v-for="link in [
          { label: 'Add Event', icon: 'pi pi-calendar-plus', to: '/admin/events/new', gradient: 'from-blue-500/20 to-blue-600/10', border: 'rgba(59,130,246,0.3)', icon_bg: 'rgba(59,130,246,0.2)', icon_color: '#93c5fd' },
          { label: 'Write Article', icon: 'pi pi-file-edit', to: '/admin/news/new', gradient: 'from-sky-500/20 to-sky-600/10', border: 'rgba(14,165,233,0.3)', icon_bg: 'rgba(14,165,233,0.2)', icon_color: '#7dd3fc' },
          { label: 'Post Job', icon: 'pi pi-briefcase', to: '/admin/jobs/new', gradient: 'from-orange-500/20 to-orange-600/10', border: 'rgba(249,115,22,0.3)', icon_bg: 'rgba(249,115,22,0.2)', icon_color: '#fdba74' },
          { label: 'App Settings', icon: 'pi pi-cog', to: '/admin/settings', gradient: 'from-white/10 to-transparent', border: 'rgba(255,255,255,0.2)', icon_bg: 'rgba(255,255,255,0.1)', icon_color: '#cbd5e1' },
        ]"
        :key="link.to"
        :to="link.to"
        class="glass relative overflow-hidden flex items-center gap-3 p-5 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300"
        :style="`border-color:${link.border}!important;`"
      >
        <div class="pointer-events-none absolute inset-0 rounded-[20px]" :class="`bg-gradient-to-br ${link.gradient}`" />
        <div class="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="`background:${link.icon_bg};border:1px solid ${link.border};`">
          <i :class="link.icon" :style="`color:${link.icon_color};`" />
        </div>
        <span class="relative font-medium text-white text-sm">{{ link.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

