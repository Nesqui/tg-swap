import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import { initApi } from './hooks/api'
// import { initWallet } from './hooks/wallet'
import generatedRoutes from '~pages'
import type { UserPlugin } from '~/types'

const base = import.meta.env.BASE_URL
const routes = setupLayouts(generatedRoutes)
// initApi()
// initWallet()

export const createApp = ViteSSG(App, { routes, base }, (ctx) => {
  // install all modules under `plugins/`
  Object.values(import.meta.glob<{ install: UserPlugin }>('./plugins/*.ts', { eager: true }))
    .forEach(i => i.install?.(ctx))
})

