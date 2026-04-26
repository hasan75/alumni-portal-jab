import type { FeedPost, FeedComment, ReactionType, PostScope } from '~/types/feed'

export function useFeed() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const posts = ref<FeedPost[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)

  const PAGE_SIZE = 25

  async function fetchPosts(scope: PostScope = 'general', batchYear?: number, page: number = 1) {
    const isFirstPage = page === 1
    if (isFirstPage) loading.value = true
    else loadingMore.value = true

    error.value = null

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('feed_posts')
      .select(`
        *,
        author:alumni_profiles!author_id(full_name, display_name, avatar_url, batch_year, current_job_title, current_company)
      `)
      .eq('status', 'published')
      .eq('post_scope', scope)

    if (scope === 'batch' && batchYear) {
      query = query.eq('batch_year', batchYear)
    }

    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error: fetchError } = await query

    if (fetchError) {
      error.value = fetchError.message
    }
    else {
      const newPosts = (data as FeedPost[]) || []
      hasMore.value = newPosts.length === PAGE_SIZE

      if (isFirstPage) {
        posts.value = newPosts
      }
      else {
        posts.value = [...posts.value, ...newPosts]
      }

      // Fetch my reactions for these posts
      if (user.value && newPosts.length > 0) {
        const postIds = newPosts.map(p => p.id)
        const { data: reactions } = await supabase
          .from('feed_reactions')
          .select('post_id, reaction_type')
          .eq('alumni_id', user.value.id)
          .in('post_id', postIds)

        if (reactions) {
          const reactionMap = new Map(reactions.map(r => [r.post_id, r.reaction_type]))
          posts.value = posts.value.map(p => ({
            ...p,
            my_reaction: (reactionMap.get(p.id) as ReactionType) || null,
          }))
        }
      }
    }

    loading.value = false
    loadingMore.value = false
    return posts.value
  }

  async function createPost(content: string, imageUrls: string[] = [], scope: PostScope = 'general', batchYear?: number) {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const { data, error: insertError } = await supabase
      .from('feed_posts')
      .insert({
        author_id: user.value.id,
        content,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        post_scope: scope,
        batch_year: batchYear || null,
      })
      .select(`
        *,
        author:alumni_profiles!author_id(full_name, display_name, avatar_url, batch_year, current_job_title, current_company)
      `)
      .single()

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    // Prepend to feed
    posts.value = [data as FeedPost, ...posts.value]
    return { success: true, data: data as FeedPost }
  }

  async function toggleReaction(postId: number, reactionType: ReactionType) {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const post = posts.value.find(p => p.id === postId)
    const existingReaction = post?.my_reaction

    if (existingReaction === reactionType) {
      // Remove reaction
      const { error: deleteError } = await supabase
        .from('feed_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('alumni_id', user.value.id)

      if (!deleteError && post) {
        post.my_reaction = null
        post.reaction_count = Math.max(0, post.reaction_count - 1)
      }
      return { success: !deleteError, error: deleteError?.message }
    }
    else {
      // Upsert reaction
      const { error: upsertError } = await supabase
        .from('feed_reactions')
        .upsert({
          post_id: postId,
          alumni_id: user.value.id,
          reaction_type: reactionType,
        }, { onConflict: 'post_id,alumni_id' })

      if (!upsertError && post) {
        if (!existingReaction) post.reaction_count += 1
        post.my_reaction = reactionType
      }
      return { success: !upsertError, error: upsertError?.message }
    }
  }

  async function fetchComments(postId: number): Promise<FeedComment[]> {
    const { data, error: fetchError } = await supabase
      .from('feed_comments')
      .select(`
        *,
        author:alumni_profiles!author_id(full_name, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .eq('status', 'published')
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true })

    if (fetchError) return []
    return (data as FeedComment[]) || []
  }

  async function addComment(postId: number, content: string, parentCommentId?: number) {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    const { data, error: insertError } = await supabase
      .from('feed_comments')
      .insert({
        post_id: postId,
        author_id: user.value.id,
        content,
        parent_comment_id: parentCommentId || null,
      })
      .select(`
        *,
        author:alumni_profiles!author_id(full_name, display_name, avatar_url)
      `)
      .single()

    if (!insertError) {
      const post = posts.value.find(p => p.id === postId)
      if (post) post.comment_count += 1
    }

    return { success: !insertError, data: data as FeedComment, error: insertError?.message }
  }

  async function removePost(postId: number, reason: string) {
    const user = useSupabaseUser()
    const { error: updateError } = await supabase
      .from('feed_posts')
      .update({
        status: 'removed',
        removed_by: user.value?.id,
        removal_reason: reason,
      })
      .eq('id', postId)

    if (!updateError) {
      posts.value = posts.value.filter(p => p.id !== postId)
    }

    return { success: !updateError, error: updateError?.message }
  }

  async function hidePost(postId: number) {
    const { error: updateError } = await supabase
      .from('feed_posts')
      .update({ status: 'hidden' })
      .eq('id', postId)

    if (!updateError) {
      const post = posts.value.find(p => p.id === postId)
      if (post) post.status = 'hidden'
    }

    return { success: !updateError, error: updateError?.message }
  }

  async function fetchAllForAdmin(page: number = 1, status?: string, perPage?: number) {
    loading.value = true
    const size = perPage || PAGE_SIZE
    const from = (page - 1) * size
    const to = from + size - 1

    let countQuery = supabase
      .from('feed_posts')
      .select('id', { count: 'exact', head: true })
    if (status) countQuery = countQuery.eq('status', status)
    const { count } = await countQuery

    let query = supabase
      .from('feed_posts')
      .select(`
        *,
        author:alumni_profiles!author_id(full_name, display_name, avatar_url, batch_year)
      `)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) query = query.eq('status', status)

    const { data, error: fetchError } = await query

    loading.value = false
    if (fetchError) return { data: [], totalCount: 0 }
    return { data: (data as FeedPost[]) || [], totalCount: count || 0 }
  }

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchPosts,
    createPost,
    toggleReaction,
    fetchComments,
    addComment,
    removePost,
    hidePost,
    fetchAllForAdmin,
  }
}
