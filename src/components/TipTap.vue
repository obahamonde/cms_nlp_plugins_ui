<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

type Post = {
  title: string;
  content: string;
  updatedAt: Date;
};

const [getPosts, addPost, posts] = useFirestore<Post>("posts");
const title = ref("");
const { modelValue } = defineModels<{
  modelValue: string;
}>();

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: true }),
    Image.configure(),
  ],
  content: modelValue.value,
});
const isTyping = ref(false);

const onTab = (e: KeyboardEvent) => {
  e.preventDefault();
  if (!editor.value) return;
  editor.value.chain().insertContent("    ").run();
};
const autoComplete = async () => {
  if (!editor.value) return;
  const context = editor.value.getText();
  isTyping.value = true;
  const { data } = await useFetch(
    `/api/autocomplete/blog?text=${context}`,
  ).text();

  if (!data.value) {
    return;
  }
  for (let i = 0; i < data.value.length; i++) {
    editor.value
      .chain()
      .insertContent(data.value[i], {
        parseOptions: { preserveWhitespace: true },
      })
      .run();
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  isTyping.value = false;
};
const handleKeyDown = async (e: KeyboardEvent) => {
  if (!editor.value) return;

  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();
    await autoComplete();
  }
};
const { state } = useStore();
const savePost = async () => {
  if (!editor.value) return;
  if (!title.value) return;
  const content = editor.value.getHTML();
  const post = {
    title: title.value,
    content,
    updatedAt: new Date(),
  };
  await addPost(post, state.user!);
};

onMounted(() => {
  editor.value?.commands.setContent(modelValue.value);
  editor.value?.commands.focus();
});

onUnmounted(() => {
  editor.value?.destroy();
});
</script>
<template>
  <div class="min-w-128 max-w-376 w-full">
    <Input v-model:modelValue="title" placeholder="Title" />
    <nav
      class="flex items-center justify-between flex-wrap bg-black rounded sh p-2 m-4 row center text-white gap-4 px-8"
      v-if="editor"
    >
      <Icon
        icon="mdi-format-bold"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleBold().run()"
      />
      <Icon
        icon="mdi-format-italic"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleItalic().run()"
      />
      <Icon
        icon="mdi-format-strikethrough-variant"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleStrike().run()"
      />
      <Icon
        icon="mdi-format-quote-close"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleBlockquote().run()"
      />
      <Icon
        icon="mdi-format-list-bulleted"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleBulletList().run()"
      />
      <Icon
        icon="mdi-format-list-numbered"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleOrderedList().run()"
      />
      <Icon
        icon="mdi-code-braces"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleCodeBlock().run()"
      />
      <Icon
        icon="mdi-format-header-1"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleHeading({ level: 1 }).run()"
      />
      <Icon
        icon="mdi-format-header-2"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleHeading({ level: 2 }).run()"
      />
      <Icon
        icon="mdi-format-header-3"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleHeading({ level: 3 }).run()"
      />
      <Icon
        icon="mdi-format-header-4"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleHeading({ level: 4 }).run()"
      />
      <Icon
        icon="mdi-format-header-5"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleHeading({ level: 5 }).run()"
      />
      <Icon
        icon="mdi-format-header-6"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="editor.chain().toggleHeading({ level: 6 }).run()"
      />
      <img
        src="/chatbot.svg"
        class="rounded-full w-8 h-8 cp scale"
        :class="isTyping ? 'animate-bounce' : ''"
        @click="autoComplete()"
      />
      <Icon
        icon="mdi-floppy"
        class="x2 p-1 text-gray-500 z-50 cp scale"
        @click="savePost"
      />
    </nav>
    <EditorContent
      class="tiptap bg-transparent h-full p-2 rounded no-outline markdown-body"
      :editor="editor"
      @keydown.tab="onTab"
      @keydown="handleKeyDown"
      v-model:modelValue="modelValue"
    />
  </div>
</template>
<style lang="scss">
/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
    @apply outline-none;
    @apply bg-white;
    @apply typewriter;
  }

  img {
    max-width: 20%;
  }

  div {
    @apply bg-white;
    @apply outline-none;
    @apply m-2 rounded sh;
    @apply markdown-body;
    @apply min-h-128;
    @apply p-4;
  }
}
</style>
