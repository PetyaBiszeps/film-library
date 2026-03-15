// import clickOutside from '@/plugins/clickOutside.ts'
// import tooltip from '@/plugins/tooltip.ts'
import type {
  App,
  Plugin
} from 'vue'

const plugins: Plugin[] = [/*clickOutside, tooltip*/]

export default {
  install(app: App) {
    plugins.forEach((plugin: Plugin) => app.use(plugin))
  }
}
