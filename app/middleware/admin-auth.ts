// Middleware: require admin session
// Apply via: definePageMeta({ middleware: 'admin-auth' })

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  const supabase = useSupabaseClient()

  // Use getUser() instead of useSupabaseUser() — works reliably
  // on both server and client immediately after sign-in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.id) {
    return navigateTo('/admin/login')
  }

  const { data } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single()

  if (!data || !data.is_active) {
    await supabase.auth.signOut()
    return navigateTo('/admin/login')
  }
})
