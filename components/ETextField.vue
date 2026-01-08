<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-white text-sm font-bold">{{ label }}</label>
    <input
      v-model="internalValue"
      :type="type"
      class="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
// 1. 不需要手動 import computed，Nuxt 會自動處理，請直接刪除 import 行
// import { computed } from 'vue'; 

const props = defineProps<{
  value: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string | number): void;
}>();

const internalValue = computed({
  get: () => props.value,
  // 2. 這裡加上 (val: string | number) 解決 implicit 'any' 報錯
  set: (val: string | number) => emit('update:value', val)
});
</script>