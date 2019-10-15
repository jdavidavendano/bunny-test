import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import App from './App.vue';

// Connection with users microservice
const httpUsers = axios.create({
  baseURL: process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://181.135.251.250:3000/',
});

Vue.prototype.$httpUsers = httpUsers;

// Connection with tasks microservice
const httpTasks = axios.create({
  baseURL: process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://181.135.251.250:3001/',
});

Vue.prototype.$httpTasks = httpTasks;

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
