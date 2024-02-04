import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import mitt from "mitt";

import config from "./config.json";

const app = createApp(App);

app.config.globalProperties.$config = config;
app.config.globalProperties.$eventBus = mitt();

app.use(router).mount("#app");
