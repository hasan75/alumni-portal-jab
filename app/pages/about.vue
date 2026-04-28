<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'About the School | JAB Alumni',
  description: 'Learn about Janata Adarsha Bidyapith — established 1969, Palash, Narsingdi. History, academics, campus, headmasters, and more.',
  ogTitle: 'About Janata Adarsha Bidyapith | JAB Alumni',
  ogDescription: 'Established in 1969, Janata Adarsha Bidyapith is a leading secondary school in Palash, Narsingdi under the Dhaka Education Board.',
})

const stats = [
  { value: '1969', label: 'Founded', icon: 'pi pi-calendar' },
  { value: '1046+', label: 'Students', icon: 'pi pi-users' },
  { value: '24', label: 'Teachers', icon: 'pi pi-user' },
  { value: '3', label: 'Streams', icon: 'pi pi-book' },
  { value: '4', label: 'Buildings', icon: 'pi pi-building' },
  { value: '104', label: 'Decimals of Land', icon: 'pi pi-map' },
]

const factTable = [
  { label: 'EIIN', value: '112739' },
  { label: 'MPO Number', value: '3103081302' },
  { label: 'Education Board', value: 'Dhaka' },
  { label: 'Institute Type', value: 'Non-government Secondary' },
  { label: 'MPO Status', value: 'Yes' },
  { label: 'Gender Policy', value: 'Co-educational' },
  { label: 'Shift', value: 'Day' },
  { label: 'Management', value: 'Special Committee' },
  { label: 'Medium', value: 'Bangla' },
]

const streams = [
  { name: 'Science', icon: 'pi pi-bolt', color: 'var(--color-system-blue)', desc: 'Physics, Chemistry, Biology, and Mathematics for students pursuing scientific and technical careers.' },
  { name: 'Business Studies', icon: 'pi pi-chart-line', color: 'var(--color-system-orange)', desc: 'Accounting, Finance, and Business fundamentals preparing students for commerce and management.' },
  { name: 'Humanities', icon: 'pi pi-book', color: 'var(--color-system-purple)', desc: 'History, Geography, Civics, and Literature for students with interests in arts and social sciences.' },
]

const campus = [
  { label: 'Total Land', value: '344 Decimals', sub: '~1.39 hectares' },
  { label: 'Playground', value: '312 Decimals', sub: '~1.26 hectares' },
  { label: 'Floor Space', value: '7,620 Sq. Ft.', sub: '~708 sq. meters' },
  { label: 'Total Rooms', value: '26', sub: 'Across 4 buildings' },
]

const staffRatios = [
  { label: 'Student : Teacher', value: '35 : 1' },
  { label: 'Student : Employee', value: '177 : 1' },
  { label: 'Average Teacher Age', value: '43 Years' },
]

const timeline = [
  { year: '1969', title: 'School Established', desc: 'Janata Adarsha Bidyapith founded on 18 March in Palash Bagpara village, Palash, Narsingdi.' },
  { year: '1970', title: 'First Headmaster', desc: 'Mijanur Rahman Chowdhury (B.A., B.Ed.) takes charge as the founding headmaster on 1 October.' },
  { year: '1973', title: 'Government Recognition', desc: 'Official government recognition granted on 1 January — just 4 years after founding.' },
  { year: '1973', title: 'MPO Enlisted', desc: 'School included in the Monthly Pay Order system, with teacher salaries funded by the government.' },
  { year: '1989', title: 'Leadership Transition', desc: 'Founding headmaster completes nearly 19 years of service. M. A. Alim takes charge in September.' },
  { year: '2003', title: 'Md. Shahabuddin Confirmed', desc: 'After serving as Acting Headmaster since 2000, Md. Shahabuddin is confirmed as full Headmaster.' },
  { year: '2019', title: 'Current Headmaster', desc: 'Md. Masud Khan (M.S.S, B.Ed.) takes charge as the 7th headmaster on 6 November.' },
]

const headmasters = [
  { name: 'Mijanur Rahman Chowdhury', quals: 'B.A., B.Ed.', period: '1970 – 1989', role: 'Headmaster', current: false, years: '~19 years', tenure: 19, ordinal: '1st' },
  { name: 'Babu Shurja Mohan Dutta', quals: 'B.S.S., B.Ed.', period: '1989', role: 'Acting Headmaster', current: false, years: '~1 month', tenure: 0.1, ordinal: '2nd' },
  { name: 'M. A. Alim', quals: 'B.A., L.L.B.', period: '1989 – 1997', role: 'Headmaster', current: false, years: '~8 years', tenure: 8, ordinal: '3rd' },
  { name: 'Abdul Wahab', quals: 'B.A., B.Ed.', period: '1998', role: 'Headmaster', current: false, years: '~10 months', tenure: 0.8, ordinal: '4th' },
  { name: 'Kazi Mohammad Razi Uddin', quals: 'B.A., B.Ed.', period: '1998 – 2000', role: 'Headmaster', current: false, years: '~1 year', tenure: 1.3, ordinal: '5th' },
  { name: 'Md. Shahabuddin', quals: 'B.Sc., B.Ed.', period: '2000 – 2019', role: 'Headmaster', current: false, years: '~20 years', tenure: 20, ordinal: '6th' },
  { name: 'Md. Masud Khan', quals: 'M.S.S, B.Ed.', period: '2019 – present', role: 'Headmaster', current: true, years: 'Since 2019', tenure: 6, ordinal: '7th' },
]

const maxTenure = Math.max(...headmasters.map(h => h.tenure))

const location = [
  { label: 'Village', value: 'Palash Baghpara' },
  { label: 'Post Office', value: 'Palash' },
  { label: 'Upazila', value: 'Palash' },
  { label: 'District', value: 'Narsingdi' },
  { label: 'Division', value: 'Dhaka' },
  { label: 'Geography', value: 'Plain Land' },
]

const community = [
  { icon: 'pi pi-graduation-cap', title: 'Accessible Education', desc: 'Providing affordable secondary education to students from surrounding villages and communities for over 55 years.' },
  { icon: 'pi pi-chart-bar', title: 'Literacy Improvement', desc: 'Contributing to improved literacy rates and creating pathways to higher education for local students.' },
  { icon: 'pi pi-star', title: 'Extracurricular Activities', desc: 'Hosting sports, cultural programs, and national day observances that enrich student development.' },
  { icon: 'pi pi-heart', title: 'Community Trust', desc: 'Built a strong community-based reputation, with families choosing the school for its consistent academic standards.' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden pb-16 pt-24 px-4 gradient-brand">
      <div class="absolute top-16 left-16 w-72 h-72 rounded-full opacity-20 blur-3xl animate-float orb-primary" />
      <div class="absolute bottom-16 right-16 w-56 h-56 rounded-full opacity-20 blur-3xl animate-float delay-3 orb-secondary" />

      <div class="relative max-w-4xl mx-auto text-center">
        <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white shadow-xl border border-white/30 flex items-center justify-center animate-fade-in-up">
          <img src="/images/logo_jap.png" alt="Janata Adarsha Bidyapith" class="w-[5.5rem] h-[5.5rem] rounded-xl object-cover" />
        </div>
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-3 animate-fade-in-up delay-1">
          Janata Adarsha Bidyapith
        </h1>
        <p class="text-lg text-white/70 mb-2 animate-fade-in-up delay-2">People's Model Institute of Learning</p>
        <p class="text-sm text-white/50 mb-6 animate-fade-in-up delay-3">
          Established 18 March 1969 &middot; Palash, Narsingdi, Bangladesh
        </p>
        <span class="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white/80 rounded-full animate-fade-in-up delay-4" style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);">
          <i class="pi pi-verified text-system-blue" />
          EIIN 112739
        </span>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-16 space-y-20">

      <!-- At a Glance -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Quick Facts</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">At a Glance</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="(s, i) in stats"
            :key="s.label"
            class="glass relative overflow-hidden p-5 text-center animate-fade-in-up"
            :class="`delay-${i + 1}`"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <i :class="s.icon" class="text-xl text-primary-600 mb-2" />
              <p class="text-2xl font-bold text-slate-900 tracking-tight">{{ s.value }}</p>
              <p class="text-slate-500 text-xs font-medium mt-1">{{ s.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- About the School -->
      <section class="animate-fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div class="lg:col-span-3">
            <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Overview</p>
            <h2 class="text-3xl font-semibold tracking-tight text-slate-900 mb-4">About the School</h2>
            <div class="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                Janata Adarsha Bidyapith is a non-government secondary school established on 18 March 1969 in the village
                of Palash Bagpara, under Char Palash mouza, Palash Upazila, Narsingdi District. The school was founded
                through the initiative of local education enthusiasts and with the cooperation of the community.
              </p>
              <p>
                The school received government recognition on 1 January 1973 and was subsequently enlisted under the MPO
                (Monthly Pay Order) system, meaning teachers' salaries are paid by the government. It currently offers
                secondary-level (SSC) education in three streams: Science, Business Studies, and Humanities.
              </p>
              <p>
                For over 55 years, the school has been educating students from Palash Upazila and surrounding areas. Alumni
                of the school are working with distinction in various fields across the country, and many have achieved
                notable success in higher education.
              </p>
            </div>
          </div>
          <div class="lg:col-span-2">
            <div class="glass relative overflow-hidden p-6">
              <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
              <div class="relative">
                <h3 class="font-semibold text-slate-900 mb-4 text-sm">Key Information</h3>
                <div class="space-y-3">
                  <div v-for="fact in factTable" :key="fact.label" class="flex justify-between items-baseline text-sm">
                    <span class="text-slate-500">{{ fact.label }}</span>
                    <span class="font-medium text-slate-900">{{ fact.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Academic Profile -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Academics</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Academic Profile</h2>
          <p class="mt-2 text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Students sit for the SSC (Secondary School Certificate) examination under the Dhaka Education Board.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div
            v-for="(stream, i) in streams"
            :key="stream.name"
            class="glass relative overflow-hidden p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
            :class="`delay-${i + 1}`"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                :style="`background: color-mix(in srgb, ${stream.color} 14%, transparent); border: 1px solid color-mix(in srgb, ${stream.color} 28%, transparent);`"
              >
                <i :class="stream.icon" class="text-xl" :style="`color: ${stream.color}`" />
              </div>
              <h3 class="font-semibold text-slate-900 mb-2">{{ stream.name }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ stream.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Campus & Facilities -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Infrastructure</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Campus & Facilities</h2>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div
            v-for="(c, i) in campus"
            :key="c.label"
            class="glass relative overflow-hidden p-5 text-center animate-fade-in-up"
            :class="`delay-${i + 1}`"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <p class="text-2xl font-bold text-slate-900 tracking-tight">{{ c.value }}</p>
              <p class="text-slate-500 text-xs font-medium mt-1">{{ c.label }}</p>
              <p class="text-slate-400 text-[10px] mt-0.5">{{ c.sub }}</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="(r, i) in staffRatios"
            :key="r.label"
            class="glass relative overflow-hidden p-4 text-center animate-fade-in-up"
            :class="`delay-${i + 1}`"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <p class="text-lg font-bold text-slate-900">{{ r.value }}</p>
              <p class="text-slate-500 text-xs font-medium">{{ r.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- History Timeline -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Milestones</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">History Timeline</h2>
        </div>
        <div class="relative max-w-2xl mx-auto">
          <div class="absolute left-6 top-0 bottom-0 w-px bg-primary-200" />
          <div
            v-for="(event, i) in timeline"
            :key="i"
            class="relative pl-16 pb-10 last:pb-0 animate-fade-in-up"
            :class="`delay-${Math.min(i + 1, 6)}`"
          >
            <div class="absolute left-3 top-1 w-7 h-7 rounded-full bg-primary-100 border-2 border-primary-400 flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <div class="glass relative overflow-hidden p-5">
              <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
              <div class="relative">
                <span class="text-xs font-bold text-primary-600">{{ event.year }}</span>
                <h3 class="font-semibold text-slate-900 mt-1">{{ event.title }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed mt-1">{{ event.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Headmasters -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Leadership</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Leadership Through the Decades</h2>
          <p class="mt-2 text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            7 headmasters have guided the school across 55+ years of operation.
          </p>
        </div>
        <!-- Current headmaster — full width -->
        <div class="relative overflow-hidden rounded-[20px] mb-4 animate-fade-in-up delay-1 gradient-brand">
          <div class="absolute top-0 right-0 w-56 h-56 rounded-full opacity-15 blur-3xl orb-primary" />
          <div class="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl orb-secondary" />
          <div class="relative px-6 py-5 flex items-center gap-5">
            <div class="w-14 h-14 shrink-0 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <i class="pi pi-star-fill text-amber-300 text-lg" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-white/40 text-xs font-bold">7th</span>
                <span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full text-amber-200" style="background: rgba(251,191,36,0.2); border: 1px solid rgba(251,191,36,0.3);">
                  Current Headmaster
                </span>
              </div>
              <h3 class="text-lg font-semibold text-white tracking-tight">{{ headmasters[headmasters.length - 1].name }}</h3>
              <p class="text-white/50 text-xs mt-0.5">{{ headmasters[headmasters.length - 1].quals }} &middot; {{ headmasters[headmasters.length - 1].role }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-base font-bold text-white">{{ headmasters[headmasters.length - 1].years }}</p>
              <p class="text-[10px] text-white/40">{{ headmasters[headmasters.length - 1].period }}</p>
            </div>
          </div>
        </div>

        <!-- Previous headmasters — grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(hm, i) in [...headmasters].slice(0, -1).reverse()"
            :key="hm.name"
            class="glass relative overflow-hidden p-5 animate-fade-in-up"
            :class="[
              `delay-${Math.min(i + 1, 6)}`,
              hm.ordinal === '1st' ? 'ring-2 ring-amber-300/40' :
              hm.tenure >= 15 ? 'ring-2 ring-emerald-300/40' : ''
            ]"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <div class="flex items-start justify-between gap-2 mb-1">
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="text-[10px] font-bold uppercase tracking-wide shrink-0"
                    :class="[
                      hm.ordinal === '1st' ? 'text-amber-500' :
                      hm.tenure >= 15 ? 'text-emerald-500' :
                      'text-slate-300'
                    ]"
                  >{{ hm.ordinal }}</span>
                  <h3 class="font-semibold text-slate-900 text-base truncate">{{ hm.name }}</h3>
                </div>
                <span
                  v-if="hm.role.includes('Acting')"
                  class="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-amber-50 text-amber-600 border border-amber-200/60"
                >Acting</span>
              </div>
              <p class="text-xs text-slate-400">{{ hm.quals }} &middot; {{ hm.role }}</p>
              <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400">{{ hm.period }}</span>
                <span
                  class="text-sm font-bold tracking-tight"
                  :class="[
                    hm.tenure >= 15 ? 'text-emerald-600' : 'text-slate-600'
                  ]"
                >{{ hm.years }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Location -->
      <section class="animate-fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Where We Are</p>
            <h2 class="text-3xl font-semibold tracking-tight text-slate-900 mb-4">Location</h2>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
              The school is situated in Palash, a semi-urban area in Narsingdi district known for both agriculture and
              industry, including power plants and jute mills. It serves students from nearby villages and local
              communities across the upazila.
            </p>
          </div>
          <div class="glass relative overflow-hidden p-6">
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative space-y-3">
              <div v-for="loc in location" :key="loc.label" class="flex justify-between items-baseline text-sm">
                <span class="text-slate-500">{{ loc.label }}</span>
                <span class="font-medium text-slate-900">{{ loc.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Community Role -->
      <section class="animate-fade-in-up">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Impact</p>
          <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Role in the Community</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            v-for="(item, i) in community"
            :key="item.title"
            class="glass relative overflow-hidden p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
            :class="`delay-${i + 1}`"
          >
            <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-4">
                <i :class="item.icon" class="text-xl text-primary-600" />
              </div>
              <h3 class="font-semibold text-slate-900 mb-2">{{ item.title }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="relative overflow-hidden rounded-[28px] p-12 text-center animate-fade-in-up gradient-brand">
        <div class="absolute top-0 left-1/3 w-48 h-48 rounded-full opacity-20 blur-3xl orb-secondary" />
        <div class="relative">
          <p class="text-xs font-semibold tracking-widest uppercase text-white/60 mb-3">Get Involved</p>
          <h2 class="text-3xl font-semibold text-white tracking-tight mb-3">Are you an alumnus?</h2>
          <p class="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
            Join the alumni network to reconnect with your batchmates, stay updated on events, and contribute to the community.
          </p>
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
