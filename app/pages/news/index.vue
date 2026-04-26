<script setup lang="ts">
import ArticleCard from '~/components/news/ArticleCard.vue'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'News | Alumni Portal',
  description: 'Alumni news, achievements, and announcements.',
  ogTitle: 'News | Alumni Portal',
  ogDescription: 'Alumni news, achievements, and announcements.',
  twitterCard: 'summary',
})

const { fetchArticles, fetchCategories } = useNews()

const selectedCategory = ref<number | null>(null)
const currentPage = ref(1)
const categories = ref<{ label: string, value: number | null }[]>([])

const catList = await fetchCategories()
categories.value = [
  { label: 'All', value: null },
  ...catList.map(c => ({ label: c.name, value: c.id })),
]

const { data: articles, refresh, pending } = await useAsyncData('news', () =>
  fetchArticles({ categoryId: selectedCategory.value || undefined, page: currentPage.value }),
)

watch(selectedCategory, () => {
  currentPage.value = 1
  refresh()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <!-- Section header -->
    <div class="mb-8 animate-fade-in-up">
      <p class="text-xs font-semibold tracking-widest uppercase text-primary-600 mb-2">Community</p>
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">News & Updates</h1>
    </div>

    <div class="flex gap-2 flex-wrap mb-8 animate-fade-in-up delay-1">
      <button
        v-for="cat in categories"
        :key="String(cat.value)"
        class="px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
        :class="selectedCategory === cat.value
          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
          : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-white'"
        @click="selectedCategory = cat.value"
      >
        {{ cat.label }}
      </button>
    </div>

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 6" :key="i"
        class="rounded-[20px] h-72 animate-pulse bg-white/40 border border-slate-200"
      />
    </div>

    <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>

    <div v-else class="glass-light relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in">
      <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/50 via-transparent to-transparent" />
      <div class="relative">
        <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float bg-primary-50 border border-primary-200">
          <i class="pi pi-megaphone text-3xl text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">No articles found</h3>
        <p class="text-slate-500 text-sm">Try a different category or check back later.</p>
      </div>
    </div>
  </div>
</template>
