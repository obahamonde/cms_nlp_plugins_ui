<script setup lang="ts">
import Chatbot from "~/components/Chatbot.vue";
import Functions from "~/components/Functions.vue";
import Blogs from "~/components/Blogs.vue";
import CodeEditor from "~/components/CodeEditor.vue";
import Threads from "~/components/Threads.vue";
const { logIn, logOut, user } = useAuth();

const MAPPING = {
  chatbot: Chatbot,
  functions: Functions,
  blog: Blogs,
  code: CodeEditor,
  threads: Threads,
};

const modal = ref<string | null>(null);
const tabs = ref([
  {
    name: "Chatbot",
    icon: "mdi-chat",
    key: "chatbot",
  },
  {
    name: "Threads",
    icon: "mdi-forum",
    key: "threads",
  },
  {
    name: "Functions",
    icon: "mdi-function-variant",
    key: "functions",
  },
  {
    name: "Blog Editor",
    icon: "mdi-pencil-box-outline",
    key: "blog",
  },
  {
    name: "Code Editor",
    icon: "mdi-code-braces",
    key: "code",
  },
]);

const handleModal = (key: string) => {
  modal.value = modal.value === key ? null : key;
};

const get = (key: string) => {
  //@ts-ignore
  return MAPPING[key] || Chatbot;
};
</script>
<template>
  <Modal v-if="modal" @close="modal = null">
    <template #body>
      <component :is="get(modal)" :user="user" :mounted="true" />
    </template>
  </Modal>
  <div
    class="row center rounded-full bg-zinc-800 p-2 max-w-max animate-fade-in-up my-8 mx-auto bottom-0 right-0 left-0 absolute"
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
      <Microphone />
      <button class="toolbar-btn cp" :title="tab.name" v-for="tab in tabs">
        <Icon
          :icon="tab.icon"
          class="x2"
          :class="
            modal === tab.key
              ? 'text-secondary'
              : 'text-accent hover:text-secondary'
          "
          @click="handleModal(tab.key)"
        />
        <span class="sr-only">{{ tab.name }}</span>
      </button>

      <button class="toolbar-btn cp" title="Logout">
        <Icon
          icon="mdi-logout"
          class="x2 text-gray-500 hover:text-warning"
          @click="logOut()"
        />
        <span class="sr-only">Logout</span>
      </button>
      <button class="toolbar-btn cp" title="Dark Mode">
        <Icon
          icon="mdi-theme-light-dark"
          class="x2 text-gray-500 hover:text-warning"
          @click="toggleDark()"
        />
        <span class="sr-only">Dark Mode</span>
      </button>
    </div>
  </div>
</template>
