# xv-shared

**English** | [中文文档](./README.zh-CN.md)

Shared frontend tooling configurations for [XtraVisions](https://github.com/XtraVisionsAI) projects.

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE) [![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) [![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite) [![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) [![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

## Packages

| Package | Version | Description |
| --- | --- | --- |
| [`@xv-shared/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/eslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) | Opinionated ESLint flat config for Vue 3 projects |
| [`@xv-shared/vite`](./packages/vite) | [![npm](https://img.shields.io/npm/v/@xv-shared/vite)](https://www.npmjs.com/package/@xv-shared/vite) | Shared Vite configuration and plugins |
| [`@xv-shared/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/stylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) | Opinionated Stylelint config for Vue 3 projects |
| [`@xv-shared/ts-config`](./packages/ts-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/ts-config)](https://www.npmjs.com/package/@xv-shared/ts-config) | Shared TypeScript configuration |

## Usage

### ESLint Config

```bash
pnpm add -D @xv-shared/eslint-config
```

```js
// eslint.config.js
import defineConfig from '@xv-shared/eslint-config'

export default defineConfig()
```

All options are optional. Pass an object to customize:

```js
export default defineConfig({
  typescript: true, // enable TypeScript rules (auto-detected)
  vue: true, // enable Vue rules (auto-detected)
  unocss: { attributify: true, strict: false },
  prettier: {
    rules: { printWidth: 120, semi: false, singleQuote: true }
  },
  regexp: false, // enable regexp rules
  e18e: false // enable e18e perf rules
})
```

### Vite Config

```bash
pnpm add -D @xv-shared/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins(
    {
      // All options are optional — omit any section to use defaults
      autoImport: {
        // unplugin-auto-import: default imports vue/vue-router/pinia/@vueuse/core
        dts: 'types/generated/auto-import.d.ts'
      },
      autoComponents: {
        // unplugin-vue-components: default scans src/**/components
        // includes NaiveUI, VueUse, Icons resolvers
        dts: 'types/generated/auto-components.d.ts'
      },
      autoRouter: {
        // unplugin-vue-router: file-based routing
        dts: 'types/generated/typed-router.d.ts'
      },
      autoLayout: {
        // vite-plugin-vue-meta-layouts
        skipTopLevelRouteLayout: true
      },
      html: {
        // vite-plugin-html
        entry: '/src/main.ts',
        template: 'index.html',
        minify: true
      },
      icon: {
        // unplugin-icons: default loads SVGs from src/assets/svg-icons as 'local' collection
        iconDir: 'src/assets/svg-icons'
      },
      css: {
        // unocss/vite: transformerDirectives and transformerVariantGroup are always included
        // pass additional UnoCSS vite plugin options here if needed
      }
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

### Stylelint Config

```bash
pnpm add -D @xv-shared/stylelint-config
```

```json
// .stylelintrc.json
{
  "extends": "@xv-shared/stylelint-config"
}
```

### TypeScript Config

```bash
pnpm add -D @xv-shared/ts-config
```

```json
// tsconfig.json
{
  "extends": "@xv-shared/ts-config/base"
}
```

## Requirements

- Node.js >= 18
- pnpm >= 10

## License

[MIT](./LICENSE) &copy; XtraVisions
