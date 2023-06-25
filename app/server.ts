import { renderToString } from '@vue/server-renderer'
import { createApp } from './app'

export default defineEventHandler(async () => {
  const template = await useStorage().getItem('templates:index.html') as string

  const app = createApp()

  const html = await renderToString(app)

  const render = template.replace('<!-- ssr-content -->', html)

  return render
})
