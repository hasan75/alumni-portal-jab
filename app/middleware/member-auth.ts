// Middleware: require active alumni session
// Apply via: definePageMeta({ middleware: 'member-auth' })

export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login')
  }

  // Check alumni profile status
  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('alumni_profiles')
    .select('status')
    .eq('id', user.value.id)
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
