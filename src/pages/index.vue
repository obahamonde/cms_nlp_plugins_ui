<script setup lang="ts">
const { state } = useStore();
</script>
<template>
  <main class="h-screen w-full">
    <Landing v-if="!state.user" />

    <TipTap class="h-full w-full" v-else />
  </main>
</template>
<route lang="yaml">
meta:
  layout: "home"
</route>
w
