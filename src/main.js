import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia, PiniaVuePlugin } from "pinia";
import "./assets/main.css";
import "vfonts/Lato.css";
import vue3GoogleLogin from 'vue3-google-login'
import 'vant/es/toast/style';
import 'vant/es/dialog/style';


const pinia = createPinia();
const app = createApp(App);

app.use(vue3GoogleLogin, {
    clientId: '1095385158511-rrfph32mr66ehu987jqm4hlkpja6ofre.apps.googleusercontent.com'
})

app.use(router);
app.use(PiniaVuePlugin);
app.use(pinia);

app.mount("#app");
