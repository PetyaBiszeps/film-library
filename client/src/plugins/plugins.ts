import type {
  App,
  Plugin
} from 'vue'

const plugins: Plugin[] = []

export default {
  install(app: App) {
    plugins.forEach((plugin: Plugin) => app.use(plugin))
  }
} satisfies Plugin
