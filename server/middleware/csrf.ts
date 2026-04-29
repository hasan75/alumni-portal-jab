export default defineEventHandler((event) => {
  if (event.method !== 'POST') return

  if (import.meta.dev) return

  const origin = getHeader(event, 'origin')
  if (!origin) return

  const siteUrl = useRuntimeConfig().public.siteUrl
  const allowed = [siteUrl.replace(/\/$/, '')]
  if (!allowed.includes(origin.replace(/\/$/, ''))) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
})
