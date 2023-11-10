import {
  MediumContributor,
  MediumImage,
  MediumPost,
  MediumPublication,
  MediumUser,
} from "~/types/medium";

import { defineStore, acceptHMRUpdate } from "pinia";

export const useMediumStore = defineStore("medium", () => {
  const mediumState = reactive({
    user: {} as MediumUser,
    posts: [] as MediumPost[],
    images: [] as MediumImage[],
    publications: [] as MediumPublication[],
    contributors: [] as MediumContributor[],
  });

  return {
    mediumState,
  };
});
