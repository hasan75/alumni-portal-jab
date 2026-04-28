export default defineEventHandler((event) => {
  if (event.method !== 'POST') return

  if (import.meta.dev) return

  const origin = getHeader(event, 'origin')
  const allowed = [useRuntimeConfig().public.siteUrl]
  if (!origin || !allowed.includes(origin)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
})
