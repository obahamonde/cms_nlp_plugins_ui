<script setup lang="ts">
import type { Thread } from "../types";
import type { User } from "firebase/auth";
const [setThread, getThreads, delThread, threads] =
  useFirestore<Thread>("threads");
const props = defineProps<{
  user: User;
}>();
const { request, response } = useRequest<Thread>();
const { state } = useStore();
const createThread = async () => {
  await request("/api/threads", {
    method: "POST",
      });
  response.value.metadata.id = response.value.id;
  await setThread(response.value,props.user);
};
const deleteThread = async (thread:Thread) => {
  await delThread(thread.id,props.user);
  await request(`/api/threads/${thread.metadata.id}`, { method: "DELETE" });
};
onMounted(async() => {
  getThreads(props.user)
}
);
</script>

<template>
  <section>
    <nav class="col start tl fixed w-72 gap-4 m-4 h-screen">
      <button class="btn-get rounded row center" @click="createThread">
        <Icon class="x2" icon="mdi-plus"/>New Thread
      </button>
      <div v-for="thread in threads" class="text-xs row start gap-2 sh p-2 rounded-lg w-36"
      :class="{'bg-primary text-white': state.threadId === thread.id}"
      >
        <Icon class="x1 text-warning opacity-50 hover:text-error hover:opacity-100 cp" 
             icon="mdi-delete" 
             @click="deleteThread(thread)"/>
        <strong class="hover:underline cp" @click="state.threadId = thread.metadata.id">
          {{ new Date(thread.created_at*1000).toLocaleString() }}
        </strong>
      </div>
      <Assistant class="bottom-8 absolute" :user="props.user" />
    </nav>
  </section>
</template>
