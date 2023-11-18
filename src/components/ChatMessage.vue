<script setup lang="ts">
const props = defineProps<{
  image: string;
  content: string;
  reverse: boolean;
}>();
</script>
<template>
  <div class="message-wrapper" :class="{ reverse: !props.reverse }">
    <img class="message-pp" :src="props.image" alt="profile-pic" />
    <div class="message-box-wrapper">
      <TextBlock :content="props.content" />
    </div>
  </div>
</template>
