<script setup lang="ts">
import { formatDate } from '~/utils/formatters'

const route = useRoute()
const slug = route.params.slug as string

const { fetchBySlug } = useNews()
const { data: article, pending } = await useAsyncData(`article-${slug}`, () => fetchBySlug(slug))

if (!article.value && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useSeoMeta({
  title: computed(() => article.value?.meta_title || article.value?.title || 'Article'),
  description: computed(() => article.value?.meta_description || article.value?.excerpt || ''),
  ogImage: computed(() => article.value?.og_image_url || article.value?.featured_image_url || ''),
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <NuxtLink to="/news" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4">
      <i class="pi pi-arrow-left text-xs" />
      Back to News
    </NuxtLink>

    <div v-if="pending" class="space-y-4">
      <div class="bg-slate-200 rounded-xl h-64 animate-pulse" />
      <div class="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
    </div>

    <article v-else-if="article">
      <img
        v-if="article.featured_image_url"
        :src="article.featured_image_url"
        :alt="article.title"
        class="w-full rounded-xl h-64 object-cover mb-6"
      >

      <div class="flex items-center gap-2 mb-3">
        <span
          v-if="article.category"
          class="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700"
        >
          {{ article.category.name }}
        </span>
        <span class="text-sm text-slate-400">{{ formatDate(article.published_at) }}</span>
        <span v-if="article.reading_time_minutes" class="text-sm text-slate-400">· {{ article.reading_time_minutes }} min read</span>
      </div>

      <h1 class="text-3xl font-bold text-slate-900 leading-tight mb-2">{{ article.title }}</h1>
      <p v-if="article.subtitle" class="text-xl text-slate-600 mb-4">{{ article.subtitle }}</p>

      <div v-if="article.author_name" class="flex items-center gap-2 mb-6 pb-6 border-b border-slate-200">
        <img v-if="article.author_avatar_url" :src="article.author_avatar_url" class="w-8 h-8 rounded-full" alt="Author">
        <div>
          <p class="text-sm font-medium text-slate-800">{{ article.author_name }}</p>
          <p v-if="article.author_bio" class="text-xs text-slate-500">{{ article.author_bio }}</p>
        </div>
      </div>

      <div
        v-if="article.content"
        class="prose prose-slate max-w-none text-slate-700 leading-relaxed"
        v-html="article.content"
      />
    </article>
  </div>
</template>
