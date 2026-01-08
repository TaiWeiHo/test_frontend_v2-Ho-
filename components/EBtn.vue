<template>
  <button
    class="px-4 py-2 rounded text-white font-bold transition-all duration-200"
    :class="[
      variant === 'primary' ? 'bg-green-600 hover:bg-green-500 active:bg-green-700' :
      variant === 'warning' ? 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-gray-900' :
      variant === 'danger' ? 'bg-red-600 hover:bg-red-500 active:bg-red-700' : 
      'bg-gray-600'
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'warning' | 'danger';
}>();
defineEmits(['click']);
</script>