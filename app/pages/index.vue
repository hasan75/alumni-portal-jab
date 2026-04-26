<script setup lang="ts">
import ArticleCard from '~/components/news/ArticleCard.vue'
import EventCard from '~/components/events/EventCard.vue'
import JobCard from '~/components/jobs/JobCard.vue'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Alumni Portal — Stay Connected',
  description: 'The official alumni network. Connect with batchmates, discover events, news, and opportunities.',
  ogTitle: 'Alumni Portal — Stay Connected',
  ogDescription: 'The official alumni network. Connect with batchmates, discover events, news, and opportunities.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const { fetchArticles } = useNews()
const { fetchEvents } = useEvents()
const { fetchJobs } = useJobs()
const { appName, institutionName, tagline } = useSiteConfig()

const { data: articles } = await useAsyncData('home-articles', () =>
  fetchArticles({ perPage: 3, featured: true }),
)

const { data: events } = await useAsyncData('home-events', () =>
  fetchEvents({ upcoming: true, perPage: 3 }),
)

const { data: jobs } = await useAsyncData('home-jobs', () =>
  fetchJobs({ perPage: 4, featured: true }),
)

const steps = [
  { n: '01', icon: 'pi pi-user-plus', color: 'var(--color-primary-600)', title: 'Create Your Account', desc: 'Register with your alumni details. Takes under 2 minutes.' },
  { n: '02', icon: 'pi pi-check-circle', color: 'var(--color-system-orange)', title: 'Get Verified', desc: 'Admin team verifies your alumni status within 24–48 hours.' },
  { n: '03', icon: 'pi pi-users', color: 'var(--color-system-green)', title: 'Join the Community', desc: 'Access the feed, directory, events, and exclusive job board.' },
]

const features = [
  { icon: 'pi pi-home', color: 'var(--color-primary-600)', label: 'Alumni Feed', desc: 'Share updates and milestones in a live social feed with your batchmates.' },
  { icon: 'pi pi-users', color: 'var(--color-system-teal)', label: 'Directory', desc: 'Search all active alumni by batch year, location, or industry.' },
  { icon: 'pi pi-calendar', color: 'var(--color-system-purple)', label: 'Events', desc: 'RSVP to reunions, webinars, and workshops. Never miss a gathering.' },
  { icon: 'pi pi-briefcase', color: 'var(--color-system-orange)', label: 'Job Board', desc: 'Post and discover jobs shared exclusively within the alumni network.' },
  { icon: 'pi pi-megaphone', color: 'var(--color-system-green)', label: 'News & Updates', desc: 'Alumni achievements, institutional news, and community announcements.' },
  { icon: 'pi pi-globe', color: 'var(--color-system-blue)', label: 'Global Network', desc: 'Connect with alumni from 50+ countries building lasting relationships.' },
]

const regions = [
  'South Asia', 'Southeast Asia', 'East Asia',
  'Middle East', 'Europe', 'North America',
  'Australia', 'Africa', 'Latin America',
]

const testimonials = [
  {
    quote: 'The alumni network helped me land my first job abroad. The job board had a listing from a senior batch-mate who personally referred me.',
    name: 'Aisha Karim', batch: 'Class of 2019',
    role: 'Software Engineer, Dubai', initial: 'A',
  },
  {
    quote: 'Reconnecting with old friends through the alumni feed was something I didn\'t know I needed. The events section keeps me engaged even from overseas.',
    name: 'Rahul Mehra', batch: 'Class of 2016',
    role: 'Product Manager, Singapore', initial: 'R',
  },
  {
    quote: 'I\'ve attended three reunions now. The portal makes it incredibly easy to RSVP and stay updated. Proud to be part of this community.',
    name: 'Fatima Noor', batch: 'Class of 2021',
    role: 'Resident Doctor, Karachi', initial: 'F',
  },
]
</script>

<template>
  <div>
    <!-- Hero + Stats combined in gradient section -->
    <section class="relative overflow-hidden pb-16 pt-24 px-4 gradient-brand">
      <!-- Floating orbs -->
      <div class="absolute top-16 left-16 w-72 h-72 rounded-full opacity-20 blur-3xl animate-float orb-primary" />
      <div class="absolute bottom-16 right-16 w-56 h-56 rounded-full opacity-20 blur-3xl animate-float delay-3 orb-secondary" />

      <div class="relative max-w-4xl mx-auto text-center mb-14">
        <p class="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4 animate-fade-in-up">Alumni Network</p>
        <h1 class="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight animate-fade-in-up delay-1">
          Welcome to<br>{{ appName }}
        </h1>
        <p class="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-2">
          {{ tagline }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-3">
          <NuxtLink
            to="/register"
            class="relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold rounded-2xl text-white hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all duration-300"
            style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.45);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 8px 32px rgba(0,0,0,0.2);"
          >
            <span class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent" />
            <i class="pi pi-user-plus" />
            Join the Network
          </NuxtLink>
          <NuxtLink
            to="/directory"
            class="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold rounded-2xl text-white/80 hover:text-white hover:bg-white/10 border border-white/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Alumni
            <i class="pi pi-arrow-right text-sm" />
          </NuxtLink>
        </div>
      </div>

      <!-- Stats inside hero -->
      <div class="relative max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(stat, i) in [
            { value: '500+', label: 'Active Alumni' },
            { value: '20+', label: 'Batches' },
            { value: '50+', label: 'Countries' },
            { value: '100+', label: 'Events Hosted' },
          ]"
          :key="stat.label"
          class="glass relative overflow-hidden p-5 text-center animate-fade-in-up"
          :class="`delay-${i + 1}`"
        >
          <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          <p class="text-3xl font-bold text-white tracking-tight">{{ stat.value }}</p>
          <p class="text-white/60 text-xs font-medium mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-16 space-y-20">
      <!-- How It Works -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Getting Started</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">How It Works</h2>
          <p class="mt-2 text-slate-500 max-w-md mx-auto text-sm leading-relaxed">Join in three simple steps and become part of the community.</p>
        </div>
        <div class="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          <!-- Dashed connector (desktop) -->
          <div class="hidden md:block absolute top-[3.5rem] left-[33%] right-[33%] h-px border-t-2 border-dashed border-slate-200" />
          <div v-for="step in steps" :key="step.n" class="text-center relative z-10">
            <div
              class="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mb-5 text-primary-700"
              style="background: color-mix(in srgb, var(--color-primary-100) 80%, transparent); border: 1px solid var(--color-primary-200);"
            >
              {{ step.n }}
            </div>
            <div
              class="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              :style="`background: color-mix(in srgb, ${step.color} 12%, transparent); border: 1px solid color-mix(in srgb, ${step.color} 25%, transparent);`"
            >
              <i :class="step.icon" class="text-2xl" :style="`color: ${step.color}`" />
            </div>
            <h3 class="font-semibold text-slate-900 mb-2">{{ step.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed max-w-[14rem] mx-auto">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Features / Why Join -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Everything You Need</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Why Join?</h2>
          <p class="mt-2 text-slate-500 max-w-md mx-auto text-sm leading-relaxed">One portal for your entire alumni experience.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="f in features"
            :key="f.label"
            class="glass relative overflow-hidden p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                :style="`background: color-mix(in srgb, ${f.color} 14%, transparent); border: 1px solid color-mix(in srgb, ${f.color} 28%, transparent);`"
              >
                <i :class="f.icon" class="text-xl" :style="`color: ${f.color}`" />
              </div>
              <h3 class="font-semibold text-slate-900 mb-2">{{ f.label }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Network / Global Reach -->
      <section class="relative overflow-hidden rounded-[28px] px-10 py-14 gradient-brand animate-fade-in-up">
        <div class="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl orb-primary" />
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: text -->
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-white/60 mb-3">Global Presence</p>
            <h2 class="text-3xl font-semibold tracking-tight text-white mb-4">Alumni Spanning the Globe</h2>
            <p class="text-white/60 leading-relaxed mb-6 max-w-sm">From Silicon Valley to Singapore, our alumni community reaches every corner of the world.</p>
            <NuxtLink
              to="/directory"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white transition-colors"
            >
              Browse Directory <i class="pi pi-arrow-right text-xs" />
            </NuxtLink>
          </div>
          <!-- Right: region badges + mini stats -->
          <div>
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="region in regions"
                :key="region"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 rounded-full"
                style="background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-system-green shrink-0" />
                {{ region }}
              </span>
            </div>
            <p class="text-white/50 text-xs">
              500+ Alumni &nbsp;·&nbsp; 50+ Countries &nbsp;·&nbsp; 20+ Batches
            </p>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Alumni Voices</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">What Members Say</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div
            v-for="(t, i) in testimonials"
            :key="t.name"
            class="glass relative overflow-hidden p-7 flex flex-col gap-4 animate-fade-in-up"
            :class="`delay-${i + 1}`"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative flex-1">
              <p class="text-5xl text-primary-200 font-serif leading-none mb-1 select-none">"</p>
              <p class="text-sm text-slate-600 leading-relaxed italic">{{ t.quote }}</p>
            </div>
            <div class="relative flex items-center gap-3 pt-4 border-t border-slate-100">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 avatar-gradient">
                {{ t.initial }}
              </div>
              <div>
                <p class="font-semibold text-slate-900 text-sm">{{ t.name }}</p>
                <p class="text-xs text-slate-500">{{ t.role }} · {{ t.batch }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Events -->
      <section v-if="events && events.length > 0" class="animate-fade-in-up">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">What's On</p>
            <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Upcoming Events</h2>
          </div>
          <NuxtLink to="/events" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl">
            View all <i class="pi pi-arrow-right text-xs" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <EventCard v-for="event in events" :key="event.id" :event="event" />
        </div>
      </section>

      <!-- Latest News -->
      <section v-if="articles && articles.length > 0" class="animate-fade-in-up">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Community</p>
            <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Latest News</h2>
          </div>
          <NuxtLink to="/news" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors">
            View all <i class="pi pi-arrow-right text-xs" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>
      </section>

      <!-- Job Spotlight -->
      <section v-if="jobs && jobs.length > 0" class="animate-fade-in-up">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Opportunities</p>
            <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Job Opportunities</h2>
          </div>
          <NuxtLink to="/jobs" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors">
            View all <i class="pi pi-arrow-right text-xs" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
      </section>

      <!-- CTA -->
      <section class="relative overflow-hidden rounded-[28px] p-12 text-center animate-fade-in-up gradient-brand">
        <div class="absolute top-0 left-1/3 w-48 h-48 rounded-full opacity-20 blur-3xl orb-secondary" />
        <div class="relative">
          <p class="text-xs font-semibold tracking-widest uppercase text-white/60 mb-3">Get Started</p>
          <h2 class="text-3xl font-semibold text-white tracking-tight mb-3">Are you an alumnus of {{ institutionName }}?</h2>
          <p class="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">Join the community to connect with your batchmates, RSVP to events, and more.</p>
          <NuxtLink
            to="/register"
            class="relative overflow-hidden inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-2xl text-white hover:-translate-y-1 active:scale-95 transition-all duration-200"
            style="background:rgba(255,255,255,0.20);border:1px solid rgba(255,255,255,0.4);box-shadow:0 2px 0 rgba(255,255,255,0.4) inset,0 8px 24px rgba(0,0,0,0.2);"
          >
            <span class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent" />
            <i class="pi pi-user-plus" />
            Register Now
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

