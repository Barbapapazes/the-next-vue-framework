import { computed, createSSRApp, ref } from 'vue'

export function createApp() {
  return createSSRApp({
    setup() {
      const count = ref(0)
      const double = computed(() => count.value * 2)
      const triple = computed(() => count.value * 3)
      return { count, double, triple }
    },
    template: `
      <h1>Hello World with HMR!</h1>

      <h2>Count: {{ count }}</h2>

      <section>
        <button @click="count++">count is: {{ count }}</button>

        <p>double is: {{ double }}</p>
        <p>triple is: {{ triple }}</p>
      </section>
    `
  })
}
