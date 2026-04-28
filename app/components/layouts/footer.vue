<script setup lang="ts">
const { appName, institutionName, contactEmail, contactPhone } = useSiteConfig()
</script>

<template>
  <footer class="relative overflow-hidden mt-auto gradient-brand-dark">    <!-- Subtle glass overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
    <div class="relative max-w-7xl mx-auto px-4 py-14">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <!-- Brand -->
        <div class="md:col-span-2 animate-fade-in-up">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg shadow-primary-500/30">
              <img src="/images/logo_jap.png" alt="JAB Alumni" class="h-9 w-9 rounded-lg object-cover" />
            </div>
            <span class="font-semibold text-white text-lg tracking-tight">{{ appName }}</span>
          </div>
          <p class="text-sm text-white/50 leading-relaxed max-w-xs">
            The alumni network of Janata Adarsha Bidyapith, Palash, Narsingdi. Reconnect with batchmates and stay part of the community.
          </p>
          <div v-if="contactEmail || contactPhone" class="mt-4 space-y-2">
            <a v-if="contactEmail" :href="`mailto:${contactEmail}`" class="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-200">
              <i class="pi pi-envelope text-xs" />
              {{ contactEmail }}
            </a>
            <a v-if="contactPhone" :href="`tel:${contactPhone}`" class="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-200">
              <i class="pi pi-phone text-xs" />
              {{ contactPhone }}
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="animate-fade-in-up delay-1">
          <h4 class="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">Explore</h4>
          <ul class="space-y-2.5 text-sm">
            <li v-for="link in [
              { label: 'About School', to: '/about' },
              { label: 'Alumni Directory', to: '/directory' },
              { label: 'Events', to: '/events' },
              { label: 'News', to: '/news' },
              { label: 'Job Board', to: '/jobs' },
            ]" :key="link.to">
              <NuxtLink :to="link.to" class="text-white/50 hover:text-white transition-colors duration-200">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div class="animate-fade-in-up delay-2">
          <h4 class="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">Account</h4>
          <ul class="space-y-2.5 text-sm">
            <li v-for="link in [
              { label: 'Sign In', to: '/login' },
              { label: 'Register', to: '/register' },
              { label: 'Alumni Feed', to: '/feed' },
              { label: 'My Profile', to: '/profile' },
            ]" :key="link.to">
              <NuxtLink :to="link.to" class="text-white/50 hover:text-white transition-colors duration-200">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p class="text-xs text-white/30">
          &copy; {{ new Date().getFullYear() }} {{ institutionName }}. All rights reserved.
        </p>
        <p class="text-xs text-white/20">
          Powered by JAB Alumni Platform
        </p>
      </div>
    </div>
  </footer>
</template>
