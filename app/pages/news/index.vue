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
  <div>
    <!-- Hero header -->
    <section class="relative overflow-hidden py-14 px-4 gradient-brand">
      <div class="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl animate-float delay-2 orb-secondary" />
      <div class="relative max-w-6xl mx-auto">
        <div class="animate-fade-in-up mb-6">
          <p class="text-xs font-semibold tracking-widest uppercase text-white/60 mb-2">Community</p>
          <h1 class="text-4xl font-semibold tracking-tight text-white">News & Updates</h1>
        </div>
        <div class="flex gap-2 flex-wrap animate-fade-in-up delay-1">
          <button
            v-for="cat in categories"
            :key="String(cat.value)"
            class="px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            :style="selectedCategory === cat.value
              ? 'background:rgba(255,255,255,0.28);border:1px solid rgba(255,255,255,0.5);color:white;box-shadow:0 2px 0 rgba(255,255,255,0.3) inset;'
              : 'background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.20);color:rgba(255,255,255,0.65);'"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-10">
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="i in 6" :key="i"
          class="rounded-[20px] h-72 animate-pulse"
          style="background:rgba(29,78,216,0.10);border:1px solid rgba(29,78,216,0.15);"
        />
      </div>

      <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
      </div>

      <div v-else class="glass relative overflow-hidden text-center py-20 px-8 max-w-md mx-auto animate-scale-in" style="background:linear-gradient(135deg,rgba(29,78,216,0.10),rgba(59,130,246,0.10));">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        <div class="relative">
          <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-float" style="background:rgba(29,78,216,0.12);border:1px solid rgba(29,78,216,0.25);">
            <i class="pi pi-megaphone text-3xl text-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-800 mb-2">No articles found</h3>
          <p class="text-slate-500 text-sm">Try a different category or check back later.</p>
        </div>
      </div>
    </div>
  </div>
</template>

