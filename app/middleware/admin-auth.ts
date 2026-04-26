// Middleware: require admin session
// Apply via: definePageMeta({ middleware: 'admin-auth' })

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/admin/login')
  }

  // Verify the user is in admin_users table
  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', user.value.id)
    .single()

  if (!data || !data.is_active) {
    await supabase.auth.signOut()
    return navigateTo('/admin/login')
  }
})
