<script setup lang="ts">
const active = ref(false);
const query = ref("");
const icons = ref([
  { icon: "logos:youtube-icon", endpoint: "/api/videos" },
  { icon: "logos:github-icon", endpoint: "/api/github" },
  { icon: "logos:medium-icon", endpoint: "/api/medium" },
]);
const { mediumState } = useMediumStore();
const endpoint = ref("");
</script>
<template>
  <Icon
    icon="mdi-menu"
    class="btn-icon tr fixed m-4 z-50"
    @click="active = !active"
    :class="active ? 'text-white' : ''"
  />
  <nav
    class="col center h-screen tr fixed max-w-72 min-w-64 ml-8 bg-gray-500 animate-fade-in-right text-white"
    v-if="active"
  >
    <p class="row center w-full text-center top-8 absolute">
      <Icon icon="mdi-magnify" class="btn-icon cp scale" /><Input
        type="text"
        placeholder="Search"
        class="invert dark:filter-none border-none sh no-outline"
        v-model:model-value="query"
      />
    </p>
    <div class="row center top-24 absolute max-w-48 gap-1">
      <Icon
        :icon="icon.icon"
        class="btn-icon cp scale"
        v-for="icon in icons"
        @click="endpoint = icon.endpoint"
      />
    </div>
    <div v-if="endpoint === '/api/medium'">
      <Medium />
    </div>
  </nav>
</template>
