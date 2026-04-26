<script setup lang="ts">
import type { Article } from '~/types/news'
import { formatDateShort, truncate } from '~/utils/formatters'

defineProps<{
  article: Article
  featured?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="`/news/${article.slug}`"
    class="glass-light relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 block group"
    :class="featured ? 'md:flex' : ''"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent z-10" />

    <!-- Image -->
    <div
      class="relative overflow-hidden"
      :class="[featured ? 'md:w-64 md:h-auto shrink-0 rounded-l-[18px]' : 'h-44 rounded-t-[18px]', 'h-44']"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      <img
        v-if="article.featured_image_url"
        :src="article.featured_image_url"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
        <i class="pi pi-image text-4xl" />
      </div>
      <div v-if="article.is_breaking" class="absolute top-3 left-3 z-10">
        <span class="text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wide bg-red-500 border border-red-400 backdrop-blur-sm">
          Breaking
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <div class="flex items-center gap-2 mb-3">
        <span
          v-if="article.category"
          class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          :style="article.category.color
            ? `background:${article.category.color}15; color:${article.category.color}; border:1px solid ${article.category.color}30`
            : 'background:rgba(37,99,235,0.08);color:#2563eb;border:1px solid rgba(37,99,235,0.2);'"
        >
          {{ article.category.name }}
        </span>
        <span class="text-[11px] text-slate-400">{{ formatDateShort(article.published_at) }}</span>
      </div>

      <h3
        class="font-semibold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors"
        :class="featured ? 'text-lg' : ''"
      >
        {{ article.title }}
      </h3>

      <p v-if="article.excerpt" class="text-sm text-slate-500 mt-2 leading-relaxed">
        {{ truncate(article.excerpt, featured ? 200 : 100) }}
      </p>

      <div v-if="article.author_name" class="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <img
          v-if="article.author_avatar_url"
          :src="article.author_avatar_url"
          class="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
          alt="Author"
        >
        <span>{{ article.author_name }}</span>
        <span v-if="article.reading_time_minutes" class="text-slate-300">
          · {{ article.reading_time_minutes }} min read
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
