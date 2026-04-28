<script setup lang="ts">
const { fetchConfig } = useSiteConfig()
await fetchConfig()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
  <ConfirmDialog />
</template>
