<script setup lang="ts">
import type { User } from "firebase/auth";
import TextBlock from "./TextBlock.vue";
import GoogleSearch from "./GoogleSearch.vue";
const props = defineProps<{
  user: User;
}>();

const MAPPING = {
  GoogleSearch: GoogleSearch,
};
const message = ref("");
const { isListening, speech, result } = useSpeech();
const useFunction = async () => {
  if (!message.value) return;
  try {
    const namespace = props.user.uid;
    await useFetch(`/api/functions/${namespace}?text=` + message.value, {
      method: "POST",
    }).text();
  } catch (e: any) {
    console.log(e);
  }
  message.value = "";
  isListening.value = false;
};

const handleSpeech = () => {
  if (isListening.value) {
    speech.stop();
    useFunction();
  } else {
    speech.start();
  }
};

watch(result, (val) => {
  if (val) {
    message.value = val;
  }
});

const getfromMapping = (name: string) => {
  //@ts-ignore
  return MAPPING[name] || TextBlock;
};
</script>
<template>
  <div class="col center py-24 overflow-auto center w-full max-w-168 min-w-128">
    <FunctionQueue :user="props.user">
      <template #default="{ state }">
        <div class="col center w-full mt-8" v-for="s in state">
          <component
            :is="getfromMapping(s.name)"
            :content="s.data"
            :mounted="false"
          />
        </div>
      </template>
    </FunctionQueue>
  </div>
  <div class="row center gap-4">
    <Input
      type="text"
      v-model:modelValue="message"
      class="input"
      placeholder="Call a function..."
      :on-enter="useFunction"
    />

    <Icon
      :icon="!isListening ? 'mdi-microphone' : 'mdi-microphone-off'"
      class="x2 z-50 cp scale text-black dark:text-white"
      @click="handleSpeech"
    />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  margin-top: 10px;
  margin-right: 4rem;
  padding: 0 2px;
  overflow: auto;
  gap: 8px;
  width: 100%;
  text-align: center;
  color: white;
}

/* For tablets */
@media (min-width: 768px) {
  .main-container {
    max-width: 512px;
  }
}

/* For small laptops */
@media (min-width: 1024px) {
  .main-container {
    max-width: 768px;
  }
}

/* For laptops and desktops */
@media (min-width: 1280px) {
  .main-container {
    max-width: 1024px;
  }
}

/* For large screens */
@media (min-width: 1440px) {
  .main-container {
    max-width: 1280px;
  }
}
</style>
