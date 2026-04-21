import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.json', entryRoot: 'src' })],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
        'directives/index': resolve(__dirname, 'src/directives/index.ts'),
        'request/index': resolve(__dirname, 'src/request/index.ts'),
        'router/index': resolve(__dirname, 'src/router/index.ts'),
        'components/app-provider/index': resolve(__dirname, 'src/components/app-provider/index.ts'),
        'components/form/index': resolve(__dirname, 'src/components/form/index.ts'),
        'components/modal/index': resolve(__dirname, 'src/components/modal/index.ts'),
        'components/table/index': resolve(__dirname, 'src/components/table/index.ts'),
        'components/svg-icon/index': resolve(__dirname, 'src/components/svg-icon/index.ts'),
        'components/captcha/index': resolve(__dirname, 'src/components/captcha/index.ts'),
        'components/loading/index': resolve(__dirname, 'src/components/loading/index.ts'),
        'components/spine-text/index': resolve(__dirname, 'src/components/spine-text/index.ts'),
        'components/primitive-slot/index': resolve(__dirname, 'src/components/primitive-slot/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'naive-ui', '@vueuse/core', 'lodash-es', 'vue-draggable-plus'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
      },
    },
  }
})
