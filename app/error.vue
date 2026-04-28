<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode || 500)

const errorConfig = computed(() => {
  switch (statusCode.value) {
    case 404:
      return {
        title: 'Page Not Found',
        description: 'The page you\'re looking for doesn\'t exist or has been moved.',
        icon: 'pi pi-search',
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50',
      }
    case 403:
      return {
        title: 'Access Denied',
        description: 'You don\'t have permission to view this page.',
        icon: 'pi pi-lock',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
      }
    case 500:
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        icon: 'pi pi-exclamation-triangle',
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50',
      }
    default:
      return {
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
        icon: 'pi pi-info-circle',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
      }
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen gradient-brand-light flex items-center justify-center px-6 py-16 relative overflow-hidden">
    <div class="orb-primary absolute top-1/4 -left-32 w-96 h-96 opacity-10 blur-3xl animate-float" />
    <div class="orb-secondary absolute bottom-1/4 -right-32 w-80 h-80 opacity-10 blur-3xl animate-float delay-2" />
    <div class="orb-amber absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10 blur-3xl animate-float delay-4" />

    <div class="relative z-10 w-full max-w-md animate-fade-in-up">
      <div class="glass relative overflow-hidden p-8 text-center">
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 via-transparent to-transparent" />

        <div class="relative">
          <div :class="[errorConfig.iconBg]" class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i :class="[errorConfig.icon, errorConfig.iconColor]" class="text-3xl" />
          </div>

          <p class="text-6xl font-bold tracking-tighter text-gray-900 mb-2 animate-fade-in-up delay-1">
            {{ statusCode }}
          </p>

          <h1 class="text-xl font-semibold text-gray-900 mb-2 animate-fade-in-up delay-2">
            {{ errorConfig.title }}
          </h1>

          <p class="text-sm text-gray-500 leading-relaxed mb-8 animate-fade-in-up delay-3">
            {{ errorConfig.description }}
          </p>

          <button
            class="animate-fade-in-up delay-4 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
            @click="handleError"
          >
            <i class="pi pi-home text-sm" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
