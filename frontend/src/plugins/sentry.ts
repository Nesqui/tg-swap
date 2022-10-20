// import type { App } from 'vue'
// import * as Sentry from '@sentry/vue'
// import { BrowserTracing } from '@sentry/tracing'
// import router from '@/router'
//
// export const install = ({ app }: { app: App<Element> }) => {
//   const dsn = import.meta.env.VITE_SENTRY_DSN
//   if (dsn) {
//     Sentry.init({
//       app,
//       dsn,
//       release: import.meta.env.VERSION,
//       environment: import.meta.env.MODE,
//       integrations: [
//         new BrowserTracing({
//           routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//           tracingOrigins: ['localhost', 'heartandsol.one', /^\//],
//         }),
//       ],
//       tracesSampleRate: 0.7,
//       ignoreErrors: [/ResizeObserver/, /Wallet/, /chrome-extension/],
//     })
//   }
// }
