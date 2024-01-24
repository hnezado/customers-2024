import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";

import config from "./config.json";

const app = createApp(App);

app.config.globalProperties.$config = config;

app.use(router).mount("#app");
