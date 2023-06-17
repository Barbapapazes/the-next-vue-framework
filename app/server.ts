import { renderToString } from "vue/server-renderer";
import { createApp } from "./app";

export default defineEventHandler(async (event) => {
  const template = await useStorage().getItem('templates:index.html') as string

  try {
    const html = await renderToString(createApp());
    return template.replace(
      '<main id="root" class="container"></main>',
      `<main id="root" class="container">${html}</main>`
    )
  } catch (error) {
    return template
  }
});
