<script setup lang="ts">
const { fetchConfig } = useSiteConfig()
if (!import.meta.prerender) {
  await fetchConfig()
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
  <ConfirmDialog />
</template>
