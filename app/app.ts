import '@picocss/pico'
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  return createSSRApp(App)
}
