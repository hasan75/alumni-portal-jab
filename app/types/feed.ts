export type PostScope = 'general' | 'batch'
export type PostStatus = 'published' | 'hidden' | 'removed'
export type ReactionType = 'like' | 'love' | 'celebrate' | 'support'
export type CommentStatus = 'published' | 'hidden' | 'removed'

export interface FeedPost {
  id: number
  author_id: string
  author?: {
    full_name: string
    display_name: string | null
    avatar_url: string | null
    batch_year: number | null
    current_job_title: string | null
    current_company: string | null
  }
  content: string
  image_urls: string[] | null
  post_scope: PostScope
  batch_year: number | null
  reaction_count: number
  comment_count: number
  is_pinned: boolean
  status: PostStatus
  removed_by: string | null
  removal_reason: string | null
  created_at: string
  updated_at: string
  my_reaction?: ReactionType | null
  comments?: FeedComment[]
}

export interface FeedReaction {
  post_id: number
  alumni_id: string
  reaction_type: ReactionType
  created_at: string
}

export interface FeedComment {
  id: number
  post_id: number
  author_id: string
  author?: {
    full_name: string
    display_name: string | null
    avatar_url: string | null
  }
  parent_comment_id: number | null
  content: string
  status: CommentStatus
  created_at: string
  updated_at: string
  replies?: FeedComment[]
}
