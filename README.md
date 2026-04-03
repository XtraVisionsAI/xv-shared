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

#### Using without built-in Prettier

If your project manages Prettier separately, disable the built-in integration:

```js
export default defineConfig({
  prettier: false
})
```

When `prettier: false`, the `@stylistic/eslint-plugin` rules remain active and `eslint --fix` acts as the formatter for JS/TS/Vue files.

#### Known: `eslint --fix` and `prettier --write` ordering

`@xv-shared/eslint-config` enforces JSON key ordering via `jsonc/sort-keys` and `jsonc/sort-array-values`. The auto-fix for these rules may reformat arrays in a way that differs from Prettier's output (e.g. expanding a short array to multiple lines). To keep both tools in sync, always run them in this order:

```bash
pnpm lint:fix   # apply ESLint fixes (including JSON key/array sorting)
pnpm format     # re-apply Prettier to normalise formatting
```

If you build on top of this config and want to disable the conflicting rules:

```js
export default defineConfig(
  {
    /* your options */
  },
  {
    files: ['**/*.json'],
    rules: {
      'jsonc/sort-keys': 'off',
      'jsonc/sort-array-values': 'off'
    }
  }
)
```

### Vite Config

```bash
pnpm add -D @xv-shared/vite
```

`createVitePlugins` is async — wrap it with `async/await`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(async ({ mode }) => ({
  plugins: await createVitePlugins(
    {
      // All options accept false | true | Options
      // Omit a key to use the default (enabled with defaults)
      // Pass false to disable, true to enable with defaults, or an object to configure

      autoImport: {
        // unplugin-auto-import: default imports vue/pinia/@vueuse/core
        // vue-router is automatically included when autoRouter is enabled
        dts: 'types/generated/auto-import.d.ts'
      },
      autoComponents: {
        // unplugin-vue-components: default scans src/**/components
        // includes NaiveUI, VueUse, Icons resolvers
        dts: 'types/generated/auto-components.d.ts'
      },
      autoRouter: {
        // vue-router file-based routing (requires vue-router ^5.0.0 as a peer dependency)
        // when false: autoLayout is also disabled and vue-router is removed from autoImport
        dts: 'types/generated/typed-router.d.ts'
      },
      autoLayout: {
        // vite-plugin-vue-meta-layouts (automatically disabled when autoRouter: false)
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
      },
      visualizer: true // opt-in: disabled by default, generates stats.html on build
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

#### Without file-based routing

For projects that manage routing manually:

```ts
export default defineConfig(async ({ mode }) => ({
  plugins: await createVitePlugins({
    autoRouter: false // disables autoRouter + autoLayout
    // and removes vue-router from autoImport
  })
}))
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

- Node.js >= 20
- pnpm >= 10
- ESLint >= 10
- Stylelint >= 17

## License

[MIT](./LICENSE) &copy; XtraVisions
