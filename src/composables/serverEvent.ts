export const useServerEvent = (url: string, options: EventSourceInit) => {
  const eventSource = ref<EventSource | null>(null);
  const data = ref<string>("");
  const done = ref<boolean>(false); // To track if the response is done
  const error = ref<Event | null>(null);
  const event = ref<string>("done");
  onMounted(() => {
    eventSource.value = new EventSource(url, options);
    eventSource.value.onmessage = (e: MessageEvent) => {
      data.value += e.data;
      if (data.value && !e.data) {
        done.value = true;
        eventSource.value?.close();
      }
    };

    eventSource.value.onerror = (e: Event) => {
      error.value = e;
      eventSource.value?.close();
    };
    eventSource.value.addEventListener((event.value), () => {
      done.value = true;
      eventSource.value?.close();
    }
    );
  }
  );

  onBeforeUnmount(() => {
    eventSource.value?.close();
  });

  return { data, done, error, eventSource, event };
};
