
import type { User } from "firebase/auth";

export const usePubSub = <T>(user: User) => {
  const { data, event, error, close, eventSource } = useEventSource(
    `/api/events/${user.uid}`,
  );
  const result = computed(() => {
    if (!data.value) return;
    return JSON.parse(data.value) as T;
  });

  onBeforeUnmount(() => {
    close();
  });

  return {
    error,
    eventSource,
    result,
  };
};
