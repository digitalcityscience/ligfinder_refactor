import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import store from './store/store'
import vuetify from './plugins/vuetify';


Vue.use(Vuex);

Vue.config.productionTip = false
new Vue({
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
