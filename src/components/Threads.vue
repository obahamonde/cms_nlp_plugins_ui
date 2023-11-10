<script setup lang="ts">
import type { Thread } from "../types";
import type { User } from "firebase/auth";
const [setThread, getThreads, delThread, threads] =
  useFirestore<Thread>("threads");
const props = defineProps<{
  user: User;
}>();
const createThread = async () => {
  const res = await fetch("/api/thread");
  const data = await res.json();
  threads.value.push(data);
  await setThread(data, props.user);
};
const deleteThread = async (id:string) => {
  await delThread(id);
  await useFetch("/api/thread/"+id, { method: "DELETE" });
  threads.value = threads.value.filter((thread) => thread.id !== id);
};
onMounted(async () => {
  await getThreads(props.user);
});
</script>
<template>
  <section>
    <h1>Threads</h1>
    <div
      v-for="thread in threads"
      :key="thread.id"
      class="sh col center text-accent p-4 rounded"
    >
      <Icon
        icon="mdi-delete"
        class="x2 text-primary cp"
        @click="deleteThread(thread.id!)"
      />
      <p>{{ thread.id   }}</p>
      <p>{{ thread.created_at}}</p>
    </div>
    <div class="col center">
    <button class="btn-get rf" @click="createThread"><Icon class="x2" icon="mdi-plus"/> </button>
      </div>
  </section>
</template>
