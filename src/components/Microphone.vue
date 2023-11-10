<script setup lang="ts">
const { speech, isListening, result, fetchAudio } = useSpeech("es-MX");
const handleSpeech = async () => {
  if (isListening.value) {
    speech.stop();
    await fetchAudio(result.value);
    result.value = "";
  } else {
    speech.start();
  }
};
</script>
<template>
  <button class="toolbar-btn cp">
    <Icon
      :icon="isListening ? 'mdi-microphone-off' : 'mdi-microphone'"
      @click="handleSpeech()"
      class="x2 text-primary"
    />
  </button>
</template>
