<script setup lang="ts">
const { modelValue } = defineModels<{
  modelValue: string;
}>();
const props = defineProps<{
  onEnter: any;
}>();
</script>

<template>
  <input
    id="input"
    v-model="modelValue"
    v-bind="$attrs"
    type="text"
    class="w-full no-outline border-none bg-transparent text-center px-4 py-2 sticky text-black dark:text-white"
    placeholder="Enter your prompt..."
    @keydown.enter="props.onEnter"
  />
</template>
