<script setup lang="ts">
const { state } = useStore();
</script>
<template>
<div class="top-0 absolute " v-if="state.user">
  <Threads :user="state.user"/>
   <Chatbot :user="state.user" v-if="state.threadId"/>
  </div>
</template>
<style scoped>

</style>