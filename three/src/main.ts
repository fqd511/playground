import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes/index";
import "normalize.css";

createApp(App)
  .use(createRouter({ routes, history: createWebHistory() }))
  .mount("#app");
