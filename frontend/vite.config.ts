import path from 'path'
import type { BuildOptions } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
// import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-md'
import Imagemin from 'vite-plugin-imagemin'
import Inspect from 'vite-plugin-inspect'
import inject from '@rollup/plugin-inject'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const isProd = mode === 'production'

  const build: BuildOptions = {
    manifest: isProd,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      plugins: [
        // @ts-expect-error it works
        inject({ Buffer: ['buffer', 'Buffer'] }),
      ],
    },
  }

  return {
    base: process.env.VITE_BASE_PATH,
    define: {
      global: 'globalThis',
    },
    build,

    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        'stream': 'stream-browserify',
        'http': 'agent-base',
      },
      // dedupe: [
      //   'lodash',
      //   'buffer',
      //   'buffer-layout',
      //   'eventemitter3',
      //   '@solana/web3.js',
      // ],
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/global.scss" as *;',
        },
      },
    },

    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/],
        // reactivityTransform: true,
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/head',
          '@vueuse/core',
          // {
          //   '@package': ['...'],
          // },
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: ['src/hooks', 'src/stores'],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            // directives: true,
            ssr: !!process.env.VITE_SSG,
          }),
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            ssr: !!process.env.VITE_SSG,
          }),
        ],
        dts: 'types/components.d.ts',
      }),

      // https://github.com/antfu/vite-plugin-md
      Markdown({
        headEnabled: true,
      }),

      Imagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4, strip: true },
        svgo: {
          plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
        },
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:3333/__inspect/ to see the inspector
      Inspect(),
    ],

    server: {
      fs: {
        strict: true,
      },
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      // crittersOptions: {
      //   mergeStylesheets: true,
      //   reduceInlineStyles: true,
      // },
      // onFinished() {
      //   const hostname = process.env.VITE_BASE_URL
      //   if (hostname) {
      //     generateSitemap({
      //       hostname,
      //     })
      //   }
      // },
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'nprogress',
        'element-plus/es',
        '@vueuse/core',
        '@vueuse/head',
      ],
      exclude: ['vue-demi'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          GlobalsPolyfills({
            process: true,
            buffer: true,
          }),
        ],
      },
    },

    // https://github.com/vitest-dev/vitest
    // test: {
    //   include: ['test/**/*.test.ts'],
    //   environment: 'jsdom',
    //   deps: {
    //     inline: ['@vue', '@vueuse', 'vue-demi'],
    //   },
    // },
  }
})
