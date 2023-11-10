<script setup lang="ts">
import { User } from "@firebase/auth";
import { Message } from "~/types";
const [setMessage,getMessages,_,messages] = useFirestore<Message>('messages'); 
  useFirestore<Message>("messages");
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

const handleEnter = () => {
  state.messages.unshift({
    role: "user",
    content: unref(modelValue),
    user: {
      name: props.user.displayName!,
      photoURL: props.user.photoURL!,
      id: props.user.uid,
      email: props.user.email!,
    },
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
onMounted(async () => {
  if (!props.user) return;
  await getMessages(props.user);
  // @ts-ignore
  state.messages = messages.value
});
const showEvent = ref(false);
</script>
<template>
  <section class="col center">
    <div class="sticky top-4 dark:bg-black bg-white sh rounded w-96">
      <Input
        v-model:modelValue="modelValue"
        :onEnter="handleEnter"
        :disabled="showEvent"
      />
    </div>
    <div class="chat-wrapper w-full max-w-168">
      <div class="message-wrapper max-w-168">
        <div class="chat-wrapper min-w-128">
          <ServerEvent
            :url="'/api/chat' + '?text=' + modelValue"
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
        :image="message.role === 'user' ? props.user.photoURL! : '/chatbot.svg'"
      />
    </div>
  </section>
</template>
