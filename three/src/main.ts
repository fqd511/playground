import { createApp } from "vue";
import App from "./App.vue";
import Router from "vue-router";
import routes from "./routes/index";

createApp(App)
  .use(Router.createRouter({ routes, history: Router.createWebHistory() }))
  .mount("#app");
