import { DocumentRef } from "./../types/user";
import type { Message } from "~/types";
import { User } from "firebase/auth";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useStore = defineStore("state", () => {
  const state = reactive({
    name: "",
    notifications: [] as { message: string; status: string }[],
    eventSource: null as EventSource | null,
    messages: [] as DocumentRef<Message>[],
    token: null as string | null,
    user: null as User | null,
  });

  const setState = (newState: any) => {
    Object.assign(state, newState);
  };

  const notify = (message: string, status: string) => {
    state.notifications.push({ message, status });
  };

  watchEffect(() => {
    if (state.eventSource) {
      state.eventSource.onmessage = (event: MessageEvent) => {
        state.messages.push(event.data);
      };
    }
  });

  return {
    state,
    notify,
    setState,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
