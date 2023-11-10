import { setupLayouts } from "virtual:generated-layouts";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { createApp } from "vue";
import { Icon } from "@iconify/vue";
import App from "./App.vue";
import generatedRoutes from "~pages";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./styles/main.scss";
import "uno.css";

const routes = setupLayouts(generatedRoutes);
const router = createRouter({
  history: createWebHistory(),
  routes,
});
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App).use(pinia).component("Icon", Icon).use(router).mount("#app");
