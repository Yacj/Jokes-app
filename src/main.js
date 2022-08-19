import { createApp } from "vue";
import App from "./App.vue";

import "uno.css";

import "@unocss/reset/normalize.css";
import "@unocss/reset/eric-meyer.css";

import "./assets/main.css";

import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";

const app = createApp(App);

import pinia from "./stores";
app.use(pinia);

import router from "./router";
app.use(router);

app.mount("#app");
