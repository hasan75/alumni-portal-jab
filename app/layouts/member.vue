<script setup lang="ts">
import Header from '~/components/layouts/header.vue'
import Footer from '~/components/layouts/footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen gradient-brand-light">
    <Header />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
      <slot />
    </main>
    <Footer />
  </div>
</template>
