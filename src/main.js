import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from "@/store/store";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(router)
app.use(store)
app.use(Toast)
app.mount('#app')
