<script setup lang="ts">
defineProps<{
  status: 'pending' | 'active' | 'suspended' | 'rejected'
}>()

const statusConfig = {
  pending: { label: 'Pending', style: 'background:rgba(251,191,36,0.2);color:#fcd34d;border:1px solid rgba(251,191,36,0.35);' },
  active: { label: 'Active', style: 'background:rgba(52,199,89,0.2);color:#86efac;border:1px solid rgba(52,199,89,0.35);' },
  suspended: { label: 'Suspended', style: 'background:rgba(249,115,22,0.2);color:#fdba74;border:1px solid rgba(249,115,22,0.35);' },
  rejected: { label: 'Rejected', style: 'background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.35);' },
}
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
    :style="statusConfig[status]?.style || 'background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.2);'"
  >
    {{ statusConfig[status]?.label || status }}
  </span>
</template>

