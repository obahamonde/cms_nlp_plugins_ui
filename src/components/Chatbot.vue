<script setup lang="ts">
import { User } from "@firebase/auth";
import { Message,FileObject } from "~/types";
const [setMessage,getMessages,_,messages] = useFirestore<Message>('messages'); 
const [__,___,____,files] = useFirestore<FileObject>('uploads');
const props = defineProps<{
  user: User;
}>();
const { state } = useStore();
const { modelValue } = defineModels<{
  modelValue: string;
}>();
const handleSend = (data: string) => {
  state.messages[0].content = data;
};

const useVision = async (url:string) => {
  const res = await fetch(`/api/vision?url=${url}&text=${unref(modelValue)}`);
  const d = await res.text();
  state.messages.unshift({
    role: "assistant",
    content: d,
    user: {
      name: props.user.displayName!,
      photoURL: props.user.photoURL!,
      id: props.user.uid,
      email: props.user.email!,
    },
    threadId: state.threadId!,
    createdAt: new Date(),
  });
};

const handleEnter = () => {
  if (!state.threadId) return;
  state.messages.unshift({
    role: "user",
    content: unref(modelValue),
    user: {
      name: props.user.displayName!,
      photoURL: props.user.photoURL!,
      id: props.user.uid,
      email: props.user.email!,
    },
    threadId: state.threadId,
    createdAt: new Date(),
  });
  state.messages.unshift({
    role: "assistant",
    content: "",
    user: {
      name: props.user.displayName!,
      photoURL: props.user.photoURL!,
      id: props.user.uid,
      email: props.user.email!,
    },
    threadId: state.threadId,
    createdAt: new Date(),
  });
  showEvent.value = true;
};
const handleDone = async () => {
  modelValue.value = "";
  showEvent.value = false;
  await setMessage(state.messages[0], props.user);
  await setMessage(state.messages[1], props.user);
};
const fileIds = ref<string[]>([]);
const fileQuery = computed(() => fileIds.value.join(","));
onMounted(() => {
  if (!props.user) return;
  getMessages(props.user);
  // @ts-ignore
  state.messages = messages.value.filter((message) => message.threadId === state.threadId);
});
watch(
  () => state.threadId,
  (threadId) => {
    if (!threadId) return;
    // @ts-ignore
    state.messages = messages.value.filter((message) => message.threadId === threadId);
  }
);
const showEvent = ref(false);
const showModal = ref(false);
const handlePush = async () => {
  try {
    const text = unref(modelValue)
    const urlParams = new URLSearchParams({
      content: text,
      thread_id: state.threadId!,
      file_ids: fileQuery.value,
    });
    await setMessage({
      role: "user",
      content: text,
      threadId: state.threadId!,
      createdAt: new Date(),
    },props.user);
    const res = await fetch(`/api/messages?${urlParams.toString()}`);
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
  fileIds.value = [];
  modelValue.value = "";
};
const running = ref("")
const run = async (run:any) => {
  console.log(run)
  if (!props.user) return;
  if (!state.threadId) return;
  running.value = run.id
 
}
const url = computed(()=>{
  if (!state.threadId) return
  if (!running.value) return
  return `/api/events?thread_id=${state.threadId}&run_id=${running.value}`
})
const eventSource = computed(()=>{
  if (!url.value) return
  return new EventSource(url.value)
})

const data = ref("")

watch(eventSource, (es) => {
  if (!es) return;
  es.onmessage = (e) => {
    data.value = e.data;
  };
  es.addEventListener("done", (e) => {
    es.close();
    running.value = ""
    setMessage({
      role: "assistant",
      content: data.value,
      threadId: state.threadId!,
      createdAt: new Date(),
    },props.user);
  });
});


watch(data, (d) => {
  if (!d) return;
  state.messages.push({
    user:{
      id:props.user.uid,
      name:props.user.displayName!,
      photoURL:props.user.photoURL!,
      email:props.user.email
    },
    content:d,
    role:"assistant",
    createdAt: new Date(),
    threadId:state.threadId!,
    }
  );
});

</script>
<template>
  <section class="col center  ">
    <div class="row center  p-1 sticky top-4 dark:bg-black bg-white sh rounded-lg w-full" >
        <Microphone />
      <Input
        v-model:modelValue="modelValue"
        :onEnter="handleEnter"
        :disabled="showEvent"
      />
      <button class="rf bg-blue px-2 py-1 text-white">{{ fileIds.length }}</button>
      <button  class="toolbar-btn cp">
      <Icon icon="mdi-upload" class="text-primary x2 hover:text-white" @click="showModal = true" />
        </button><button class="toolbar-btn cp">
      <Icon icon="mdi-send" class="text-primary x2 hover:text-white" @click="handlePush" />
        </button>
    
    
        <button class="toolbar-btn cp" v-if="state.assistant" >
      <Run :user="props.user"  :assistant_id="state.assistant.metadata.id" @run="run($event)" />
        </button>
        </div>
    <div class="chat-wrapper w-full max-w-168 mt-12">
      <div class="message-wrapper max-w-168">
        <div class="chat-wrapper min-w-128">
          <ServerEvent
            :url="'/api/chat' + '?text=' + modelValue + '&namespace=' + state.threadId"
            v-if="showEvent"
            @done="handleDone()"
            @close="showEvent = false"
            @send="handleSend($event)"
          >
          </ServerEvent>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col items-center justify-center space-y-2"
      v-for="message in state.messages"
    >
      <ChatMessage
        :content="message.content"
        :reverse="message.role === 'user'"
        :image="message.role === 'user' ? props.user.photoURL! : state.assistant.picture ? state.assistant.picture : './chatbot.svg'"
      />
    </div>
  </section>
  <Modal v-if="showModal" @close="showModal = false">
    <template #body>
      <div v-for="f in files">
       <div v-if="f.status_details.includes('image')"
      class="sh rounded"
      
    >
  <img :src="f.metadata!.url" class="w-full" />
  <button class="btn-get" @click="showModal = true">Get</button>
  <Modal v-if="showModal" @close="showModal = false">
      <template #body>
       <textarea v-model="modelValue"></textarea>
        <button class="btn-icon" @click="useVision(f.metadata!.url)"><Icon 
        icon="mdi-eye" class="text-primary x2 hover:text-white" />
        </button>
      </template>
    </Modal>
  </div>
    <div v-else-if ="f.status_details.includes('video')"
      class="sh rounded"
      :style="`background-image: url(${f.metadata!.url})`"
    ></div>
    <div v-else-if ="f.status_details.includes('audio')"
      class="sh rounded"
      :style="`background-image: url(${f.metadata!.url})`"

    ></div>
    <div v-else-if="f.status_details.includes('pdf') || f.status_details.includes('document') || f.status_details.includes('office')">
    <iframe :src="'https://docs.google.com/gview?url='+f.metadata!.url+'&embedded=true'" class="w-full"></iframe>
    </div>
    <div v-else class="sh rounded">
    <a :href="f.metadata!.url" target="_blank" class="text-accent">{{ new Date(f.created_at*1000).toLocaleDateString() }}</a>
    </div>
    <div class="row center gap-2">
       <Icon icon="mdi-plus" class="x2 text-primary rf cp scale" @click="fileIds.push(f.metadata!.id!)" />
    {{new Date(f.created_at*1000).toLocaleString() }}</div>
    </div>
 </template>
  </Modal>
   
</template>
