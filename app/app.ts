import '@picocss/pico'
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `
    <h1>Hello world with HMR!</h1>

    <p> Pico.css is a lightweight CSS framework to build quick, responsive websites and web apps. </p>

    <button @click="count++">{{ count }}</button>
    `,
  })
}
