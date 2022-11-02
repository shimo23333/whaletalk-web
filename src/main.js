import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia, PiniaVuePlugin } from "pinia";
import "./assets/main.css";
import "vfonts/Lato.css";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(PiniaVuePlugin);
app.use(pinia);

app.mount("#app");
