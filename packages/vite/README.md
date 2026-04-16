# @xv-shared/vite

Shared Vite configuration and plugins for [XtraVisions](https://github.com/XtraVisionsAI) Vue 3 projects.

[![npm](https://img.shields.io/npm/v/@xv-shared/vite)](https://www.npmjs.com/package/@xv-shared/vite) [![license](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Features

- Synchronous `createVitePlugins()` — use directly in `defineConfig`
- Vue 3 + JSX support (`@vitejs/plugin-vue`, `@vitejs/plugin-vue-jsx`)
- Auto-import and auto-component registration (`unplugin-auto-import`, `unplugin-vue-components`)
- File-based routing and layouts (`unplugin-vue-router`, `vite-plugin-vue-meta-layouts`)
- UnoCSS integration with transformers
- Icon support via `unplugin-icons`
- HTML template processing (`vite-plugin-html`)
- Bundle visualizer (opt-in)
- Each plugin can be toggled: `false` to disable, `true` for defaults, or an object to configure

## Install

```bash
pnpm add -D @xv-shared/vite
```

**Peer dependencies:** `vite >= 5`, `vue-router >= 5` (optional, for file-based routing)

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins(
    {
      autoImport: {
        dts: 'types/generated/auto-import.d.ts'
      },
      autoComponents: {
        dts: 'types/generated/auto-components.d.ts'
      },
      autoRouter: {
        dts: 'types/generated/typed-router.d.ts'
      },
      autoLayout: {
        skipTopLevelRouteLayout: true
      },
      html: {
        entry: '/src/main.ts',
        template: 'index.html',
        minify: true
      },
      icon: {
        iconDir: 'src/assets/svg-icons'
      },
      css: {},
      visualizer: true
    },
    mode
  )
}))
```

UnoCSS presets and theme are configured in a separate file:

```ts
// unocss.config.ts
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    // your theme tokens
  }
})
```

### Without file-based routing

For projects that manage routing manually:

```ts
export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins({
    autoRouter: false // disables autoRouter + autoLayout
    // and removes vue-router from autoImport
  })
}))
```

### Utilities

```ts
import { useEnv, createProxy } from '@xv-shared/vite'

// Typed .env variable loading
const env = useEnv(import.meta.env)

// Dev server proxy configuration
const proxy = createProxy([
  ['/api', 'http://localhost:3000']
])
```

## License

[MIT](../../LICENSE) &copy; XtraVisions
