import tailwindcss from '@tailwindcss/vite'
import AlumniPreset from './app/presets/alumni.js'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: import.meta.dev },

  css: [
    './app/assets/css/main.css',
    'primeicons/primeicons.css',
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'JAB Alumni',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'description', content: 'The official alumni network of Janata Adarsha Bidyapith (EIIN 112739), Palash, Narsingdi. Connect with batchmates, events, news, and more.' },
        { name: 'author', content: 'JAB Alumni' },
        { name: 'theme-color', content: '#2563EB' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'JAB Alumni' },
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
      exclude: ['/', '/about', '/directory', '/events/**', '/news/**', '/jobs/**', '/teachers/**', '/register', '/admin/login'],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7,
      secure: !import.meta.dev,
      sameSite: 'lax',
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

  image: {
    domains: [new URL(process.env.SUPABASE_URL || 'https://placeholder.supabase.co').hostname],
  },

  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'JAB Alumni',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/news/**': { swr: 1800 },
    '/events/**': {},
    '/jobs/**': {},
    '/api/**': { cors: false },
  },
})
