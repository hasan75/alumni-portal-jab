import type { Article, ArticleCategory, ArticleTag } from '~/types/news'

export interface NewsFilters {
  categoryId?: number
  search?: string
  featured?: boolean
  page?: number
  perPage?: number
  status?: string
}

export function useNews() {
  const supabase = useSupabaseClient()

  const articles = ref<Article[]>([])
  const totalCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchArticles(filters: NewsFilters = {}) {
    loading.value = true
    error.value = null

    const page = filters.page || 1
    const perPage = filters.perPage || 12
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('articles')
      .select('*, category:article_categories(*)', { count: 'exact' })
      .eq('status', 'published')

    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
    if (filters.featured) query = query.eq('is_featured', true)
    if (filters.search) query = query.ilike('title', `%${sanitizeSearchTerm(filters.search)}%`)

    query = query.order('published_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      articles.value = (data as Article[]) || []
      totalCount.value = count || 0
    }

    loading.value = false
    return articles.value
  }

  async function fetchAllForAdmin(filters: NewsFilters = {}) {
    loading.value = true

    const page = filters.page || 1
    const perPage = filters.perPage || 25
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('articles')
      .select('*, category:article_categories(*)', { count: 'exact' })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('title', `%${sanitizeSearchTerm(filters.search)}%`)
    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error: fetchError, count } = await query

    loading.value = false
    if (fetchError) {
      error.value = fetchError.message
      return []
    }
    articles.value = (data as Article[]) || []
    totalCount.value = count || 0
    return articles.value
  }

  async function fetchBySlug(slug: string): Promise<Article | null> {
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*, category:article_categories(*)')
      .eq('slug', slug)
      .single()

    if (fetchError) return null

    // Increment view count
    await supabase.rpc('increment_article_views', { article_slug: slug }).catch(() => {})

    return data as Article
  }

  async function fetchCategories(): Promise<ArticleCategory[]> {
    const { data } = await supabase
      .from('article_categories')
      .select('*')
      .order('display_order')

    return (data as ArticleCategory[]) || []
  }

  async function fetchTags(): Promise<ArticleTag[]> {
    const { data } = await supabase.from('article_tags').select('*').order('name')
    return (data as ArticleTag[]) || []
  }

  async function saveArticle(article: Partial<Article>) {
    if (article.id) {
      const { data, error: updateError } = await supabase
        .from('articles')
        .update(article)
        .eq('id', article.id)
        .select()
        .single()
      return { success: !updateError, data, error: updateError?.message }
    }
    else {
      const { data, error: insertError } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single()
      return { success: !insertError, data, error: insertError?.message }
    }
  }

  async function deleteArticle(id: number) {
    const { error: deleteError } = await supabase.from('articles').delete().eq('id', id)
    return { success: !deleteError, error: deleteError?.message }
  }

  return {
    articles,
    totalCount,
    loading,
    error,
    fetchArticles,
    fetchAllForAdmin,
    fetchBySlug,
    fetchCategories,
    fetchTags,
    saveArticle,
    deleteArticle,
  }
}
