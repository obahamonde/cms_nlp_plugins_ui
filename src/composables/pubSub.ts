import type { FunctionCall } from "~/types";
import type { User } from "firebase/auth";

export const usePubSub = (user: User) => {
  const { data, error, close, eventSource } = useEventSource(
    `/api/functions/${user.uid}`,
  );

  const result = computed(() => {
    if (!data.value) return;
    return JSON.parse(data.value) as FunctionCall;
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
