import { resolve } from 'node:path'
import mri from 'mri'
import { build, copyPublicAssets, createDevServer, createNitro, prepare, prerender, writeTypes } from 'nitropack'
import { defineEventHandler, defineLazyEventHandler, fromNodeMiddleware } from 'h3'
import { loadConfig } from 'c12'
import { build as buildVite, createServer } from 'vite'

async function main() {
  const args = mri(process.argv.slice(2))
  const command = args._[0]
  const rootDir = resolve(args._[1] || '.')

  const { config } = await loadConfig({
    configFile: 'paris.config.ts',
    defaultConfig: {
      vite: {
        resolve: {
          alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
          },
        },
      },
      nitro: {
        bundledStorage: ['templates'],
        devStorage: {
          templates: {
            driver: 'fs',
            base: '.nitro/templates',
          },
        },
        publicAssets: [
          {
            dir: '.nitro/client/assets',
            baseURL: '/assets',
            maxAge: 60 * 60 * 24 * 365,
          },
        ],
        handlers: [
          {
            route: '/**',
            handler: './app/server.ts',
          },
        ],
        devHandlers: [
          {
            route: '/__vite',
            handler: defineLazyEventHandler(async () => {
              const devViteServer = await createServer({
                appType: 'custom',
                base: '/__vite',
                server: {
                  middlewareMode: true,
                },
                resolve: {
                  alias: {
                    vue: 'vue/dist/vue.esm-bundler.js',
                  },
                },
              })

              return defineEventHandler(fromNodeMiddleware(devViteServer.middlewares))
            }),
          },
        ],
      },
    },
  })

  if (command === 'dev') {
    const nitro = await createNitro({
      rootDir,
      dev: true,
      preset: 'nitro-dev',
      ...(config.nitro ?? {}),
    })

    const template = await nitro.storage.getItem('root:index.html')
    await nitro.storage.setItem(
      'templates:index.html',
      template.replace(
        '<script type="module" src="./app/client"></script>',
        `<script type="module" src="/__vite/app/client"></script>
         <script type="module" src="/__vite/@vite/client"></script>`,
      ),
    )

    const server = createDevServer(nitro)
    await server.listen({})
    await prepare(nitro)
    await build(nitro)
    return
  }

  if (command === 'build') {
    const nitro = await createNitro({
      rootDir,
      dev: false,
      ...(config.nitro ?? {}),
    })
    await prepare(nitro)
    await writeTypes(nitro)

    await buildVite({
      build: {
        outDir: '.nitro/client',
      },
      ...config.vite ?? {},
    })

    const template = await nitro.storage.getItem('build:client:index.html')
    await nitro.storage.setItem('templates:index.html', template)

    await copyPublicAssets(nitro)

    await prerender(nitro)
    await build(nitro)
    await nitro.close()
    process.exit(0)
  }

  console.error(
    `Unknown command ${command}! Usage: node ./bin/cli.mjs dev|build`,
  )
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
