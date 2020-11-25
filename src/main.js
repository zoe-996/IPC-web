import "core-js/stable";
import "regenerator-runtime/runtime"
import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import router from './router.js'
import './assets/js/rem'
import './assets/style/base.scss'
import './directive/pwd'
import './directive/num'
import { configProvider } from 'ant-design-vue'
import {getAPI, postAPI, uploadFile, get, post, postRe} from './api/api'
Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(configProvider);
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$getAPI = getAPI;
Vue.prototype.$postAPI = postAPI;
Vue.prototype.$postRe = postRe;
Vue.prototype.$uploadFile = uploadFile;
const i18n = new VueI18n({
  locale: 'zh',//通过切换this.$i18n.locale的值来实现语言切换
  messages: {
    'zh': require('./lang/zh.json'),
    'en': require('./lang/en.json'),
    'ru': require('./lang/ru.json')
  }
})

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

