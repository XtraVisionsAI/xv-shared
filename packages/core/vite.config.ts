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
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'naive-ui', '@vueuse/core', 'lodash-es', 'vue-draggable-plus'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs'
      }
    }
  }
})
