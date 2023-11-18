<script setup lang="ts">
const showNav = ref(false);
const { state } = useStore();
</script>
<template>
<Icon icon="mdi-menu" class="x2 p-1 text-gray-500 z-50 cp scale tr m-4 fixed" @click="showNav = !showNav" v-if="state.user" />
<nav class="h-screen tr fixed w-72 animate-fade-in-right"  v-if="showNav">
<Files :user="state.user" />
</nav>
</template>
<style scoped>

</style>