import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js'
import App from './app.js'
console.log(App)
console.log(Vue)
Vue.component('App', App)


new Vue({
  render: h => h(App),
}).$mount('#chat')