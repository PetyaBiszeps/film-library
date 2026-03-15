import plugins from '@/plugins/plugins.ts'
import router from '@/router/router.ts'
import store from '@/stores/store.ts'
import App from '@/App.vue'
import '@/styles/main.scss'
import {
  createApp
} from 'vue'

createApp(App)
  .use(store)
  .use(router)
  .use(plugins)
  .mount('#app')
