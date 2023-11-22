<script setup lang="ts">
import { RouterLink } from 'vue-router';
const { logIn, logOut, user } = useAuth();
const routes = ref([
  {
    title: "Chatbot",
    icon: "mdi-chat",
    to: "/",
  },
  {
    title: "Blog Editor",
    icon: "mdi-pencil-box-outline",
    to: "/blog",
  },
  {
    title: "Code Editor",
    icon: "mdi-code-braces",
    to: "/code",
  }
]);
</script>
<template>
  <div
    class="row center rounded-full bg-zinc-800 p-2 max-w-max animate-fade-in-up my-8 mx-auto bottom-0 right-0 left-0 fixed z-50"
  >
    <div class="flex space-x-2 border-r border-zinc-600 px-3">
      <Icon
        icon="mdi-account-circle"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="logIn()"
        v-if="!user"
      />
      <img :src="user?.photoURL!" class="rounded-full w-8 h-8" v-if="user" />
    </div>
    <div class="flex space-x-2 border-r border-zinc-600 pr-1" v-if="user">
    
      <RouterLink class="toolbar-btn cp" :title="tab.title" :to="tab.to" v-for="tab in routes">
        <Icon
          :icon="tab.icon"
          class="x2"
          :class="
            tab.to === $route.path
              ? 'text-secondary'
              : 'text-primary hover:text-secondary'  
        "/>

        <span class="sr-only">{{ tab.title }}</span>
      </RouterLink>

      <button class="toolbar-btn cp" title="Logout">
        <Icon
          icon="mdi-logout"
          class="x2 text-gray-500 hover:text-warning"
          @click="logOut()"
        />
        <span class="sr-only">Logout</span>
      </button>
    </div>
  </div>
</template>
