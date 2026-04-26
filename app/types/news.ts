export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface ArticleCategory {
  id: number
  code: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  display_order: number
}

export interface ArticleTag {
  id: number
  code: string
  name: string
}

export interface Article {
  id: number
  slug: string
  title: string
  subtitle: string | null
  excerpt: string | null
  content: string | null
  featured_image_url: string | null
  og_image_url: string | null
  category_id: number | null
  category?: ArticleCategory
  author_name: string | null
  author_bio: string | null
  author_avatar_url: string | null
  author_alumni_id: string | null
  meta_title: string | null
  meta_description: string | null
  status: ArticleStatus
  published_at: string | null
  reading_time_minutes: number | null
  view_count: number
  is_featured: boolean
  is_breaking: boolean
  created_at: string
  updated_at: string
  tags?: ArticleTag[]
}
