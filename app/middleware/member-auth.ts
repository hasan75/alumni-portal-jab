// Middleware: require active alumni session
// Apply via: definePageMeta({ middleware: 'member-auth' })

export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.id) {
    return navigateTo('/login')
  }

  const { data } = await supabase
    .from('alumni_profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (!data) {
    return navigateTo('/login')
  }

  if (data.status === 'pending') {
    return navigateTo('/pending')
  }

  if (data.status === 'suspended' || data.status === 'rejected') {
    return navigateTo('/login?error=suspended')
  }
})
