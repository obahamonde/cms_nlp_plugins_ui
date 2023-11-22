import { DocumentRef } from "./../types/user";
import type { Message, Assistant } from "~/types";
import type { FileObject, Thread } from "~/types";

import { User } from "firebase/auth";
import { defineStore, acceptHMRUpdate } from "pinia";


export const useStore = defineStore("state", () => {
  const state = reactive({
    name: "",
    notifications: [] as { message: string; status: string }[],
    messages: [] as DocumentRef<Message>[],
    token: null as string | null,
    files: [] as DocumentRef<FileObject>[],
    threads: [] as DocumentRef<Thread>[],
    assistant: {} as DocumentRef<Assistant>,
    user: null as User | null,
    threadId: null as string | null,
  });

  const setState = (newState: any) => {
    Object.assign(state, newState);
  };

  const notify = (message: string, status: string) => {
    state.notifications.push({ message, status });
  };

  return {
    state,
    notify,
    setState,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
