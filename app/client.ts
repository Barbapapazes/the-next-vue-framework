/// <reference types="vite/client" />

import type { App } from 'vue'
import { createApp } from './app'

export { createApp }

const app = createApp()

if (!window.$root)
  app.mount('#root')

window.$root = window.$root || app

if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    window.$root.unmount()
    const app = mod.createApp()
    window.$root = app
    app.mount('#root')
  })
}

declare global {
  interface Window {
    $root: App<Element>
  }
}
