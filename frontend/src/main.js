import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import store from './store/store'
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n/i18n'

Vue.use(Vuex);

Vue.config.productionTip = false
new Vue({
  i18n,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
