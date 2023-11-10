<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  options: {
    type: Object as PropType<EventSourceInit>,
    default: () => ({}),
  },
});

const emit = defineEmits(["open", "close", "done", "send"]);

const { data, error, done, eventSource } = useServerEvent(
  props.url,
  props.options,
);

const rxProps = reactive(props);

watch(done, (newDone) => {
  if (newDone) {
    emit("done");
  }
});

watch(rxProps, (newProps) => {
  if (newProps) {
    emit("close");
  }
});

watch(eventSource, (newEventSource) => {
  if (newEventSource) {
    emit("open");
  }
});

watch(data, (newData) => {
  if (newData) {
    if (!newData) return;
    emit("send", newData);
  }
});
</script>
<template>
  <slot :data="data" :error="error" :eventSource="eventSource" />
</template>
