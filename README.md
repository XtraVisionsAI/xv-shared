# xv-shared

**English** | [中文文档](./README.zh-CN.md)

Shared frontend infrastructure for [XtraVisions](https://github.com/XtraVisionsAI) projects.

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE) [![@xv-shared/core](https://img.shields.io/npm/v/@xv-shared/core?label=%40xv-shared%2Fcore)](https://www.npmjs.com/package/@xv-shared/core) [![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) [![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite) [![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) [![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

## Quick Start

For a typical Vue 3 project, install all packages at once:

```bash
# Runtime dependency
pnpm add @xv-shared/core

# Dev dependencies
pnpm add -D @xv-shared/eslint-config @xv-shared/vite @xv-shared/stylelint-config @xv-shared/ts-config
```

Then create the config files:

```js
// eslint.config.js
import defineConfig from '@xv-shared/eslint-config'

export default defineConfig()
```

```json
// .stylelintrc.json
{ "extends": "@xv-shared/stylelint-config" }
```

```json
// tsconfig.json
{
  "extends": "@xv-shared/ts-config/dev.json",
  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } },
  "include": ["src/**/*", "types/**/*"]
}
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins({}, mode)
}))
```

Add the recommended scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:style": "stylelint \"src/**/*.{css,scss,vue}\"",
    "lint:style:fix": "stylelint \"src/**/*.{css,scss,vue}\" --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Packages

| Package | Version | Description |
| --- | --- | --- |
| [`@xv-shared/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@xv-shared/core)](https://www.npmjs.com/package/@xv-shared/core) | Vue 3 runtime utilities, hooks, directives, HTTP client, and components |
| [`@xv-shared/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/eslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) | Opinionated ESLint flat config for Vue 3 projects |
| [`@xv-shared/vite`](./packages/vite) | [![npm](https://img.shields.io/npm/v/@xv-shared/vite)](https://www.npmjs.com/package/@xv-shared/vite) | Shared Vite configuration and plugins |
| [`@xv-shared/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/stylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) | Opinionated Stylelint config for Vue 3 projects |
| [`@xv-shared/ts-config`](./packages/ts-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/ts-config)](https://www.npmjs.com/package/@xv-shared/ts-config) | Shared TypeScript configuration |

## Usage

### Core

```bash
pnpm add @xv-shared/core
```

Supports subpath imports for optimal tree-shaking:

```ts
// Utils
import { isFunction, deepMerge, humanFileSize } from '@xv-shared/core/utils'

// Hooks
import { useTime, useScroll } from '@xv-shared/core/hooks'

// Directives
import { clickOutside, copy, debounce } from '@xv-shared/core/directives'

// HTTP Client
import { createInstance, HttpError } from '@xv-shared/core/request'

// Router
import { onRouteChange, setRouteEmitter } from '@xv-shared/core/router'

// Components (requires naive-ui)
import { BasicForm, useForm } from '@xv-shared/core/components/form'
import { BasicModal, useModal } from '@xv-shared/core/components/modal'
import { BaseTable, TableAction } from '@xv-shared/core/components/table'
```

Or import everything from the root:

```ts
import { isFunction, useTime, createInstance, BasicForm } from '@xv-shared/core'
```

#### Icon setup (UnoCSS)

Icons in `@xv-shared/core` components use UnoCSS `preset-icons` for compile-time inlining (no CDN required). Configure your consuming project's `unocss.config.ts`:

```ts
import presetIcons from '@unocss/preset-icons'
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetIcons()],
  content: {
    pipeline: {
      include: [
        /\.(vue|ts|tsx)($|\?)/,
        /node_modules\/@xv-shared\/core\/dist\/.*\.mjs/ // scan core dist for icon classes
      ]
    }
  }
})
```

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

`createVitePlugins` is synchronous — use it directly in `defineConfig`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins(
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
export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins({
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

Stylelint does not scan files by default — you must pass a glob. Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint:style": "stylelint \"src/**/*.{css,scss,vue}\"",
    "lint:style:fix": "stylelint \"src/**/*.{css,scss,vue}\" --fix"
  }
}
```

The config includes CSS, SCSS, and Vue SFC support via `postcss-html` and `postcss-scss`, property ordering (SMACSS), and Prettier integration out of the box.

### TypeScript Config

```bash
pnpm add -D @xv-shared/ts-config
```

Three configs are available:

| Config      | Use Case                                       | Key Settings                                     |
| ----------- | ---------------------------------------------- | ------------------------------------------------ |
| `base.json` | Common base for browser apps                   | strict, ESNext target, bundler moduleResolution  |
| `dev.json`  | Vue app source code (extends base)             | JSX preserve, relaxed `noImplicitAny`, composite |
| `node.json` | Node.js scripts & build tooling (extends base) | noEmit, strict `noImplicitAny`, sourceMap        |

Typical multi-config setup:

```json
// tsconfig.json — for src/ source code
{
  "extends": "@xv-shared/ts-config/dev.json",
  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } },
  "include": ["src/**/*", "types/**/*"]
}
```

```json
// tsconfig.node.json — for vite.config.ts and other build scripts
{
  "extends": "@xv-shared/ts-config/node.json",
  "include": ["vite.config.ts"]
}
```

## Requirements

- Node.js >= 20
- pnpm >= 10
- ESLint >= 10
- Stylelint >= 17

## License

[MIT](./LICENSE) &copy; XtraVisions
