
import type { Run } from "../types";

export const usePubSub = (run: Run) => {
  const { state } = useStore();
  if (!state.threadId) return;
  const { data, error, close, eventSource } = useEventSource(
    `/api/events?thread_id${state.threadId}&run_id=${run.metadata.id!}`,
  );;

  onBeforeUnmount(() => {
    close();
  });

  return {
    data,
    error,
    eventSource,

  };
};
