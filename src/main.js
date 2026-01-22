import { createApp } from "vue";
import router from "./router/index";
import { i18n } from "./i18n/i18n";
import App from "./App.vue";
import "./assets/css/index.css";
import { createPinia } from "pinia";
import Vue3TouchEvents from "vue3-touch-events";
const app = createApp(App);
// 強制移除深色模式 (可選擇是否強制移除深色模式)
document.documentElement.classList.remove("dark");
app.use(router);
app.use(i18n);
app.use(createPinia());
app.use(Vue3TouchEvents);
app.mount("#app");
