import tailwindcss from '@tailwindcss/vite'
import AlumniPreset from './app/presets/alumni.js'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    './app/assets/css/main.css',
    'primeicons/primeicons.css',
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Alumni Portal',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'description', content: 'Connect with your fellow alumni — directory, events, news, jobs, and more.' },
        { name: 'author', content: 'Alumni Portal' },
        { name: 'theme-color', content: '#2563EB' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Alumni Portal' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/feed',
      exclude: ['/', '/directory', '/events/**', '/news/**', '/jobs/**', '/register', '/admin/login'],
    },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700], display: 'swap' },
    ],
  },

  primevue: {
    options: {
      theme: {
        preset: AlumniPreset,
        options: { darkModeSelector: false },
      },
    },
    components: {
      include: '*',
      exclude: ['Chart', 'Editor'],
    },
  },

  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'Alumni Portal <noreply@yourdomain.com>',
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Alumni Portal',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/news/**': { swr: 1800 },
    '/events/**': { swr: 900 },
    '/jobs/**': { swr: 1800 },
    '/api/**': { cors: false },
  },
})
