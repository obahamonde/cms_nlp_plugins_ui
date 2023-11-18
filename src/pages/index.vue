<script setup lang="ts">
const { state } = useStore();
</script>
<template>
<div class="top-0 absolute ">
  <Threads :user="state.user"/>
   <Chatbot :user="state.user" v-if="state.threadId"/>
  </div>
</template>
<style scoped>

</style>