import { defineStore, acceptHMRUpdate } from "pinia";
import { FunctionCall } from "~/types";

export const useState = defineStore("functions", () => {
  const state = reactive<FunctionCall[]>([]);
  const setState = (newState: FunctionCall[] | FunctionCall) => {
    if (Array.isArray(newState)) {
      state.length = 0;
      state.push(...newState);
    } else {
      state.push(newState);
    }
  };
  return {
    state,
    setState,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useState, import.meta.hot));
}
